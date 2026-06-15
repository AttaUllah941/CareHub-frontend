import { Component, ElementRef, AfterViewInit, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, firstValueFrom } from 'rxjs';
import { VideoConsultationApiService } from '../../services/video-consultation-api.service';
import { VideoSignalingService } from '../../services/video-signaling.service';
import { WebRtcService } from '../../services/webrtc.service';
import { VideoChatMessage, VideoSession } from '../../../../core/models/video-consultation.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../auth/store/auth.selectors';

@Component({
  selector: 'app-video-consultation-room-page',
  standalone: true,
  imports: [FormsModule, RouterLink, AlertComponent, DatePipe],
  templateUrl: './video-consultation-room-page.component.html',
  styleUrl: './video-consultation-room-page.component.scss',
})
export class VideoConsultationRoomPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('chatContainer') chatContainerRef!: ElementRef<HTMLDivElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(VideoConsultationApiService);
  private readonly signaling = inject(VideoSignalingService);
  private readonly webrtc = inject(WebRtcService);
  private readonly store = inject(Store);

  readonly session = signal<VideoSession | null>(null);
  readonly messages = signal<VideoChatMessage[]>([]);
  readonly error = signal('');
  readonly loading = signal(true);
  readonly audioEnabled = signal(true);
  readonly videoEnabled = signal(true);
  readonly screenSharing = signal(false);
  readonly chatOpen = signal(true);
  readonly recording = signal(false);
  readonly connectionState = signal('new');
  readonly chatInput = signal('');
  readonly isDoctor = signal(false);

  private subs: Subscription[] = [];
  private appointmentId = '';
  private sessionId = '';
  private remoteSocketId: string | null = null;
  private isInitiator = false;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private pendingLocalStream: MediaStream | null = null;
  private viewReady = false;
  private bootstrapStarted = false;

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId') ?? '';
    const portal = this.route.snapshot.data['portal'] as 'patient' | 'doctor';
    this.isDoctor.set(portal === 'doctor');

    this.store.select(selectUser).subscribe((user) => {
      if (user?.role === 'DOCTOR') this.isDoctor.set(true);
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.pendingLocalStream) {
      this.attachLocalStream(this.pendingLocalStream);
      this.pendingLocalStream = null;
    }
    if (!this.bootstrapStarted) {
      void this.bootstrap();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    if (this.sessionId) {
      this.signaling.leaveSession(this.sessionId);
    }
    this.signaling.disconnect();
    this.webrtc.stopAll();
    this.mediaRecorder?.stop();
  }

  private async bootstrap(): Promise<void> {
    if (!this.viewReady) return;
    this.bootstrapStarted = true;
    try {
      const res = await firstValueFrom(this.api.createOrJoinSession(this.appointmentId));
      const { session, iceServers } = res.data;
      this.session.set(session);
      this.sessionId = session.id;

      const msgs = await firstValueFrom(this.api.getMessages(session.id));
      this.messages.set(msgs.data.messages);

      this.signaling.connect();
      this.setupSignalingListeners(iceServers);

      const localStream = await this.webrtc.initLocalMedia();
      this.attachLocalStream(localStream);

      const joinResult = await this.signaling.joinSession(session.id);
      if (!joinResult.success) {
        throw new Error(joinResult.error || 'Failed to join video room');
      }

      this.webrtc.createPeerConnection(iceServers);
      this.webrtc.setIceCandidateHandler((candidate) => {
        this.signaling.sendSignal(session.id, 'ice-candidate', candidate, this.remoteSocketId ?? undefined);
      });

      const peers = joinResult.peers ?? [];
      if (peers.length > 0) {
        this.remoteSocketId = peers[0].socketId;
        this.isInitiator = true;
        const offer = await this.webrtc.createOffer();
        this.signaling.sendSignal(session.id, 'offer', offer, this.remoteSocketId);
      }

      this.loading.set(false);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : 'Failed to start video consultation');
      this.loading.set(false);
    }
  }

  private setupSignalingListeners(iceServers: { urls: string | string[]; username?: string; credential?: string }[]): void {
    this.subs.push(
      this.signaling.onSignal().subscribe(async (payload) => {
        if (!payload.fromSocketId || payload.fromSocketId === this.signaling.getSocketId()) return;
        this.remoteSocketId = payload.fromSocketId;

        if (payload.type === 'offer') {
          if (!this.webrtc.getLocalStream()) return;
          this.webrtc.createPeerConnection(iceServers);
          this.webrtc.setIceCandidateHandler((candidate) => {
            this.signaling.sendSignal(this.sessionId, 'ice-candidate', candidate, this.remoteSocketId ?? undefined);
          });
          await this.webrtc.setRemoteDescription(payload.data as RTCSessionDescriptionInit);
          const answer = await this.webrtc.createAnswer();
          this.signaling.sendSignal(this.sessionId, 'answer', answer, this.remoteSocketId);
        } else if (payload.type === 'answer') {
          await this.webrtc.setRemoteDescription(payload.data as RTCSessionDescriptionInit);
        } else if (payload.type === 'ice-candidate') {
          await this.webrtc.addIceCandidate(payload.data as RTCIceCandidateInit);
        }
      }),

      this.signaling.onUserJoined().subscribe(async (peer) => {
        if (peer.socketId === this.signaling.getSocketId()) return;
        this.remoteSocketId = peer.socketId;
        if (!this.isInitiator) {
          this.isInitiator = true;
          const offer = await this.webrtc.createOffer();
          this.signaling.sendSignal(this.sessionId, 'offer', offer, this.remoteSocketId);
        }
      }),

      this.signaling.onChat().subscribe((msg) => {
        this.messages.update((list) => [...list, msg]);
        setTimeout(() => this.scrollChat(), 50);
      }),

      this.webrtc.onRemoteStream().subscribe((stream) => {
        if (this.remoteVideoRef?.nativeElement) {
          this.remoteVideoRef.nativeElement.srcObject = stream;
        }
      }),

      this.webrtc.onConnectionState().subscribe((state) => {
        this.connectionState.set(state);
      }),
    );
  }

  toggleAudio(): void {
    const next = !this.audioEnabled();
    this.audioEnabled.set(next);
    this.webrtc.toggleAudio(next);
    this.signaling.sendMediaState(this.sessionId, { audioEnabled: next });
  }

  toggleVideo(): void {
    const next = !this.videoEnabled();
    this.videoEnabled.set(next);
    this.webrtc.toggleVideo(next);
    this.signaling.sendMediaState(this.sessionId, { videoEnabled: next });
  }

  async toggleScreenShare(): Promise<void> {
    try {
      if (this.screenSharing()) {
        await this.webrtc.stopScreenShare();
        this.screenSharing.set(false);
      } else {
        await this.webrtc.startScreenShare();
        this.screenSharing.set(true);
      }
      this.signaling.sendMediaState(this.sessionId, { screenSharing: this.screenSharing() });
    } catch {
      this.error.set('Screen sharing was denied or is unavailable');
    }
  }

  sendMessage(): void {
    const text = this.chatInput().trim();
    if (!text) return;
    this.signaling.sendChat(this.sessionId, text);
    this.chatInput.set('');
  }

  async toggleRecording(): Promise<void> {
    if (!this.isDoctor()) return;
    try {
      if (this.recording()) {
        this.mediaRecorder?.stop();
        const durationSeconds = Math.round((this.recordedChunks.length * 1000) / 1000);
        await firstValueFrom(
          this.api.stopRecording(this.sessionId, {
            fileSizeBytes: this.recordedChunks.reduce((s, c) => s + c.size, 0),
            durationSeconds,
          }),
        );
        this.recording.set(false);
      } else {
        await firstValueFrom(this.api.startRecording(this.sessionId));
        const stream = this.webrtc.getLocalStream();
        if (stream) {
          this.recordedChunks = [];
          this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.recordedChunks.push(e.data);
          };
          this.mediaRecorder.start(1000);
        }
        this.recording.set(true);
      }
    } catch {
      this.error.set('Recording action failed');
    }
  }

  async endCall(): Promise<void> {
    if (!confirm('End this video consultation?')) return;
    try {
      await firstValueFrom(this.api.endSession(this.sessionId));
    } catch {
      // Session may already be ended
    }
    this.signaling.leaveSession(this.sessionId);
    this.webrtc.stopAll();
    this.signaling.disconnect();
    const backUrl = this.isDoctor() ? '/doctor/appointments' : '/patient/appointments';
    void this.router.navigate([backUrl]);
  }

  toggleChat(): void {
    this.chatOpen.update((v) => !v);
  }

  private scrollChat(): void {
    const el = this.chatContainerRef?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  backUrl(): string {
    return this.isDoctor() ? '/doctor/appointments' : '/patient/appointments';
  }

  private attachLocalStream(stream: MediaStream): void {
    if (this.localVideoRef?.nativeElement) {
      this.localVideoRef.nativeElement.srcObject = stream;
    } else {
      this.pendingLocalStream = stream;
    }
  }
}
