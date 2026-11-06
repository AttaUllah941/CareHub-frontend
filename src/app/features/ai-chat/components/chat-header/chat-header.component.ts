import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatHeaderComponent {
  readonly title = input('CareHub AI');
  readonly subtitle = input('');
  readonly historyOpen = input(false);

  readonly toggleHistory = output<void>();
  readonly newChat = output<void>();
  readonly closed = output<void>();
}
