import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentTableComponent } from '../../components/appointment-table/appointment-table.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Appointment, AppointmentStatus, APPOINTMENT_STATUS_OPTIONS } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-list-page',
  standalone: true,
  imports: [FormsModule, RouterLink, AppointmentTableComponent, AlertComponent, ButtonComponent],
  templateUrl: './appointment-list-page.component.html',
  styleUrl: './appointment-list-page.component.scss',
})
export class AppointmentListPageComponent implements OnInit {
  protected readonly appointmentService = inject(AppointmentService);

  readonly rescheduling = signal<Appointment | null>(null);
  readonly rescheduleDate = signal('');
  readonly rescheduleSlot = signal('');
  readonly statusFilter = signal<'' | AppointmentStatus>('');

  readonly statusOptions = APPOINTMENT_STATUS_OPTIONS;

  ngOnInit(): void {
    this.appointmentService.clearError();
    this.appointmentService.clearSuccessMessage();
    this.appointmentService.loadMyAppointments();
  }

  onFilter(status: string): void {
    this.statusFilter.set(status as '' | AppointmentStatus);
    this.appointmentService.loadMyAppointments(status || undefined);
  }

  onCancel(appointment: Appointment): void {
    const reason = prompt('Cancellation reason (optional):') ?? '';
    if (confirm('Cancel this appointment?')) {
      this.appointmentService.cancelAppointment(appointment.id, { cancellationReason: reason || undefined }, true);
    }
  }

  startReschedule(appointment: Appointment): void {
    this.rescheduling.set(appointment);
    this.rescheduleDate.set(appointment.appointmentDate.slice(0, 10));
    this.rescheduleSlot.set('');
    this.appointmentService.loadAvailableSlots(appointment.doctorProfileId, appointment.appointmentDate);
  }

  onRescheduleDateChange(date: string): void {
    this.rescheduleDate.set(date);
    this.rescheduleSlot.set('');
    const appt = this.rescheduling();
    if (appt) this.appointmentService.loadAvailableSlots(appt.doctorProfileId, new Date(date).toISOString());
  }

  confirmReschedule(): void {
    const appt = this.rescheduling();
    if (!appt || !this.rescheduleDate() || !this.rescheduleSlot()) return;
    this.appointmentService.rescheduleAppointment(
      appt.id,
      {
        appointmentDate: new Date(this.rescheduleDate()).toISOString(),
        startTime: this.rescheduleSlot(),
      },
      true,
    );
    this.rescheduling.set(null);
  }

  cancelReschedule(): void {
    this.rescheduling.set(null);
    this.appointmentService.clearAvailableSlots();
  }
}
