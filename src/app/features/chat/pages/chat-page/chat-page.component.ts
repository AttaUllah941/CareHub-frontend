import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { selectUser } from '../../../auth/store/auth.selectors';
import { Store } from '@ngrx/store';
import { ChatActions } from '../../store/chat.actions';
import { effect } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [FormsModule, DatePipe, AlertComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Messages</h1>
        @if (chatService.totalUnread() > 0) {
          <span class="text-sm bg-teal-100 text-teal-800 px-3 py-1 rounded-full">{{ chatService.totalUnread() }} unread</span>
        }
      </div>

      @if (chatService.error()) {
        <app-alert [message]="chatService.error()!" variant="error" />
      }

      <div class="bg-white border rounded-xl p-4 flex gap-2">
        <input
          class="border rounded-lg px-3 py-2 text-sm flex-1"
          [placeholder]="newChatPlaceholder()"
          [(ngModel)]="newChatUserId"
        />
        <button type="button" (click)="startNewChat()" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">Start Chat</button>
      </div>

      <div class="grid lg:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        <div class="lg:col-span-1 bg-white border rounded-xl overflow-hidden flex flex-col">
          <div class="p-3 border-b font-medium text-sm text-gray-600">Conversations</div>
          <div class="flex-1 overflow-y-auto divide-y">
            @for (c of chatService.conversations(); track c.id) {
              <button
                type="button"
                (click)="openConversation(c.id)"
                class="w-full text-left p-4 hover:bg-gray-50 transition"
                [class.bg-teal-50]="chatService.activeConversationId() === c.id"
              >
                <div class="flex justify-between items-start gap-2">
                  <div>
                    <p class="font-medium">{{ participantName(c) }}</p>
                    <p class="text-xs text-gray-500 truncate max-w-[200px]">{{ c.lastMessagePreview || 'No messages yet' }}</p>
                  </div>
                  @if (c.unreadCount > 0) {
                    <span class="bg-teal-600 text-white text-xs rounded-full px-2 py-0.5">{{ c.unreadCount }}</span>
                  }
                </div>
                @if (c.lastMessageAt) {
                  <p class="text-xs text-gray-400 mt-1">{{ c.lastMessageAt | date: 'short' }}</p>
                }
              </button>
            } @empty {
              <p class="p-6 text-center text-gray-500 text-sm">No conversations yet</p>
            }
          </div>
        </div>

        <div class="lg:col-span-2 bg-white border rounded-xl flex flex-col overflow-hidden">
          @if (chatService.activeConversation(); as conv) {
            <div class="p-4 border-b flex items-center justify-between">
              <div>
                <h2 class="font-semibold">{{ participantName(conv) }}</h2>
                @if (chatService.typingUserId() && chatService.typingUserId() !== user()?.id) {
                  <p class="text-xs text-teal-600">typing...</p>
                }
              </div>
              <span class="text-xs" [class.text-green-600]="chatService.socketConnected()" [class.text-gray-400]="!chatService.socketConnected()">
                {{ chatService.socketConnected() ? '● Live' : '○ Offline' }}
              </span>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              @for (msg of chatService.activeMessages(); track msg.id) {
                <div class="flex" [class.justify-end]="msg.senderUserId === user()?.id">
                  <div
                    class="max-w-[75%] rounded-2xl px-4 py-2 text-sm"
                    [class.bg-teal-600]="msg.senderUserId === user()?.id"
                    [class.text-white]="msg.senderUserId === user()?.id"
                    [class.bg-white]="msg.senderUserId !== user()?.id"
                    [class.border]="msg.senderUserId !== user()?.id"
                  >
                    @if (msg.messageType === 'ATTACHMENT' && msg.attachment) {
                      <button
                        type="button"
                        (click)="chatService.downloadAttachment(msg.id, msg.attachment!.originalFileName)"
                        class="underline text-left"
                      >
                        📎 {{ msg.attachment.originalFileName }}
                      </button>
                      @if (msg.content && msg.content !== msg.attachment.originalFileName) {
                        <p class="mt-1">{{ msg.content }}</p>
                      }
                    } @else {
                      <p class="whitespace-pre-wrap">{{ msg.content }}</p>
                    }
                    <div class="flex items-center gap-2 mt-1 text-[10px] opacity-70">
                      <span>{{ msg.createdAt | date: 'shortTime' }}</span>
                      @if (msg.senderUserId === user()?.id) {
                        @if (isRead(msg)) { <span>✓✓ Read</span> }
                        @else if (isDelivered(msg)) { <span>✓✓</span> }
                        @else { <span>✓</span> }
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="p-3 border-t flex gap-2 items-end">
              <label class="cursor-pointer px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                📎
                <input type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*,.pdf" />
              </label>
              <textarea
                class="flex-1 border rounded-lg px-3 py-2 text-sm resize-none"
                rows="2"
                placeholder="Type a message..."
                [(ngModel)]="draft"
                (keydown.enter)="$event.preventDefault(); send()"
                (input)="onTyping()"
              ></textarea>
              <button
                type="button"
                (click)="send()"
                class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm"
                [disabled]="chatService.sending() || !draft.trim()"
              >
                Send
              </button>
            </div>
          } @else {
            <div class="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Select a conversation to start messaging
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ChatPageComponent implements OnInit, OnDestroy {
  protected readonly chatService = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  readonly user = this.store.selectSignal(selectUser);
  readonly portal = signal<'patient' | 'doctor'>('patient');
  draft = '';
  newChatUserId = '';
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const messages = this.chatService.activeMessages();
      if (!messages.length) return;
      const last = messages[messages.length - 1];
      if (last.senderUserId !== this.user()?.id) {
        this.chatService.markMessageDelivered(last.id);
      }
    });
  }

  ngOnInit(): void {
    this.portal.set(this.route.snapshot.data['portal'] ?? 'patient');
    this.chatService.init();

    const doctorUserId = this.route.snapshot.queryParamMap.get('doctorUserId');
    const patientUserId = this.route.snapshot.queryParamMap.get('patientUserId');
    if (doctorUserId || patientUserId) {
      this.chatService.createConversation({
        doctorUserId: doctorUserId ?? undefined,
        patientUserId: patientUserId ?? undefined,
      });
    }

    const convId = this.route.snapshot.paramMap.get('conversationId');
    if (convId) {
      setTimeout(() => this.openConversation(convId), 400);
    }
  }

  ngOnDestroy(): void {
    this.chatService.destroy();
  }

  newChatPlaceholder(): string {
    return this.portal() === 'patient' ? 'Doctor user ID' : 'Patient user ID';
  }

  participantName(conv: {
    otherParticipant?: { firstName?: string; lastName?: string };
  }): string {
    const p = conv.otherParticipant;
    if (p) return `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim();
    return 'Unknown';
  }

  openConversation(id: string): void {
    this.chatService.selectConversation(id);
    const base = this.portal() === 'patient' ? '/patient/chat' : '/doctor/chat';
    this.router.navigate([base, id]);
  }

  startNewChat(): void {
    if (!this.newChatUserId.trim()) return;
    const payload =
      this.portal() === 'patient'
        ? { doctorUserId: this.newChatUserId.trim() }
        : { patientUserId: this.newChatUserId.trim() };
    this.chatService.createConversation(payload);
    this.newChatUserId = '';
  }

  send(): void {
    if (!this.draft.trim()) return;
    this.chatService.sendMessage(this.draft);
    this.draft = '';
    this.chatService.sendTyping(false);
  }

  onTyping(): void {
    this.chatService.sendTyping(true);
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => this.chatService.sendTyping(false), 2000);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.chatService.uploadAttachment(file);
    input.value = '';
  }

  isRead(msg: { readBy: { userId: string }[] }): boolean {
    const uid = this.user()?.id;
    return msg.readBy.some((r) => r.userId !== uid);
  }

  isDelivered(msg: { deliveredTo: { userId: string }[] }): boolean {
    const uid = this.user()?.id;
    return msg.deliveredTo.some((d) => d.userId !== uid);
  }
}
