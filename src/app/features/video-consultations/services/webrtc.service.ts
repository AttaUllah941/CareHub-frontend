import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IceServerConfig } from '../../../core/models/video-consultation.model';

@Injectable({ providedIn: 'root' })
export class WebRtcService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private cameraVideoTrack: MediaStreamTrack | null = null;

  private readonly remoteStream$ = new Subject<MediaStream>();
  private readonly connectionState$ = new Subject<RTCPeerConnectionState>();

  async initLocalMedia(): Promise<MediaStream> {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: true,
    });
    this.cameraVideoTrack = this.localStream.getVideoTracks()[0] ?? null;
    return this.localStream;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  onRemoteStream() {
    return this.remoteStream$.asObservable();
  }

  onConnectionState() {
    return this.connectionState$.asObservable();
  }

  createPeerConnection(iceServers: IceServerConfig[]): RTCPeerConnection {
    this.closePeerConnection();
    this.peerConnection = new RTCPeerConnection({ iceServers });

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    this.peerConnection.ontrack = (event) => {
      if (event.streams[0]) {
        this.remoteStream$.next(event.streams[0]);
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.iceCandidateCallback?.(event.candidate.toJSON());
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        this.connectionState$.next(this.peerConnection.connectionState);
      }
    };

    return this.peerConnection;
  }

  private iceCandidateCallback: ((candidate: RTCIceCandidateInit) => void) | null = null;

  setIceCandidateHandler(handler: (candidate: RTCIceCandidateInit) => void): void {
    this.iceCandidateCallback = handler;
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    await this.peerConnection.setRemoteDescription(description);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) return;
    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch {
      // Ignore duplicate or late ICE candidates
    }
  }

  toggleAudio(enabled: boolean): void {
    this.localStream?.getAudioTracks().forEach((t) => {
      t.enabled = enabled;
    });
  }

  toggleVideo(enabled: boolean): void {
    if (this.screenStream) return;
    this.localStream?.getVideoTracks().forEach((t) => {
      t.enabled = enabled;
    });
  }

  async startScreenShare(): Promise<MediaStream> {
    if (!this.peerConnection || !this.localStream) {
      throw new Error('Peer connection not ready');
    }

    this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const screenTrack = this.screenStream.getVideoTracks()[0];
    const sender = this.peerConnection.getSenders().find((s) => s.track?.kind === 'video');

    if (sender) {
      await sender.replaceTrack(screenTrack);
    }

    screenTrack.onended = () => {
      void this.stopScreenShare();
    };

    return this.screenStream;
  }

  async stopScreenShare(): Promise<void> {
    if (!this.peerConnection || !this.cameraVideoTrack) return;

    const sender = this.peerConnection.getSenders().find((s) => s.track?.kind === 'video');
    if (sender) {
      await sender.replaceTrack(this.cameraVideoTrack);
    }

    this.screenStream?.getTracks().forEach((t) => t.stop());
    this.screenStream = null;
  }

  isScreenSharing(): boolean {
    return !!this.screenStream;
  }

  closePeerConnection(): void {
    this.peerConnection?.close();
    this.peerConnection = null;
    this.iceCandidateCallback = null;
  }

  stopAll(): void {
    this.closePeerConnection();
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.screenStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
    this.screenStream = null;
    this.cameraVideoTrack = null;
  }
}
