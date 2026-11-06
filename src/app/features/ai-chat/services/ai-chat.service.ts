import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiClientService } from '../../../core/api/api-client.service';
import { PaginatedConversations } from './ai-chat.types';
import {
  ChatActionResponse,
  ChatActionState,
  ChatCapabilities,
  ChatConversation,
  ChatMessage,
  ChatReply,
} from '../models/chat.models';

/** These requests have their own inline loading/error UI — skip the global bar and toast. */
const QUIET = { skipLoading: true, skipErrorToast: true } as const;

const GENERIC_ERROR = 'Something went wrong. Please try again.';

/**
 * State + API facade for the CareHub AI chat. One instance for the whole app so the
 * conversation survives opening/closing the widget and route changes.
 */
@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly api = inject(ApiClientService);

  readonly isOpen = signal(false);
  readonly capabilities = signal<ChatCapabilities | null>(null);
  readonly messages = signal<ChatMessage[]>([]);
  readonly conversations = signal<ChatConversation[]>([]);
  readonly conversationId = signal<string | null>(null);
  readonly sending = signal(false);
  readonly loadingConversation = signal(false);
  readonly loadingConversations = signal(false);
  readonly error = signal<string | null>(null);
  readonly actionStates = signal<Record<string, ChatActionState>>({});

  readonly available = computed(() => this.capabilities()?.available === true);
  readonly configured = computed(() => this.capabilities()?.configured === true);
  readonly suggestions = computed(() => this.capabilities()?.suggestions ?? []);
  readonly agentLabel = computed(() => this.capabilities()?.label ?? 'CareHub AI');
  readonly tagline = computed(() => this.capabilities()?.tagline ?? '');
  readonly welcome = computed(() => this.capabilities()?.welcome ?? '');
  readonly hasMessages = computed(() => this.messages().length > 0);

  private capabilitiesRequested = false;
  /** Guards against late responses landing in a different conversation. */
  private requestSeq = 0;
  private lastUserText = '';

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((value) => !value);
  }

  loadCapabilities(): void {
    if (this.capabilitiesRequested) return;
    this.capabilitiesRequested = true;

    this.api.get<ChatCapabilities>('/ai/capabilities', QUIET).subscribe({
      next: (res) => this.capabilities.set(res.data),
      error: () => {
        // Allow a retry on the next sign-in/open; the widget simply stays hidden meanwhile.
        this.capabilitiesRequested = false;
        this.capabilities.set(null);
      },
    });
  }

  send(text: string): void {
    const content = text.trim();
    if (!content || this.sending() || !this.configured()) return;

    this.lastUserText = content;
    this.error.set(null);
    this.messages.update((list) => [
      ...list.filter((message) => !message.failed),
      this.localMessage('user', content),
    ]);
    this.dispatch(content);
  }

  /** Re-sends the message that failed without duplicating it in the thread. */
  retry(): void {
    if (this.sending() || !this.lastUserText) return;
    this.error.set(null);
    this.messages.update((list) =>
      list.map((message) => (message.failed ? { ...message, failed: false } : message)),
    );
    this.dispatch(this.lastUserText);
  }

  newChat(): void {
    this.requestSeq += 1;
    this.conversationId.set(null);
    this.messages.set([]);
    this.error.set(null);
    this.sending.set(false);
    this.lastUserText = '';
  }

  loadConversations(): void {
    this.loadingConversations.set(true);
    this.api
      .get<PaginatedConversations>('/ai/conversations', {
        ...QUIET,
        params: { page: 1, limit: 30 },
      })
      .subscribe({
        next: (res) => {
          this.conversations.set(res.data.conversations);
          this.loadingConversations.set(false);
        },
        error: () => this.loadingConversations.set(false),
      });
  }

  openConversation(id: string): void {
    if (id === this.conversationId()) return;

    this.requestSeq += 1;
    const seq = this.requestSeq;
    this.conversationId.set(id);
    this.messages.set([]);
    this.error.set(null);
    this.loadingConversation.set(true);

    this.api
      .get<{ conversation: ChatConversation; messages: ChatMessage[] }>(`/ai/conversations/${id}`, QUIET)
      .subscribe({
        next: (res) => {
          if (seq !== this.requestSeq) return;
          this.messages.set(res.data.messages);
          this.loadingConversation.set(false);
        },
        error: (err) => {
          if (seq !== this.requestSeq) return;
          this.loadingConversation.set(false);
          this.error.set(this.messageFrom(err));
        },
      });
  }

  deleteConversation(id: string): void {
    this.api.delete<{ deleted: boolean }>(`/ai/conversations/${id}`, QUIET).subscribe({
      next: () => {
        this.conversations.update((list) => list.filter((item) => item.id !== id));
        if (this.conversationId() === id) this.newChat();
      },
      error: (err) => this.error.set(this.messageFrom(err)),
    });
  }

  confirmAction(actionId: string): void {
    this.runAction(actionId, 'confirm', 'confirming', 'done');
  }

  cancelAction(actionId: string): void {
    this.runAction(actionId, 'cancel', 'cancelling', 'cancelled');
  }

  /** Clears everything (called on sign-out so one user's chat never shows for the next). */
  reset(): void {
    this.requestSeq += 1;
    this.isOpen.set(false);
    this.capabilities.set(null);
    this.capabilitiesRequested = false;
    this.messages.set([]);
    this.conversations.set([]);
    this.conversationId.set(null);
    this.sending.set(false);
    this.error.set(null);
    this.actionStates.set({});
    this.lastUserText = '';
  }

  private dispatch(content: string): void {
    const seq = this.requestSeq;
    this.sending.set(true);

    this.api
      .post<ChatReply>(
        '/ai/chat',
        { message: content, conversationId: this.conversationId() },
        { ...QUIET },
      )
      .subscribe({
        next: (res) => {
          if (seq !== this.requestSeq) return;
          const reply = res.data;
          const isNew = this.conversationId() !== reply.conversationId;
          this.conversationId.set(reply.conversationId);
          this.messages.update((list) => [
            ...list,
            {
              id: reply.messageId,
              role: 'assistant',
              content: reply.message,
              actions: reply.actions ?? [],
              createdAt: reply.createdAt,
            },
          ]);
          if (isNew) {
            this.conversations.update((list) => [
              {
                id: reply.conversationId,
                agent: reply.agent,
                title: reply.title,
                lastMessageAt: reply.createdAt,
              },
              ...list,
            ]);
          }
          this.sending.set(false);
        },
        error: (err) => {
          if (seq !== this.requestSeq) return;
          this.messages.update((list) =>
            list.map((message, index) =>
              index === list.length - 1 && message.role === 'user'
                ? { ...message, failed: true }
                : message,
            ),
          );
          this.error.set(this.messageFrom(err));
          this.sending.set(false);
        },
      });
  }

  private runAction(
    actionId: string,
    verb: 'confirm' | 'cancel',
    working: 'confirming' | 'cancelling',
    finished: 'done' | 'cancelled',
  ): void {
    const current = this.actionStates()[actionId]?.status;
    if (current === 'confirming' || current === 'cancelling' || current === 'done' || current === 'cancelled') {
      return;
    }
    this.setActionState(actionId, { status: working });

    this.api
      .post<ChatActionResponse>(`/ai/actions/${actionId}/${verb}`, {}, QUIET)
      .subscribe({
        next: (res) => {
          this.setActionState(actionId, { status: finished });
          this.messages.update((list) => [...list, res.data.message]);
        },
        error: (err) => this.setActionState(actionId, { status: 'error', error: this.messageFrom(err) }),
      });
  }

  private setActionState(actionId: string, state: ChatActionState): void {
    this.actionStates.update((states) => ({ ...states, [actionId]: state }));
  }

  private localMessage(role: 'user' | 'assistant', content: string): ChatMessage {
    return {
      id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role,
      content,
      actions: [],
      createdAt: new Date().toISOString(),
    };
  }

  private messageFrom(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'Cannot reach CareHub right now. Check your connection.';
      const apiMessage = (error.error as { message?: string } | null)?.message;
      if (apiMessage) return apiMessage;
    }
    return GENERIC_ERROR;
  }
}
