import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorSearchResult } from '../../../../core/models/doctor.model';
import { DoctorConsultationOption, DoctorDetailProfile } from '../../../../core/models/doctor-profile.model';
import { buildBookingProfileFromListing } from '../../../doctors/utils/doctor-booking-profile.util';
import { PublicDoctorApiService } from '../../../doctors/services/public-doctor-api.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreateAppointmentRequest } from '../../../../core/models/appointment.model';
import { AppointmentsApiService } from '../../services/appointments-api.service';
import { buildBookingDateOptions, BookingDateOption } from '../../utils/booking-date.util';
import { combineDateAndTimeSlot } from '../../utils/appointment-schedule.util';
import { setBodyScrollLocked } from '../../utils/browser.util';
import { patientDefaultsFromUser } from '../../utils/patient-form.util';
import { ClinicAppointmentPayload } from './clinic-appointment-payload.model';

interface DateOption extends BookingDateOption {}

interface ClinicLocationOption {
  id: string;
  name: string;
  location: string;
  hours: string;
  fee: number;
  status: string;
}

const DEFAULT_TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
];

@Component({
  selector: 'app-clinic-appointment-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clinic-appointment-modal.component.html',
  styleUrl: './clinic-appointment-modal.component.scss',
})
export class ClinicAppointmentModalComponent {
  private readonly publicDoctorApi = inject(PublicDoctorApiService);
  private readonly appointmentsApi = inject(AppointmentsApiService);
  private readonly auth = inject(AuthService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly open = input(false);
  readonly doctor = input.required<DoctorSearchResult>();
  readonly city = input('Lahore');
  readonly initialClinicId = input<string | undefined>(undefined);

  readonly closed = output<void>();
  readonly confirmed = output<ClinicAppointmentPayload>();

  readonly dateScroll = viewChild<ElementRef<HTMLElement>>('dateScroll');

  readonly profile = signal<DoctorDetailProfile | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly bookingError = signal<string | null>(null);
  readonly selectedClinicId = signal('');
  readonly selectedDateIndex = signal(0);
  readonly selectedTimeSlot = signal('');
  readonly showValidation = signal(false);

  readonly patientName = signal('');
  readonly patientAge = signal<number | null>(null);
  readonly patientPhone = signal('');
  readonly patientGender = signal('');
  readonly patientEmail = signal('');
  readonly patientNotes = signal('');

  readonly dateOptions = signal<DateOption[]>(buildBookingDateOptions());

  readonly clinicOptions = computed(() => this.buildClinicOptions());

  readonly selectedClinic = computed(() =>
    this.clinicOptions().find((c) => c.id === this.selectedClinicId()) ?? null,
  );

  readonly timeSlots = computed(() => this.profile()?.timeSlots ?? DEFAULT_TIME_SLOTS);

  readonly selectedDate = computed(() => this.dateOptions()[this.selectedDateIndex()] ?? null);

  readonly formattedSelectedDate = computed(() => {
    const opt = this.selectedDate();
    if (!opt) return '';
    return opt.date.toLocaleDateString('en-PK', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  readonly clinicSelected = computed(() => Boolean(this.selectedClinicId()));

  readonly scheduleComplete = computed(() => Boolean(this.selectedTimeSlot()));

  readonly patientNameValid = computed(() => this.patientName().trim().length >= 2);

  readonly patientAgeValid = computed(() => {
    const age = this.patientAge();
    return age != null && age > 0 && age <= 120;
  });

  readonly patientPhoneValid = computed(() => /^[0-9]{10,11}$/.test(this.patientPhone().replace(/\D/g, '')));

  readonly isGuestBooking = computed(() => !this.auth.isAuthenticated());

  readonly patientEmailValid = computed(() => {
    if (!this.isGuestBooking()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.patientEmail().trim());
  });

  readonly patientFormComplete = computed(
    () =>
      this.patientNameValid() &&
      this.patientAgeValid() &&
      this.patientPhoneValid() &&
      this.patientEmailValid(),
  );

  readonly canConfirm = computed(
    () => this.clinicSelected() && this.scheduleComplete() && this.patientFormComplete() && !this.submitting(),
  );

  readonly completionPercent = computed(() => {
    let steps = 0;
    if (this.clinicSelected()) steps++;
    if (this.scheduleComplete()) steps++;
    if (this.patientNameValid()) steps++;
    if (this.patientAgeValid()) steps++;
    if (this.patientPhoneValid()) steps++;
    return Math.round((steps / 5) * 100);
  });

  readonly footerHint = computed(() => {
    if (this.canConfirm()) return 'All set — you can confirm your in-clinic appointment.';
    if (!this.clinicSelected()) return 'Select a clinic or hospital to continue.';
    if (!this.scheduleComplete()) return 'Pick an appointment date and time slot.';
    if (!this.patientNameValid()) return 'Enter the patient\'s full name (at least 2 characters).';
    if (!this.patientAgeValid()) return 'Enter a valid age between 1 and 120.';
    if (!this.patientPhoneValid()) return 'Enter a valid phone number (10–11 digits).';
    if (!this.patientEmailValid()) return 'Enter a valid email address for booking confirmation.';
    return 'Complete the form to enable confirmation.';
  });

  constructor() {
    effect(() => {
      const isOpen = this.open();

      if (isOpen) {
        this.resetForm();
        this.loadDoctorProfile();
      }

      setBodyScrollLocked(this.isBrowser, isOpen);
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }

  private resetForm(): void {
    this.showValidation.set(false);
    this.bookingError.set(null);
    this.submitting.set(false);
    this.selectedClinicId.set('');
    this.selectedDateIndex.set(0);
    this.selectedTimeSlot.set('');
    this.dateOptions.set(buildBookingDateOptions());

    const defaults = patientDefaultsFromUser(this.auth.user());
    this.patientName.set(defaults.name);
    this.patientPhone.set(defaults.phone);
    this.patientEmail.set(defaults.email);
    this.patientAge.set(null);
    this.patientGender.set('');
    this.patientNotes.set('');
  }

  private loadDoctorProfile(): void {
    const d = this.doctor();
    this.loading.set(true);
    this.profile.set(null);

    this.publicDoctorApi.getDoctorById(d.id).subscribe({
      next: (res) => {
        const profile = res.data?.doctor;
        if (profile) {
          this.applyProfile(profile);
        } else {
          this.applyProfile(buildBookingProfileFromListing(d, this.city()));
        }
        this.loading.set(false);
      },
      error: () => {
        this.applyProfile(buildBookingProfileFromListing(d, this.city()));
        this.loading.set(false);
      },
    });
  }

  private applyProfile(profile: DoctorDetailProfile): void {
    this.profile.set(profile);
    const slots = profile.timeSlots.length ? profile.timeSlots : DEFAULT_TIME_SLOTS;
    this.selectedTimeSlot.set(slots[0]);
    this.initClinicSelection();
  }

  private initClinicSelection(): void {
    const options = this.buildClinicOptions();
    const presetId = this.initialClinicId();
    const match = presetId ? options.find((o) => o.id === presetId) : null;
    this.selectedClinicId.set(match?.id ?? options[0]?.id ?? '');
  }

  private buildClinicOptions(): ClinicLocationOption[] {
    const d = this.doctor();
    const profile = this.profile();
    const fee = d.consultationFee ?? 0;

    const fromProfile = (profile?.consultationOptions ?? []).filter((o) => o.type === 'clinic');
    if (fromProfile.length) {
      return fromProfile.map((o) => this.toClinicOption(o));
    }

    const clinics = d.clinics ?? [];
    if (clinics.length) {
      return clinics.map((c) => ({
        id: c.id,
        name: c.name,
        location: c.city || this.city(),
        hours: 'Mon – Sat, 10:00 AM – 7:00 PM',
        fee,
        status: 'Available Today',
      }));
    }

    return [
      {
        id: `${d.id}-clinic-fallback`,
        name: `${this.city()} Clinic`,
        location: this.city(),
        hours: 'Mon – Sat, 10:00 AM – 7:00 PM',
        fee,
        status: 'Available Today',
      },
    ];
  }

  private toClinicOption(option: DoctorConsultationOption): ClinicLocationOption {
    return {
      id: option.id,
      name: option.name,
      location: option.location ?? this.city(),
      hours: option.hours,
      fee: option.fee,
      status: option.status,
    };
  }

  private buildPayload(ref: string): ClinicAppointmentPayload {
    const d = this.doctor();
    const clinic = this.selectedClinic()!;
    const dateIso = this.selectedDate()?.date.toISOString() ?? new Date().toISOString();

    return {
      bookingRef: ref,
      consultationType: 'clinic',
      doctor: {
        id: d.id,
        name: this.doctorName(d),
        specialty: this.specialtyLine(d),
      },
      clinic: {
        id: clinic.id,
        name: clinic.name,
        location: clinic.location,
        hours: clinic.hours,
        fee: clinic.fee,
        feeFormatted: this.formatFee(clinic.fee),
        status: clinic.status,
      },
      appointment: {
        date: dateIso,
        dateFormatted: this.formattedSelectedDate(),
        timeSlot: this.selectedTimeSlot(),
        city: this.city(),
      },
      patient: {
        name: this.patientName().trim(),
        age: this.patientAge()!,
        gender: this.patientGender(),
        phone: this.patientPhone().trim(),
        email: this.patientEmail().trim(),
        notes: this.patientNotes().trim(),
      },
      meta: {
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      },
    };
  }

  doctorName(d: DoctorSearchResult): string {
    const title = d.title ? `${d.title} ` : 'Dr. ';
    return `${title}${d.user?.firstName ?? ''} ${d.user?.lastName ?? ''}`.trim();
  }

  specialtyLine(d: DoctorSearchResult): string {
    const names = (d.specialties ?? []).map((s) => s.name);
    return names.length ? names.join(', ') : 'General Physician';
  }

  formatFee(fee: number): string {
    return `Rs. ${fee.toLocaleString('en-PK')}`;
  }

  monthLabel(): string {
    const date = this.dateOptions()[this.selectedDateIndex()]?.date ?? new Date();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  selectClinic(id: string): void {
    this.selectedClinicId.set(id);
  }

  selectDate(index: number): void {
    this.selectedDateIndex.set(index);
  }

  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot.set(slot);
  }

  scrollDates(direction: 'left' | 'right'): void {
    const el = this.dateScroll()?.nativeElement;
    if (el) {
      el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  }

  close(): void {
    this.closed.emit();
  }

  confirmAppointment(): void {
    this.showValidation.set(true);
    this.bookingError.set(null);

    if (!this.auth.isAuthenticated()) {
      this.notifications.showError('Please login first.');
      return;
    }

    if (!this.clinicSelected() || !this.scheduleComplete() || !this.patientFormComplete() || this.submitting()) {
      return;
    }

    const selectedDate = this.selectedDate();
    if (!selectedDate) return;

    const request: CreateAppointmentRequest = {
      doctorId: this.doctor().id,
      scheduledAt: combineDateAndTimeSlot(selectedDate.date, this.selectedTimeSlot()),
      consultationType: 'clinic',
    };

    if (this.isGuestBooking()) {
      request.patientName = this.patientName().trim();
      request.patientEmail = this.patientEmail().trim();
      request.patientPhone = this.patientPhone().trim();
    } else if (this.patientPhone().trim()) {
      request.patientPhone = this.patientPhone().trim();
    }

    this.submitting.set(true);

    this.appointmentsApi.create(request).subscribe({
      next: (res) => {
        const appointment = res.data.appointment;
        const ref = appointment.bookingRef ?? appointment.id;
        this.notifications.showSuccess(`Clinic appointment booked successfully. Reference: ${ref}`);
        this.confirmed.emit(this.buildPayload(ref));
        this.submitting.set(false);
        this.close();
      },
      error: (err) => {
        const message = this.apiErrorService.getMessage(err);
        this.bookingError.set(message);
        this.notifications.showError(message);
        this.submitting.set(false);
      },
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['backdrop'] === 'true') {
      this.close();
    }
  }
}
