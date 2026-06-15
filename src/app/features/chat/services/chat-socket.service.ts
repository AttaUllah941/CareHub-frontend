import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  ChatDeliveredReceiptEvent,
  ChatMessage,
  ChatReadReceiptEvent,
  ChatTypingEvent,
} from '../../../core/models/chat.model';

export interface ChatJoinResult {
  success: boolean;
  conversationId?: string;
  userId?: string;
  error?: string;
}

export interface ChatSendResult {
  success: boolean;
  message?: ChatMessage;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenStorage = inject(TokenStorageService);

  private socket: Socket | null = null;
  private listenersBound = false;

  private readonly message$ = new Subject<{ message: ChatMessage; conversationId?: string }>();
  private readonly typing$ = new Subject<ChatTypingEvent>();
  private readonly readReceipt$ = new Subject<ChatReadReceiptEvent>();
  private readonly deliveredReceipt$ = new Subject<ChatDeliveredReceiptEvent>();

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

    this.socket.on('chat:message', (payload: { message: ChatMessage; conversationId?: string }) =>
      this.message$.next(payload),
    );
    this.socket.on('chat:typing', (payload: ChatTypingEvent) => this.typing$.next(payload));
    this.socket.on('chat:read-receipt', (payload: ChatReadReceiptEvent) => this.readReceipt$.next(payload));
    this.socket.on('chat:delivered-receipt', (payload: ChatDeliveredReceiptEvent) =>
      this.deliveredReceipt$.next(payload),
    );
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.listenersBound = false;
  }

  joinConversation(conversationId: string): Promise<ChatJoinResult> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Socket not connected' });
        return;
      }
      this.socket.emit('chat:join', { conversationId }, (result: ChatJoinResult) => resolve(result));
    });
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit('chat:leave', { conversationId });
  }

  sendMessage(conversationId: string, content: string): Promise<ChatSendResult> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Socket not connected' });
        return;
      }
      this.socket.emit('chat:send', { conversationId, content }, (result: ChatSendResult) => resolve(result));
    });
  }

  sendTyping(conversationId: string, isTyping: boolean): void {
    this.socket?.emit('chat:typing', { conversationId, isTyping });
  }

  markRead(conversationId: string, messageId?: string): void {
    this.socket?.emit('chat:read', { conversationId, messageId });
  }

  markDelivered(messageId: string): void {
    this.socket?.emit('chat:delivered', { messageId });
  }

  onMessage(): Observable<{ message: ChatMessage; conversationId?: string }> {
    return this.message$.asObservable();
  }

  onTyping(): Observable<ChatTypingEvent> {
    return this.typing$.asObservable();
  }

  onReadReceipt(): Observable<ChatReadReceiptEvent> {
    return this.readReceipt$.asObservable();
  }

  onDeliveredReceipt(): Observable<ChatDeliveredReceiptEvent> {
    return this.deliveredReceipt$.asObservable();
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}
