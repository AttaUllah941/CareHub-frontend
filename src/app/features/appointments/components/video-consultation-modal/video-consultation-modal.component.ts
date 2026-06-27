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
import { DoctorDetailProfile } from '../../../../core/models/doctor-profile.model';
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
import { VideoConsultationPayload } from './video-consultation-payload.model';

interface DateOption extends BookingDateOption {}

const DEFAULT_TIME_SLOTS = ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

@Component({
  selector: 'app-video-consultation-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './video-consultation-modal.component.html',
  styleUrl: './video-consultation-modal.component.scss',
})
export class VideoConsultationModalComponent {
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

  readonly closed = output<void>();
  readonly confirmed = output<VideoConsultationPayload>();

  readonly dateScroll = viewChild<ElementRef<HTMLElement>>('dateScroll');

  readonly profile = signal<DoctorDetailProfile | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly bookingError = signal<string | null>(null);
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

  readonly timeSlots = computed(() => this.profile()?.timeSlots ?? DEFAULT_TIME_SLOTS);

  readonly videoOption = computed(() =>
    this.profile()?.consultationOptions.find((o) => o.type === 'video') ?? null,
  );

  readonly consultationFee = computed(() => {
    const video = this.videoOption();
    if (video) return video.fee;
    return this.doctor().consultationFee ?? 0;
  });

  readonly consultationHours = computed(() => this.videoOption()?.hours ?? 'Mon – Sat, 4:00 PM – 8:00 PM');

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
    () => this.scheduleComplete() && this.patientFormComplete() && !this.submitting(),
  );

  readonly completionPercent = computed(() => {
    let steps = 0;
    if (this.scheduleComplete()) steps++;
    if (this.patientNameValid()) steps++;
    if (this.patientAgeValid()) steps++;
    if (this.patientPhoneValid()) steps++;
    return Math.round((steps / 4) * 100);
  });

  readonly footerHint = computed(() => {
    if (this.canConfirm()) return 'All set — you can confirm your consultation now.';
    if (!this.scheduleComplete()) return 'Pick a date and time slot to continue.';
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
  }

  private buildPayload(ref: string): VideoConsultationPayload {
    const d = this.doctor();
    const fee = this.consultationFee();
    const dateIso = this.selectedDate()?.date.toISOString() ?? new Date().toISOString();

    return {
      bookingRef: ref,
      consultationType: 'video',
      doctor: {
        id: d.id,
        name: this.doctorName(d),
        specialty: this.specialtyLine(d),
        fee,
        feeFormatted: this.formatFee(fee),
        scheduleHours: this.consultationHours(),
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

  confirmConsultation(): void {
    this.showValidation.set(true);
    this.bookingError.set(null);
    if (!this.scheduleComplete() || !this.patientFormComplete() || this.submitting()) return;

    const selectedDate = this.selectedDate();
    if (!selectedDate) return;

    const request: CreateAppointmentRequest = {
      doctorId: this.doctor().id,
      scheduledAt: combineDateAndTimeSlot(selectedDate.date, this.selectedTimeSlot()),
      consultationType: 'video',
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
        this.notifications.showSuccess(`Video consultation booked. Reference: ${ref}`);
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
