import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentTableComponent } from '../../components/appointment-table/appointment-table.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Appointment, AppointmentStatus, APPOINTMENT_STATUS_OPTIONS } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-doctor-appointment-list-page',
  standalone: true,
  imports: [FormsModule, AppointmentTableComponent, AlertComponent],
  templateUrl: './doctor-appointment-list-page.component.html',
  styleUrl: './doctor-appointment-list-page.component.scss',
})
export class DoctorAppointmentListPageComponent implements OnInit {
  protected readonly appointmentService = inject(AppointmentService);
  readonly statusOptions = APPOINTMENT_STATUS_OPTIONS;
  readonly statusFilter = signal<'' | AppointmentStatus>('');

  ngOnInit(): void {
    this.appointmentService.clearError();
    this.appointmentService.clearSuccessMessage();
    this.appointmentService.loadDoctorAppointments();
  }

  onFilter(status: string): void {
    this.statusFilter.set(status as '' | AppointmentStatus);
    this.appointmentService.loadDoctorAppointments(status || undefined);
  }

  onStatusUpdate(appointment: Appointment): void {
    const nextStatus: AppointmentStatus =
      appointment.status === 'PENDING' ? 'CONFIRMED' : appointment.status === 'CONFIRMED' ? 'COMPLETED' : appointment.status;
    this.appointmentService.updateStatus(appointment.id, { status: nextStatus }, true);
  }
}
