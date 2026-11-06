import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { AiChatService } from '../../services/ai-chat.service';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

/**
 * Floating entry point for CareHub AI, available on every page for signed-in users
 * whose role has an assistant. Mounted lazily from the app shell (see app.html).
 */
@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [ChatWindowComponent],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class ChatWidgetComponent {
  private readonly auth = inject(AuthService);
  protected readonly chat = inject(AiChatService);

  /** Visible only for authenticated users whose role has an assistant. */
  protected readonly visible = computed(() => this.auth.isAuthenticated() && this.chat.available());

  constructor() {
    effect(() => {
      if (this.auth.user()) {
        this.chat.loadCapabilities();
      } else {
        // Signed out (or switched account): never leave the previous user's chat in memory.
        this.chat.reset();
      }
    });
  }

  protected onEscape(): void {
    if (this.chat.isOpen()) this.chat.close();
  }
}
