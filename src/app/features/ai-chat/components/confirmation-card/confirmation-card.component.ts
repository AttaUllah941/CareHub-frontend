import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AiChatService } from '../../services/ai-chat.service';
import { ChatActionState, ChatConfirmationData } from '../../models/chat.models';

/**
 * Review-and-confirm card for consequential actions. Nothing happens until the user presses
 * Confirm; the server executes the stored, validated action through the normal services.
 */
@Component({
  selector: 'app-confirmation-card',
  standalone: true,
  templateUrl: './confirmation-card.component.html',
  styleUrl: './confirmation-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationCardComponent {
  private readonly chat = inject(AiChatService);

  readonly data = input.required<ChatConfirmationData>();
  /** Only the latest assistant message can still be acted on. */
  readonly interactive = input(true);

  protected readonly state = computed<ChatActionState | undefined>(
    () => this.chat.actionStates()[this.data().actionId],
  );
  protected readonly status = computed(() => this.state()?.status);
  protected readonly working = computed(
    () => this.status() === 'confirming' || this.status() === 'cancelling',
  );
  protected readonly expired = computed(() => new Date(this.data().expiresAt).getTime() <= Date.now());
  /** Buttons are shown only while the action can still be taken. */
  protected readonly actionable = computed(
    () =>
      this.interactive() &&
      !this.expired() &&
      this.status() !== 'done' &&
      this.status() !== 'cancelled',
  );

  protected confirm(): void {
    this.chat.confirmAction(this.data().actionId);
  }

  protected cancel(): void {
    this.chat.cancelAction(this.data().actionId);
  }
}
