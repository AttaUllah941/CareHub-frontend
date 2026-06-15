import { Component, input } from '@angular/core';

/**
 * Dumb (presentational) component for displaying API error alerts.
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  readonly message = input<string>('');
  readonly variant = input<'error' | 'success'>('error');
}
