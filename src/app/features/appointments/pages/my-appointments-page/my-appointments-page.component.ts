import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Appointment, AppointmentStatus } from '../../../../core/models/appointment.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AppointmentsApiService } from '../../services/appointments-api.service';
import { formatAppointmentDateTime } from '../../utils/appointment-schedule.util';

import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-my-appointments-page',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, IconComponent],
  templateUrl: './my-appointments-page.component.html',
  styleUrl: './my-appointments-page.component.scss',
})
export class MyAppointmentsPageComponent implements OnInit {
  private readonly appointmentsApi = inject(AppointmentsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal<'all' | AppointmentStatus>('all');
  readonly actionId = signal<string | null>(null);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadAppointments();
    }
  }

  loadAppointments(): void {
    this.loading.set(true);
    this.error.set(null);

    const filter = this.filter();
    const status = filter === 'all' ? undefined : filter;

    this.appointmentsApi.listMine({ page: 1, limit: 50, status }).subscribe({
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
    this.filter.set(value as 'all' | AppointmentStatus);
    this.loadAppointments();
  }

  canJoinVideo(apt: Appointment): boolean {
    return apt.status === 'confirmed' && (apt.consultationType ?? 'video') === 'video';
  }

  joinConsultation(bookingRef: string | null): void {
    if (!bookingRef) return;
    this.router.navigate(['/consultation', bookingRef]);
  }

  cancelAppointment(id: string): void {
    this.actionId.set(id);

    this.appointmentsApi.cancel(id).subscribe({
      next: () => {
        this.notifications.showSuccess('Appointment cancelled.');
        this.actionId.set(null);
        this.loadAppointments();
      },
      error: (err) => {
        this.notifications.showError(this.apiErrorService.getMessage(err));
        this.actionId.set(null);
      },
    });
  }

  formatDate(iso: string): string {
    return formatAppointmentDateTime(iso);
  }

  canCancel(status: AppointmentStatus): boolean {
    return status === 'pending' || status === 'confirmed';
  }

  consultationLabel(type: Appointment['consultationType']): string {
    return type === 'clinic' ? 'Clinic visit' : 'Video consultation';
  }

  statusBadge(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-sky-100 text-sky-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-gray-100 text-gray-600',
      rejected: 'bg-red-100 text-red-800',
    };
    return map[status];
  }
}
