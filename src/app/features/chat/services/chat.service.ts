import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CreateConversationRequest } from '../../../core/models/chat.model';
import { ChatApiService } from './chat-api.service';
import { ChatSocketService } from './chat-socket.service';
import { ChatActions } from '../store/chat.actions';
import {
  selectActiveConversation,
  selectActiveConversationId,
  selectActiveMessages,
  selectChatError,
  selectChatLoading,
  selectChatSending,
  selectConversations,
  selectSocketConnected,
  selectTotalUnread,
  selectTypingUserId,
} from '../store/chat.selectors';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly store = inject(Store);
  private readonly api = inject(ChatApiService);
  private readonly socket = inject(ChatSocketService);

  readonly conversations = this.store.selectSignal(selectConversations);
  readonly activeConversationId = this.store.selectSignal(selectActiveConversationId);
  readonly activeConversation = this.store.selectSignal(selectActiveConversation);
  readonly activeMessages = this.store.selectSignal(selectActiveMessages);
  readonly typingUserId = this.store.selectSignal(selectTypingUserId);
  readonly loading = this.store.selectSignal(selectChatLoading);
  readonly sending = this.store.selectSignal(selectChatSending);
  readonly error = this.store.selectSignal(selectChatError);
  readonly socketConnected = this.store.selectSignal(selectSocketConnected);
  readonly totalUnread = this.store.selectSignal(selectTotalUnread);

  init(): void {
    this.store.dispatch(ChatActions.connectSocket());
    this.store.dispatch(ChatActions.loadConversations({}));
  }

  destroy(): void {
    const id = this.activeConversationId();
    if (id) this.socket.leaveConversation(id);
    this.store.dispatch(ChatActions.disconnectSocket());
  }

  loadConversations(): void {
    this.store.dispatch(ChatActions.loadConversations({}));
  }

  selectConversation(conversationId: string | null): void {
    const prev = this.activeConversationId();
    if (prev) this.socket.leaveConversation(prev);
    this.store.dispatch(ChatActions.selectConversation({ conversationId }));
    if (conversationId) {
      this.socket.joinConversation(conversationId);
      this.store.dispatch(ChatActions.loadMessages({ conversationId }));
      this.store.dispatch(ChatActions.markRead({ conversationId }));
    }
  }

  createConversation(payload: CreateConversationRequest): void {
    this.store.dispatch(ChatActions.createConversation({ payload }));
  }

  sendMessage(content: string): void {
    const id = this.activeConversationId();
    if (!id || !content.trim()) return;
    this.store.dispatch(ChatActions.sendMessage({ conversationId: id, content: content.trim() }));
  }

  sendTyping(isTyping: boolean): void {
    const id = this.activeConversationId();
    if (!id) return;
    this.socket.sendTyping(id, isTyping);
  }

  uploadAttachment(file: File, caption?: string): void {
    const id = this.activeConversationId();
    if (!id) return;
    this.store.dispatch(ChatActions.uploadAttachment({ conversationId: id, file, caption }));
  }

  downloadAttachment(messageId: string, fileName: string): void {
    this.api.downloadAttachment(messageId).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  markMessageDelivered(messageId: string): void {
    this.socket.markDelivered(messageId);
  }

  clearError(): void {
    this.store.dispatch(ChatActions.clearError());
  }
}
