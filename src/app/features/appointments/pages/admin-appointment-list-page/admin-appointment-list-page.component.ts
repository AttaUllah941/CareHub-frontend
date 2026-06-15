import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentTableComponent } from '../../components/appointment-table/appointment-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import {
  Appointment,
  AppointmentListQuery,
  AppointmentStatus,
  APPOINTMENT_STATUS_OPTIONS,
} from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-admin-appointment-list-page',
  standalone: true,
  imports: [FormsModule, AppointmentTableComponent, PaginationComponent, AlertComponent],
  templateUrl: './admin-appointment-list-page.component.html',
  styleUrl: './admin-appointment-list-page.component.scss',
})
export class AdminAppointmentListPageComponent implements OnInit {
  protected readonly appointmentService = inject(AppointmentService);
  readonly statusOptions = APPOINTMENT_STATUS_OPTIONS;

  ngOnInit(): void {
    this.appointmentService.clearError();
    this.appointmentService.clearSuccessMessage();
    this.appointmentService.loadAppointments({});
  }

  onFilter(query: Partial<AppointmentListQuery>): void {
    this.appointmentService.loadAppointments(query);
  }

  onCancel(appointment: Appointment): void {
    if (confirm('Cancel this appointment?')) {
      this.appointmentService.cancelAppointment(appointment.id, { cancellationReason: 'Cancelled by admin' });
    }
  }

  onStatusUpdate(appointment: Appointment): void {
    const nextStatus: AppointmentStatus =
      appointment.status === 'PENDING' ? 'CONFIRMED' : appointment.status === 'CONFIRMED' ? 'COMPLETED' : appointment.status;
    this.appointmentService.updateStatus(appointment.id, { status: nextStatus });
  }
}
