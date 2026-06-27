import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { Appointment } from '../../../core/models/appointment.model';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppointmentsApiService } from '../../appointments/services/appointments-api.service';
import {
  ApiClinic,
  ApiDoctorProfile,
  ApiSchedule,
} from '../models/doctor-api.model';
import {
  AvailabilitySlot,
  ConsultationStats,
  DoctorAppointment,
  DoctorPatientRecord,
  DoctorPortalProfile,
  DoctorPrescription,
  EarningsSummary,
} from '../models/doctor-portal.model';
import { DoctorPortalApiService } from './doctor-portal-api.service';
import { PrescriptionsApiService } from './prescriptions-api.service';
import {
  buildConsultationStats,
  buildEarningsSummary,
  buildPatientsFromAppointments,
  mapApiAppointment,
  mapToPortalProfile,
  time12hTo24h,
} from '../utils/doctor-portal.util';

@Injectable({ providedIn: 'root' })
export class DoctorPortalService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly portalApi = inject(DoctorPortalApiService);
  private readonly prescriptionsApi = inject(PrescriptionsApiService);
  private readonly appointmentsApi = inject(AppointmentsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly apiProfile = signal<ApiDoctorProfile | null>(null);
  private readonly primaryClinic = signal<ApiClinic | null>(null);
  private readonly apiSchedules = signal<ApiSchedule[]>([]);
  private readonly portalAppointments = signal<DoctorAppointment[]>([]);
  private readonly prescriptions = signal<DoctorPrescription[]>([]);

  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saving = signal(false);

  readonly currentProfile = computed<DoctorPortalProfile | null>(() => {
    const doctor = this.apiProfile();
    if (!doctor) return null;
    return mapToPortalProfile(doctor, this.primaryClinic(), this.apiSchedules());
  });

  readonly myAppointments = computed(() => this.portalAppointments());

  readonly pendingAppointments = computed(() =>
    this.portalAppointments().filter((appointment) => appointment.status === 'pending'),
  );

  readonly myPatients = computed<DoctorPatientRecord[]>(() =>
    buildPatientsFromAppointments(this.portalAppointments()),
  );

  readonly myPrescriptions = computed(() => this.prescriptions());

  readonly stats = computed<ConsultationStats>(() => {
    const doctor = this.apiProfile();
    return buildConsultationStats(
      this.portalAppointments(),
      doctor?.averageRating ?? 0,
      doctor?.reviewCount ?? 0,
    );
  });

  readonly earnings = computed<EarningsSummary>(() => {
    const doctor = this.apiProfile();
    return buildEarningsSummary(this.portalAppointments(), doctor?.currency ?? 'PKR');
  });

  loadPortalData(): void {
    if (!this.isBrowser) return;

    this.loading.set(true);
    this.loadError.set(null);

    forkJoin({
      profile: this.portalApi.getMyProfile(),
      clinics: this.portalApi.listMyClinics(),
      schedules: this.portalApi.listMySchedules(),
      appointments: this.appointmentsApi.listDoctor({ page: 1, limit: 100 }),
      prescriptions: this.prescriptionsApi.listMine({ page: 1, limit: 50 }),
    }).subscribe({
      next: ({ profile, clinics, schedules, appointments, prescriptions }) => {
        this.apiProfile.set(profile);
        this.primaryClinic.set(clinics[0] ?? null);
        this.apiSchedules.set(schedules);
        this.portalAppointments.set(
          appointments.data.appointments.map((appointment: Appointment) =>
            mapApiAppointment(appointment, profile.consultationFee ?? 0),
          ),
        );
        this.prescriptions.set(prescriptions.prescriptions);
        this.loading.set(false);
      },
      error: (err) => {
        this.loadError.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  updateProfile(updates: Partial<DoctorPortalProfile>): void {
    const doctor = this.apiProfile();
    if (!doctor) return;

    const payload: Record<string, unknown> = {};

    if (updates.specialization !== undefined) payload['title'] = updates.specialization;
    if (updates.bio !== undefined) payload['bio'] = updates.bio;
    if (updates.yearsOfExperience !== undefined) {
      payload['yearsOfExperience'] = updates.yearsOfExperience;
    }
    if (updates.consultationFee !== undefined) {
      payload['consultationFee'] = updates.consultationFee;
    }
    if (updates.qualifications !== undefined) {
      payload['qualifications'] = updates.qualifications.map((q) => ({
        degree: q.degree,
        institute: q.institution,
        year: q.year ?? undefined,
      }));
    }
    if (updates.clinic?.city !== undefined) payload['city'] = updates.clinic.city;

    this.saving.set(true);

    const profileUpdate$ =
      Object.keys(payload).length > 0
        ? this.portalApi.updateMyProfile(payload)
        : of(doctor);

    profileUpdate$
      .pipe(
        switchMap((updatedDoctor) => {
          this.apiProfile.set(updatedDoctor);
          if (!updates.clinic) return of(updatedDoctor);

          const clinic = this.primaryClinic();
          const clinicPayload = {
            name: updates.clinic.name,
            address: updates.clinic.address,
            city: updates.clinic.city,
            consultationFee: updates.consultationFee ?? updatedDoctor.consultationFee,
          };

          if (clinic) {
            return this.portalApi.updateClinic(clinic.id, clinicPayload).pipe(
              switchMap((updatedClinic) => {
                this.primaryClinic.set(updatedClinic);
                return of(updatedDoctor);
              }),
            );
          }

          return this.portalApi.createClinic(clinicPayload).pipe(
            switchMap((createdClinic) => {
              this.primaryClinic.set(createdClinic);
              return of(updatedDoctor);
            }),
          );
        }),
      )
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.notifications.showSuccess('Profile updated successfully.');
        },
        error: (err) => {
          this.saving.set(false);
          this.notifications.showError(this.apiErrorService.getMessage(err));
        },
      });
  }

  setAvailability(slots: AvailabilitySlot[]): void {
    const doctor = this.apiProfile();
    if (!doctor) return;

    this.saving.set(true);

    const existingForDays = this.apiSchedules().filter(
      (schedule) =>
        schedule.isActive &&
        schedule.dayOfWeek != null &&
        !slots.some((slot) => slot.day === schedule.dayOfWeek),
    );

    const deactivate$ =
      existingForDays.length > 0
        ? forkJoin(existingForDays.map((schedule) => this.portalApi.deactivateSchedule(schedule.id)))
        : of([]);

    deactivate$
      .pipe(
        switchMap(() => {
          const activeDays = new Set(
            this.apiSchedules()
              .filter((schedule) => schedule.isActive && schedule.dayOfWeek != null)
              .map((schedule) => schedule.dayOfWeek as number),
          );

          const creates = slots
            .filter((slot) => !activeDays.has(slot.day))
            .map((slot) =>
              this.portalApi.createSchedule({
                dayOfWeek: slot.day,
                startTime: time12hTo24h(slot.startTime),
                endTime: time12hTo24h(slot.endTime),
                consultationType: 'video',
              }),
            );

          return creates.length > 0 ? forkJoin(creates) : of([]);
        }),
        switchMap(() => this.portalApi.listMySchedules()),
      )
      .subscribe({
        next: (schedules) => {
          this.apiSchedules.set(schedules);
          this.saving.set(false);
          this.notifications.showSuccess('Schedule updated successfully.');
        },
        error: (err) => {
          this.saving.set(false);
          this.notifications.showError(this.apiErrorService.getMessage(err));
        },
      });
  }

  addAvailabilitySlot(slot: AvailabilitySlot): void {
    const existing = this.apiSchedules().filter(
      (schedule) => schedule.isActive && schedule.dayOfWeek === slot.day,
    );

    const create$ = (): Observable<ApiSchedule> =>
      this.portalApi.createSchedule({
        dayOfWeek: slot.day,
        startTime: time12hTo24h(slot.startTime),
        endTime: time12hTo24h(slot.endTime),
        consultationType: 'video',
      });

    this.saving.set(true);

    const request$ =
      existing.length > 0
        ? forkJoin(existing.map((schedule) => this.portalApi.deactivateSchedule(schedule.id))).pipe(
            switchMap(() => create$()),
          )
        : create$();

    request$.pipe(switchMap(() => this.portalApi.listMySchedules())).subscribe({
      next: (schedules) => {
        this.apiSchedules.set(schedules);
        this.saving.set(false);
        this.notifications.showSuccess('Availability slot saved.');
      },
      error: (err) => {
        this.saving.set(false);
        this.notifications.showError(this.apiErrorService.getMessage(err));
      },
    });
  }

  removeAvailabilitySlot(day: number): void {
    const schedules = this.apiSchedules().filter(
      (schedule) => schedule.isActive && schedule.dayOfWeek === day,
    );
    if (schedules.length === 0) return;

    this.saving.set(true);

    forkJoin(schedules.map((schedule) => this.portalApi.deactivateSchedule(schedule.id)))
      .pipe(switchMap(() => this.portalApi.listMySchedules()))
      .subscribe({
        next: (updated) => {
          this.apiSchedules.set(updated);
          this.saving.set(false);
        },
        error: (err) => {
          this.saving.set(false);
          this.notifications.showError(this.apiErrorService.getMessage(err));
        },
      });
  }

  createPrescription(
    patientId: string,
    diagnosis: string,
    medicines: DoctorPrescription['medicines'],
    notes?: string,
  ): Observable<DoctorPrescription> {
    const patient = this.myPatients().find((entry) => entry.id === patientId);

    return this.prescriptionsApi
      .create({
        patientName: patient?.name ?? 'Unknown',
        patientId: /^[a-f\d]{24}$/i.test(patientId) ? patientId : undefined,
        diagnosis,
        medicines,
        notes,
      })
      .pipe(
        tap((prescription) => {
          this.prescriptions.update((list) => [prescription, ...list]);
          this.notifications.showSuccess('Prescription issued successfully.');
        }),
      );
  }

  reloadPrescriptions(): void {
    this.prescriptionsApi.listMine({ page: 1, limit: 50 }).subscribe({
      next: (data) => this.prescriptions.set(data.prescriptions),
      error: (err) =>
        this.notifications.showError(this.apiErrorService.getMessage(err)),
    });
  }

  formatCurrency(amount: number): string {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  }
}
