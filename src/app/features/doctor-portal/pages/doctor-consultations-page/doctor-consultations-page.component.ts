import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment, AppointmentStatus } from '../../../../core/models/appointment.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { AppointmentsApiService } from '../../../appointments/services/appointments-api.service';
import { formatAppointmentDateTime } from '../../../appointments/utils/appointment-schedule.util';

@Component({
  selector: 'app-doctor-consultations-page',
  standalone: true,
  templateUrl: './doctor-consultations-page.component.html',
  styleUrl: './doctor-consultations-page.component.scss',
})
export class DoctorConsultationsPageComponent implements OnInit {
  private readonly appointmentsApi = inject(AppointmentsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly router = inject(Router);

  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly videoAppointments = computed(() =>
    this.appointments().filter(
      (a) => (a.consultationType ?? 'video') === 'video' && this.isJoinable(a.status),
    ),
  );

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading.set(true);
    this.error.set(null);

    this.appointmentsApi.listDoctor({ page: 1, limit: 50 }).subscribe({
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

  formatDate(iso: string): string {
    return formatAppointmentDateTime(iso);
  }

  displayStatus(status: AppointmentStatus): string {
    return status === 'confirmed' ? 'accepted' : status;
  }

  canStart(status: AppointmentStatus): boolean {
    return status === 'confirmed';
  }

  startConsultation(bookingRef: string | null): void {
    if (!bookingRef) return;
    this.router.navigate(['/consultation', bookingRef]);
  }

  private isJoinable(status: AppointmentStatus): boolean {
    return status === 'pending' || status === 'confirmed';
  }
}
