import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

const MAX_LENGTH = 2000;

/** Message composer: Enter sends, Shift+Enter inserts a new line. */
@Component({
  selector: 'app-chat-input',
  standalone: true,
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatInputComponent {
  readonly disabled = input(false);
  readonly busy = input(false);
  readonly placeholder = input('Ask CareHub AI…');
  readonly submitted = output<string>();

  protected readonly maxLength = MAX_LENGTH;
  protected readonly text = signal('');
  protected readonly canSend = computed(() => !this.disabled() && !this.busy() && this.text().trim().length > 0);
  protected readonly nearLimit = computed(() => this.text().length > MAX_LENGTH - 200);

  protected onInput(event: Event): void {
    this.text.set((event.target as HTMLTextAreaElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.submit();
    }
  }

  protected submit(): void {
    if (!this.canSend()) return;
    this.submitted.emit(this.text().trim());
    this.text.set('');
  }
}
