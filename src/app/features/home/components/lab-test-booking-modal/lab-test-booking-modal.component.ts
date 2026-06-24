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
import { formatLabPrice, LabTest, PublicLab } from '../../data/dummy-labs.data';
import { AuthService } from '../../../auth/services/auth.service';
import { buildBookingDateOptions, BookingDateOption } from '../../utils/booking-date.util';
import { logBookingPayloadInBrowser, setBodyScrollLocked } from '../../utils/browser.util';
import { patientDefaultsFromUser } from '../../utils/patient-form.util';
import { LabSampleCollectionType, LabTestBookingPayload } from './lab-test-booking-payload.model';

interface DateOption extends BookingDateOption {}

const HOME_COLLECTION_SLOTS = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM'];
const LAB_VISIT_SLOTS = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

@Component({
  selector: 'app-lab-test-booking-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lab-test-booking-modal.component.html',
  styleUrl: './lab-test-booking-modal.component.scss',
})
export class LabTestBookingModalComponent {
  private readonly auth = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly open = input(false);
  readonly test = input.required<LabTest>();
  readonly lab = input.required<PublicLab>();

  readonly closed = output<void>();
  readonly confirmed = output<LabTestBookingPayload>();

  readonly dateScroll = viewChild<ElementRef<HTMLElement>>('dateScroll');

  readonly collectionType = signal<LabSampleCollectionType | ''>('');
  readonly selectedDateIndex = signal(0);
  readonly selectedTimeSlot = signal('');
  readonly showValidation = signal(false);

  readonly patientName = signal('');
  readonly patientAge = signal<number | null>(null);
  readonly patientPhone = signal('');
  readonly patientGender = signal('');
  readonly patientEmail = signal('');
  readonly patientAddress = signal('');
  readonly patientNotes = signal('');

  readonly dateOptions = signal<DateOption[]>(buildBookingDateOptions());

  readonly homeCollectionAvailable = computed(() => this.lab().isHomeCollection);

  readonly timeSlots = computed(() =>
    this.collectionType() === 'home_sample' ? HOME_COLLECTION_SLOTS : LAB_VISIT_SLOTS,
  );

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

  readonly collectionSelected = computed(() => Boolean(this.collectionType()));

  readonly scheduleComplete = computed(() => Boolean(this.selectedTimeSlot()));

  readonly patientNameValid = computed(() => this.patientName().trim().length >= 2);

  readonly patientAgeValid = computed(() => {
    const age = this.patientAge();
    return age != null && age > 0 && age <= 120;
  });

  readonly patientPhoneValid = computed(() => /^[0-9]{10,11}$/.test(this.patientPhone().replace(/\D/g, '')));

  readonly patientAddressValid = computed(() => {
    if (this.collectionType() !== 'home_sample') return true;
    return this.patientAddress().trim().length >= 10;
  });

  readonly patientFormComplete = computed(
    () =>
      this.patientNameValid() &&
      this.patientAgeValid() &&
      this.patientPhoneValid() &&
      this.patientAddressValid(),
  );

  readonly canConfirm = computed(
    () => this.collectionSelected() && this.scheduleComplete() && this.patientFormComplete(),
  );

  readonly completionPercent = computed(() => {
    let steps = 0;
    if (this.collectionSelected()) steps++;
    if (this.scheduleComplete()) steps++;
    if (this.patientNameValid()) steps++;
    if (this.patientAgeValid()) steps++;
    if (this.patientPhoneValid()) steps++;
    if (this.patientAddressValid()) steps++;
    const total = this.collectionType() === 'home_sample' ? 6 : 5;
    return Math.round((steps / total) * 100);
  });

  readonly footerHint = computed(() => {
    if (this.canConfirm()) return 'All set — you can confirm your lab test booking.';
    if (!this.collectionSelected()) return 'Choose home collection or lab visit to continue.';
    if (!this.scheduleComplete()) return 'Pick a date and time slot for sample collection.';
    if (!this.patientNameValid()) return 'Enter the patient\'s full name (at least 2 characters).';
    if (!this.patientAgeValid()) return 'Enter a valid age between 1 and 120.';
    if (!this.patientPhoneValid()) return 'Enter a valid phone number (10–11 digits).';
    if (!this.patientAddressValid()) return 'Enter a complete home address for sample collection.';
    return 'Complete the form to enable confirmation.';
  });

