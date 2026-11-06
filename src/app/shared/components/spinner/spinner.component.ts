import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Inline loading indicator. Inherits the current text colour so it works on any button/background.
 * Fixed size per variant → no layout shift when toggled.
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', '[attr.aria-label]': 'label()' },
  template: `
    <span [class]="size() === 'sm' ? 'spinner-sm' : 'spinner'" aria-hidden="true"></span>
    <span class="sr-only">{{ label() }}</span>
  `,
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md'>('md');
  readonly label = input('Loading');
}
