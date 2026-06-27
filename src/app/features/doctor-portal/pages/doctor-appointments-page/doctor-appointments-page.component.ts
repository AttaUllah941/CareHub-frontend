import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Appointment, AppointmentStatus } from '../../../../core/models/appointment.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AppointmentsApiService } from '../../../appointments/services/appointments-api.service';
import { formatAppointmentDateTime } from '../../../appointments/utils/appointment-schedule.util';

type DoctorAppointmentFilter = 'all' | AppointmentStatus | 'accepted';

@Component({
  selector: 'app-doctor-appointments-page',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './doctor-appointments-page.component.html',
  styleUrl: './doctor-appointments-page.component.scss',
})
export class DoctorAppointmentsPageComponent implements OnInit {
  private readonly appointmentsApi = inject(AppointmentsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);

  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal<DoctorAppointmentFilter>('all');
  readonly actionId = signal<string | null>(null);

  readonly filters: DoctorAppointmentFilter[] = [
    'all',
    'pending',
    'accepted',
    'completed',
    'rejected',
    'cancelled',
  ];

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading.set(true);
    this.error.set(null);

    const filter = this.filter();
    const status = filter === 'all' ? undefined : filter === 'accepted' ? 'confirmed' : filter;

    this.appointmentsApi.listDoctor({ page: 1, limit: 50, status }).subscribe({
      next: (res) => {
        this.appointments.set(res.data.appointments);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  setFilter(value: string): void {
    this.filter.set(value as DoctorAppointmentFilter);
    this.loadAppointments();
  }

  accept(id: string): void {
    this.runAction(id, () => this.appointmentsApi.confirm(id), 'Appointment confirmed.');
  }

  reject(id: string): void {
    this.runAction(id, () => this.appointmentsApi.reject(id), 'Appointment rejected.');
  }

  complete(id: string): void {
    this.runAction(id, () => this.appointmentsApi.complete(id), 'Appointment marked complete.');
  }

  formatDate(iso: string): string {
    return formatAppointmentDateTime(iso);
  }

  displayStatus(status: AppointmentStatus): string {
    return status === 'confirmed' ? 'accepted' : status;
  }

  statusBadge(status: AppointmentStatus): string {
    const key = status === 'confirmed' ? 'accepted' : status;
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      accepted: 'bg-sky-100 text-sky-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-gray-100 text-gray-600',
    };
    return map[key] ?? 'bg-gray-100 text-gray-600';
  }

  private runAction(
    id: string,
    request: () => ReturnType<AppointmentsApiService['confirm']>,
    successMessage: string,
  ): void {
    this.actionId.set(id);

    request().subscribe({
      next: () => {
        this.notifications.showSuccess(successMessage);
        this.actionId.set(null);
        this.loadAppointments();
      },
      error: (err) => {
        this.notifications.showError(this.apiErrorService.getMessage(err));
        this.actionId.set(null);
      },
    });
  }
}
