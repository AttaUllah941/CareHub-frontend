import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AiChatService } from '../../services/ai-chat.service';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ConversationSidebarComponent } from '../conversation-sidebar/conversation-sidebar.component';
import { TypingIndicatorComponent } from '../typing-indicator/typing-indicator.component';

/** Narrow screens use the full-screen layout; leaving the chat on navigation avoids covering the page. */
const MOBILE_QUERY = '(max-width: 639px)';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    ChatHeaderComponent,
    ChatInputComponent,
    ChatMessageComponent,
    ConversationSidebarComponent,
    TypingIndicatorComponent,
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWindowComponent {
  protected readonly chat = inject(AiChatService);

  readonly closed = output<void>();

  protected readonly historyOpen = signal(false);
  protected readonly skeletonRows = [1, 2, 3];
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');

  constructor() {
    // Keep the newest message in view as the thread grows or the assistant starts typing.
    effect(() => {
      this.chat.messages();
      this.chat.sending();
      this.chat.loadingConversation();
      setTimeout(() => this.scrollToBottom(), 0);
    });

    afterNextRender(() => document.getElementById('ai-chat-input')?.focus());
  }

  protected toggleHistory(): void {
    const next = !this.historyOpen();
    this.historyOpen.set(next);
    if (next) this.chat.loadConversations();
  }

  protected newChat(): void {
    this.chat.newChat();
    this.historyOpen.set(false);
  }

  protected selectConversation(id: string): void {
    this.chat.openConversation(id);
    this.historyOpen.set(false);
  }

  protected send(text: string): void {
    this.chat.send(text);
  }

  /** A result card navigated to another page: get out of the way on phones. */
  protected onNavigated(): void {
    if (typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches) {
      this.closed.emit();
    }
  }

  protected dismissError(): void {
    this.chat.error.set(null);
  }

  private scrollToBottom(): void {
    const element = this.scroller()?.nativeElement;
    if (element) element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
  }
}
