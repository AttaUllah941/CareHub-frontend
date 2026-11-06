import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToolResultComponent } from '../tool-result/tool-result.component';
import { ChatMessage } from '../../models/chat.models';
import { renderMarkdown } from '../../utils/markdown.util';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [DatePipe, ToolResultComponent],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  // The markdown HTML is injected at runtime, so its styles can't be view-encapsulated.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
  readonly message = input.required<ChatMessage>();
  /** Only the newest message keeps interactive buttons (confirm, book, cancel…). */
  readonly isLatest = input(false);

  readonly ask = output<string>();
  readonly retry = output<void>();
  readonly navigated = output<void>();

  protected readonly isUser = computed(() => this.message().role === 'user');
  protected readonly html = computed(() =>
    this.isUser() ? '' : renderMarkdown(this.message().content),
  );
}