  readonly labTimingsLabel = computed(() => {
    const t = this.lab().timings;
    let label = `Mon–Fri: ${t.weekdays}`;
    if (t.saturday) label += ` · Sat: ${t.saturday}`;
    if (t.sunday) label += ` · Sun: ${t.sunday}`;
    return label;
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
    this.collectionType.set(this.lab().isHomeCollection ? '' : 'lab_visit');
    this.selectedDateIndex.set(0);
    this.selectedTimeSlot.set('');
    this.dateOptions.set(buildBookingDateOptions());

    const defaults = patientDefaultsFromUser(this.auth.user());
    this.patientName.set(defaults.name);
    this.patientPhone.set(defaults.phone);
    this.patientEmail.set(defaults.email);
    this.patientAge.set(null);
    this.patientGender.set('');
    this.patientAddress.set('');
    this.patientNotes.set('');

    if (!this.lab().isHomeCollection) {
      this.selectedTimeSlot.set(LAB_VISIT_SLOTS[0]);
    }
  }

  private buildPayload(ref: string): LabTestBookingPayload {
    const test = this.test();
    const lab = this.lab();
    const type = this.collectionType() as LabSampleCollectionType;
    const dateIso = this.selectedDate()?.date.toISOString() ?? new Date().toISOString();

    return {
      bookingRef: ref,
      collectionType: type,
      collectionLabel: type === 'home_sample' ? 'Home Sample Collection' : 'Lab Visit Sample Collection',
      test: {
        id: test.id,
        slug: test.slug,
        name: test.name,
        description: test.description,
        category: test.category,
        price: test.price,
        priceFormatted: formatLabPrice(test.price),
        sampleType: test.sampleType,
        turnaroundTime: test.turnaroundTime,
        preparation: test.preparation,
      },
      lab: {
        id: lab.id,
        slug: lab.slug,
        name: lab.name,
        address: lab.address,
        city: lab.city,
        phone: lab.phone,
        email: lab.email,
        timings: this.labTimingsLabel(),
        isHomeCollection: lab.isHomeCollection,
      },
      appointment: {
        date: dateIso,
        dateFormatted: this.formattedSelectedDate(),
        timeSlot: this.selectedTimeSlot(),
      },
      patient: {
        name: this.patientName().trim(),
        age: this.patientAge()!,
        gender: this.patientGender(),
        phone: this.patientPhone().trim(),
        email: this.patientEmail().trim(),
        address: this.patientAddress().trim(),
        notes: this.patientNotes().trim(),
      },
      meta: {
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      },
    };
  }

  formatPrice(price: number): string {
    return formatLabPrice(price);
  }

  monthLabel(): string {
    const date = this.dateOptions()[this.selectedDateIndex()]?.date ?? new Date();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  selectCollection(type: LabSampleCollectionType): void {
    this.collectionType.set(type);
    const slots = type === 'home_sample' ? HOME_COLLECTION_SLOTS : LAB_VISIT_SLOTS;
    this.selectedTimeSlot.set(slots[0]);
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

  confirmBooking(): void {
    this.showValidation.set(true);
    if (!this.canConfirm()) return;

    const ref = `LT-${Date.now().toString(36).toUpperCase()}`;
    const payload = this.buildPayload(ref);

    logBookingPayloadInBrowser(
      this.isBrowser,
      '✅ Lab Test Booking — Form submitted (frontend payload)',
      payload,
      {
        Test: payload.test.name,
        Lab: payload.lab.name,
        Collection: payload.collectionLabel,
        Date: payload.appointment.dateFormatted,
        Time: payload.appointment.timeSlot,
        Patient: payload.patient.name,
        Phone: payload.patient.phone,
        Price: payload.test.priceFormatted,
        Ref: payload.bookingRef,
      },
    );
    this.confirmed.emit(payload);
    this.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['backdrop'] === 'true') {
      this.close();
    }
  }
}
