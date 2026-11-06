import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Three bouncing dots shown while the assistant is composing a reply. */
@Component({
  selector: 'app-typing-indicator',
  standalone: true,
  templateUrl: './typing-indicator.component.html',
  styleUrl: './typing-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypingIndicatorComponent {}
