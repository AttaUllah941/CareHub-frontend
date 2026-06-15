import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  IceServerConfig,
  VideoChatMessage,
  VideoSignalPayload,
} from '../../../core/models/video-consultation.model';

export interface VideoJoinResult {
  success: boolean;
  peers?: { socketId: string; userId: string }[];
  userId?: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class VideoSignalingService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenStorage = inject(TokenStorageService);

  private socket: Socket | null = null;
  private listenersBound = false;
  private readonly signal$ = new Subject<VideoSignalPayload>();
  private readonly chat$ = new Subject<VideoChatMessage>();
  private readonly userJoined$ = new Subject<{ userId: string; socketId: string }>();
  private readonly userLeft$ = new Subject<{ userId: string }>();
  private readonly mediaState$ = new Subject<{
    userId: string;
    audioEnabled?: boolean;
    videoEnabled?: boolean;
    screenSharing?: boolean;
  }>();

  connect(): void {
    if (!isPlatformBrowser(this.platformId) || this.socket?.connected) return;

    const token = this.tokenStorage.getAccessToken();
    if (!token) return;

    this.socket = io(environment.socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.bindListeners();
  }

  private bindListeners(): void {
    if (!this.socket || this.listenersBound) return;
    this.listenersBound = true;

    this.socket.on('video:signal', (payload: VideoSignalPayload) => this.signal$.next(payload));
    this.socket.on('video:chat', (payload: { message: VideoChatMessage }) => this.chat$.next(payload.message));
    this.socket.on('video:user-joined', (payload) => this.userJoined$.next(payload));
    this.socket.on('video:user-left', (payload) => this.userLeft$.next(payload));
    this.socket.on('video:media-state', (payload) => this.mediaState$.next(payload));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.listenersBound = false;
  }

  joinSession(sessionId: string): Promise<VideoJoinResult> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Socket not connected' });
        return;
      }
      this.socket.emit('video:join', { sessionId }, (result: VideoJoinResult) => resolve(result));
    });
  }

  leaveSession(sessionId: string): void {
    this.socket?.emit('video:leave', { sessionId });
  }

  sendSignal(sessionId: string, type: VideoSignalPayload['type'], data: unknown, targetSocketId?: string): void {
    this.socket?.emit('video:signal', { sessionId, type, data, targetSocketId });
  }

  sendChat(sessionId: string, message: string): void {
    this.socket?.emit('video:chat', { sessionId, message });
  }

  sendMediaState(
    sessionId: string,
    state: { audioEnabled?: boolean; videoEnabled?: boolean; screenSharing?: boolean },
  ): void {
    this.socket?.emit('video:media-state', { sessionId, ...state });
  }

  onSignal(): Observable<VideoSignalPayload> {
    return this.signal$.asObservable();
  }

  onChat(): Observable<VideoChatMessage> {
    return this.chat$.asObservable();
  }

  onUserJoined(): Observable<{ userId: string; socketId: string }> {
    return this.userJoined$.asObservable();
  }

  onUserLeft(): Observable<{ userId: string }> {
    return this.userLeft$.asObservable();
  }

  onMediaState(): Observable<{
    userId: string;
    audioEnabled?: boolean;
    videoEnabled?: boolean;
    screenSharing?: boolean;
  }> {
    return this.mediaState$.asObservable();
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}
