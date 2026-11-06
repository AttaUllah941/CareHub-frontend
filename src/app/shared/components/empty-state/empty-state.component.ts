import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Consistent "nothing here" / error panel with a projected action slot. */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly tone = input<'neutral' | 'error'>('neutral');
}
