import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ChatConversation } from '../../models/chat.models';

@Component({
  selector: 'app-conversation-sidebar',
  standalone: true,
  templateUrl: './conversation-sidebar.component.html',
  styleUrl: './conversation-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationSidebarComponent {
  readonly conversations = input.required<ChatConversation[]>();
  readonly activeId = input<string | null>(null);
  readonly loading = input(false);

  readonly selected = output<string>();
  readonly deleted = output<string>();
  readonly newChat = output<void>();

  protected readonly skeletonRows = [1, 2, 3, 4];

  /** Short relative label: "Today", "Yesterday", or the date. */
  protected when(iso: string): string {
    const date = new Date(iso);
    const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
  }
}
