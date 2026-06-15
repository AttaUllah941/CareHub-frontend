import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Appointment,
  appointmentStatusClass,
  appointmentStatusLabel,
  formatAppointmentDateTime,
} from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './appointment-table.component.html',
  styleUrl: './appointment-table.component.scss',
})
export class AppointmentTableComponent {
  readonly appointments = input<Appointment[]>([]);
  readonly loading = input(false);
  readonly showPatient = input(false);
  readonly showActions = input(true);
  readonly adminMode = input(false);
  readonly doctorMode = input(false);
  readonly videoBasePath = input('/patient/video');

  readonly cancelAppointment = output<Appointment>();
  readonly rescheduleAppointment = output<Appointment>();
  readonly updateStatus = output<Appointment>();

  readonly statusLabel = appointmentStatusLabel;
  readonly statusClass = appointmentStatusClass;
  readonly formatDateTime = formatAppointmentDateTime;

  canCancel(a: Appointment): boolean {
    return ['PENDING', 'CONFIRMED'].includes(a.status);
  }

  canReschedule(a: Appointment): boolean {
    return ['PENDING', 'CONFIRMED'].includes(a.status);
  }

  canJoinVideo(a: Appointment): boolean {
    return a.status === 'CONFIRMED';
  }
}
