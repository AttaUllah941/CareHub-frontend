import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatAppointment } from '../../models/chat.models';

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-warning',
  confirmed: 'badge-success',
  completed: 'badge-info',
  cancelled: 'badge-neutral',
  rejected: 'badge-danger',
};

@Component({
  selector: 'app-appointment-result-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './appointment-result-card.component.html',
  styleUrl: './appointment-result-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentResultCardComponent {
  readonly appointment = input.required<ChatAppointment>();
  readonly interactive = input(true);

  readonly ask = output<string>();
  readonly navigated = output<void>();

  protected readonly badgeClass = computed(
    () => STATUS_BADGE[this.appointment().status] ?? 'badge-neutral',
  );

  protected cancel(): void {
    const { bookingRef, id } = this.appointment();
    this.ask.emit(`Cancel my appointment ${bookingRef ?? ''} (appointment id ${id}).`.replace('  ', ' '));
  }
}
