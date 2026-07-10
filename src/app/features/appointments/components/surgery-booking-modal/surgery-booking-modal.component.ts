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
import { SurgeryHospitalView, SurgeryProcedure } from '../../../../core/models/surgery.model';
import { DoctorSearchResult } from '../../../../core/models/doctor.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { formatSurgeryPriceRange } from '../../../marketplace/utils/marketplace-display.util';
import { SurgeriesApiService } from '../../../surgeries/services/surgeries-api.service';
import { AuthService } from '../../../auth/services/auth.service';
import { buildBookingDateOptions, BookingDateOption } from '../../utils/booking-date.util';
import { setBodyScrollLocked } from '../../utils/browser.util';
import { patientDefaultsFromUser } from '../../utils/patient-form.util';
import { SurgeryBookingPayload } from './surgery-booking-payload.model';

interface DateOption extends BookingDateOption {}

interface SurgeonOption {
  id: string;
  name: string;
  specialty: string;
  yearsOfExperience?: number;
  profileImageUrl?: string;
  isAssigned?: boolean;
}

const CONSULTATION_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

@Component({
  selector: 'app-surgery-booking-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './surgery-booking-modal.component.html',
  styleUrl: './surgery-booking-modal.component.scss',
})
export class SurgeryBookingModalComponent {
  private readonly auth = inject(AuthService);
  private readonly surgeriesApi = inject(SurgeriesApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly submitting = signal(false);

  readonly open = input(false);
  readonly surgery = input.required<SurgeryProcedure>();
  readonly hospital = input.required<SurgeryHospitalView>();

  readonly closed = output<void>();
  readonly confirmed = output<SurgeryBookingPayload>();

  readonly dateScroll = viewChild<ElementRef<HTMLElement>>('dateScroll');

  readonly selectedSurgeonId = signal('');
  readonly selectedDateIndex = signal(0);
  readonly selectedTimeSlot = signal('');
  readonly requirementsAcknowledged = signal(false);
  readonly showValidation = signal(false);

  readonly patientName = signal('');
  readonly patientAge = signal<number | null>(null);
  readonly patientPhone = signal('');
  readonly patientGender = signal('');
  readonly patientEmail = signal('');
  readonly patientMedicalHistory = signal('');
  readonly patientNotes = signal('');

  readonly dateOptions = signal<DateOption[]>(buildBookingDateOptions());
  readonly consultationSlots = CONSULTATION_SLOTS;

  readonly surgeonOptions = computed(() => this.buildSurgeonOptions());

  readonly selectedSurgeon = computed(
    () => this.surgeonOptions().find((s) => s.id === this.selectedSurgeonId()) ?? null,
  );

  readonly preSurgeryRequirements = computed(() => this.buildPreSurgeryRequirements());

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

  readonly surgeonSelected = computed(() => Boolean(this.selectedSurgeonId()));

  readonly scheduleComplete = computed(() => Boolean(this.selectedTimeSlot()));

  readonly patientNameValid = computed(() => this.patientName().trim().length >= 2);

  readonly patientAgeValid = computed(() => {
    const age = this.patientAge();
    return age != null && age > 0 && age <= 120;
  });

  readonly patientPhoneValid = computed(() => /^[0-9]{10,11}$/.test(this.patientPhone().replace(/\D/g, '')));

  readonly patientFormComplete = computed(
    () => this.patientNameValid() && this.patientAgeValid() && this.patientPhoneValid(),
  );

  readonly canConfirm = computed(
    () =>
      this.surgeonSelected() &&
      this.scheduleComplete() &&
      this.requirementsAcknowledged() &&
      this.patientFormComplete(),
  );

  readonly completionPercent = computed(() => {
    let steps = 0;
    if (this.surgeonSelected()) steps++;
    if (this.scheduleComplete()) steps++;
    if (this.requirementsAcknowledged()) steps++;
    if (this.patientNameValid()) steps++;
    if (this.patientAgeValid()) steps++;
    if (this.patientPhoneValid()) steps++;
    return Math.round((steps / 6) * 100);
  });

  readonly footerHint = computed(() => {
    if (this.canConfirm()) return 'All set — you can submit your surgery booking request.';
    if (!this.surgeonSelected()) return 'Select a surgeon or surgical team to continue.';
    if (!this.scheduleComplete()) return 'Pick a consultation date and time slot.';
    if (!this.requirementsAcknowledged()) return 'Please review and acknowledge the pre-surgery requirements.';
    if (!this.patientNameValid()) return 'Enter the patient\'s full name (at least 2 characters).';
    if (!this.patientAgeValid()) return 'Enter a valid age between 1 and 120.';
    if (!this.patientPhoneValid()) return 'Enter a valid phone number (10–11 digits).';
    return 'Complete the form to enable submission.';
  });

  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (isOpen) {
        this.resetForm();
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
    this.requirementsAcknowledged.set(false);
    this.selectedDateIndex.set(0);
    this.selectedTimeSlot.set(CONSULTATION_SLOTS[0]);
    this.dateOptions.set(buildBookingDateOptions());

    const surgeons = this.buildSurgeonOptions();
    this.selectedSurgeonId.set(surgeons[0]?.id ?? '');

    const defaults = patientDefaultsFromUser(this.auth.user());
    this.patientName.set(defaults.name);
    this.patientPhone.set(defaults.phone);
    this.patientEmail.set(defaults.email);
    this.patientAge.set(null);
    this.patientGender.set('');
    this.patientMedicalHistory.set('');
    this.patientNotes.set('');
  }

  private buildSurgeonOptions(): SurgeonOption[] {
    const specialists = this.hospital().specialists ?? [];
    const surgeryCategory = this.surgery().category;

    if (specialists.length) {
      return specialists.map((d) => this.toSurgeonOption(d));
    }

    return [
      {
        id: 'assigned-surgeon',
        name: 'Hospital Surgical Team',
        specialty: surgeryCategory ?? 'General',
        isAssigned: true,
      },
    ];
  }

  private toSurgeonOption(d: DoctorSearchResult): SurgeonOption {
    const title = d.title ? `${d.title} ` : 'Dr. ';
    const name = `${title}${d.user?.firstName ?? ''} ${d.user?.lastName ?? ''}`.trim();
    const specialty = (d.specialties ?? []).map((s) => s.name).join(', ') || this.surgery().category || 'General';

    return {
      id: d.id,
      name,
      specialty,
      yearsOfExperience: d.yearsOfExperience,
      profileImageUrl: d.profileImageUrl,
    };
  }

  private buildPreSurgeryRequirements(): string[] {
    const s = this.surgery();
    const anesthesia = (s.anesthesiaType ?? 'General').toLowerCase();
    const base = [
      'Bring all previous medical records, imaging reports, and current prescriptions to the consultation.',
      'Inform the surgeon about any allergies, chronic conditions, or ongoing medications.',
      'Arrange a companion for hospital admission and discharge if an overnight stay is required.',
    ];

    if (anesthesia.includes('general')) {
      base.unshift('Fast for 8–12 hours before surgery as advised by the anesthesiologist.');
      base.push('Complete pre-operative blood tests, ECG, and chest X-ray if requested.');
    } else if (anesthesia.includes('local')) {
      base.unshift('Eat a light meal unless otherwise instructed; fasting may not be required.');
    } else {
      base.unshift('Follow fasting instructions provided during your pre-surgery assessment.');
    }

    if (s.hospitalStay && s.hospitalStay !== 'Day case') {
      base.push(`Plan for an estimated hospital stay of ${s.hospitalStay}.`);
    }

    base.push('Sign informed consent forms after the surgeon explains risks, benefits, and alternatives.');

    return base;
  }

  private buildPayload(ref: string): SurgeryBookingPayload {
    const surgery = this.surgery();
    const hospital = this.hospital();
    const surgeon = this.selectedSurgeon()!;
    const dateIso = this.selectedDate()?.date.toISOString() ?? new Date().toISOString();

    return {
      bookingRef: ref,
      requestType: 'surgery_consultation',
      surgery: {
        id: surgery.id,
        slug: surgery.slug,
        name: surgery.name,
        description: surgery.description ?? '',
        category: surgery.category ?? 'General',
        estimatedCostFrom: surgery.priceFrom,
        estimatedCostTo: surgery.priceTo,
        estimatedCostFormatted: formatSurgeryPriceRange(surgery.priceFrom, surgery.priceTo),
        duration: surgery.duration ?? '—',
        anesthesiaType: surgery.anesthesiaType ?? 'General',
        hospitalStay: surgery.hospitalStay,
      },
      hospital: {
        id: hospital.id,
        slug: hospital.slug,
        name: hospital.name,
        address: hospital.address,
        city: hospital.city,
        phone: hospital.phone,
        email: hospital.email,
        facilities: hospital.facilities,
        rating: hospital.rating,
      },
      surgeon: {
        id: surgeon.id,
        name: surgeon.name,
        specialty: surgeon.specialty,
        yearsOfExperience: surgeon.yearsOfExperience,
      },
      consultation: {
        date: dateIso,
        dateFormatted: this.formattedSelectedDate(),
        timeSlot: this.selectedTimeSlot(),
      },
      preSurgeryRequirements: this.preSurgeryRequirements(),
      requirementsAcknowledged: this.requirementsAcknowledged(),
      patient: {
        name: this.patientName().trim(),
        age: this.patientAge()!,
        gender: this.patientGender(),
        phone: this.patientPhone().trim(),
        email: this.patientEmail().trim(),
        medicalHistory: this.patientMedicalHistory().trim(),
        notes: this.patientNotes().trim(),
      },
      meta: {
        createdAt: new Date().toISOString(),
        status: 'submitted',
      },
    };
  }

  formatPrice(priceFrom: number, priceTo?: number): string {
    return formatSurgeryPriceRange(priceFrom, priceTo);
  }

  monthLabel(): string {
    const date = this.dateOptions()[this.selectedDateIndex()]?.date ?? new Date();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  selectSurgeon(id: string): void {
    this.selectedSurgeonId.set(id);
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

  submitBooking(): void {
    this.showValidation.set(true);
    if (!this.canConfirm() || this.submitting()) return;

    if (!this.auth.isAuthenticated()) {
      this.notifications.showError('Please login first.');
      return;
    }

    this.submitting.set(true);

    const notes = this.buildConsultationNotes();

    this.surgeriesApi
      .createConsultationRequest({
        procedureId: this.surgery().id,
        hospitalId: this.hospital().id,
        patient: {
          name: this.patientName().trim(),
          phone: this.patientPhone().trim(),
          email: this.patientEmail().trim() || undefined,
          notes: notes || undefined,
        },
      })
      .subscribe({
        next: (res) => {
          const ref = res.data.consultationRequest.id;
          const payload = this.buildPayload(ref);
          this.notifications.showSuccess('Surgery consultation request submitted successfully.');
          this.confirmed.emit(payload);
          this.submitting.set(false);
          this.close();
        },
        error: (err) => {
          this.notifications.showError(this.apiErrorService.getMessage(err));
          this.submitting.set(false);
        },
      });
  }

  private buildConsultationNotes(): string {
    const parts: string[] = [];
    const surgeon = this.selectedSurgeon();
    const date = this.formattedSelectedDate();
    const slot = this.selectedTimeSlot();

    if (surgeon) parts.push(`Preferred surgeon: ${surgeon.name}`);
    if (date && slot) parts.push(`Preferred consultation: ${date} · ${slot}`);

    const age = this.patientAge();
    if (age != null) parts.push(`Age: ${age}`);
    if (this.patientGender().trim()) parts.push(`Gender: ${this.patientGender().trim()}`);

    const history = this.patientMedicalHistory().trim();
    if (history) parts.push(`Medical history: ${history}`);

    const notes = this.patientNotes().trim();
    if (notes) parts.push(notes);

    return parts.join('\n');
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['backdrop'] === 'true') {
      this.close();
    }
  }
}
