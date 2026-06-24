import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicDoctorApiService } from '../../services/public-doctor-api.service';
import { getDummyDoctorById } from '../../data/dummy-doctors.data';
import {
  FIND_DOCTOR_SPECIALTIES,
  specialtyLabelFromSlug,
} from '../../../home/data/home-content';
import {
  DoctorConsultationOption,
  DoctorDetailProfile,
} from '../../../../core/models/doctor-profile.model';
import { buildBookingDateOptions, BookingDateOption } from '../../../appointments/utils/booking-date.util';

interface DateOption extends BookingDateOption {}

@Component({
  selector: 'app-doctor-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './doctor-detail-page.component.html',
  styleUrl: './doctor-detail-page.component.scss',
})
export class DoctorDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicDoctorApi = inject(PublicDoctorApiService);

  readonly doctor = signal<DoctorDetailProfile | null>(null);
  readonly loading = signal(true);
  readonly city = signal('Lahore');
  readonly specialtySlug = signal('');

  readonly selectedConsultationId = signal('');
  readonly selectedDateIndex = signal(0);
  readonly selectedTimeSlot = signal('');
  patientPhone = '';
  patientName = '';
  promoCode = '';

  readonly dateOptions = signal<DateOption[]>(buildBookingDateOptions());

  readonly breadcrumbSpecialty = computed(() => {
    const d = this.doctor();
    const slug = this.specialtySlug() || d?.specialties?.[0]?.slug || '';
    return specialtyLabelFromSlug(slug);
  });

  readonly specialtyUrdu = computed(() => {
    const slug = this.specialtySlug() || this.doctor()?.specialties?.[0]?.slug || '';
    return FIND_DOCTOR_SPECIALTIES.find((s) => s.slug === slug)?.urdu ?? '';
  });

  readonly selectedConsultation = computed(() => {
    const d = this.doctor();
    if (!d) return null;
    const id = this.selectedConsultationId();
    return d.consultationOptions.find((o) => o.id === id) ?? d.consultationOptions[0] ?? null;
  });

  readonly isVideoSelected = computed(() => this.selectedConsultation()?.type === 'video');

  readonly bookingButtonLabel = computed(() =>
    this.isVideoSelected() ? 'Book Video Consultation' : 'Book In-Clinic Appointment',
  );

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('doctorId') ?? '';
      this.loadDoctor(id);
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const city = params.get('city');
      if (city) this.city.set(city);
      const specialty = params.get('specialty');
      if (specialty) this.specialtySlug.set(specialty);
    });
  }

  private loadDoctor(id: string): void {
    if (!id) {
      this.doctor.set(null);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    this.publicDoctorApi.getDoctorById(id).subscribe({
      next: (res) => {
        const profile = res.data?.doctor;
        if (profile) {
          this.applyDoctor(profile);
        } else {
          this.applyDemoDoctor(id);
        }
        this.loading.set(false);
      },
      error: () => {
        this.applyDemoDoctor(id);
        this.loading.set(false);
      },
    });
  }

  private applyDemoDoctor(id: string): void {
    const demo = getDummyDoctorById(id, this.city());
    this.doctor.set(demo);
    if (demo) {
      this.initSelections(demo);
    }
  }

  private applyDoctor(profile: DoctorDetailProfile): void {
    this.doctor.set(profile);
    this.initSelections(profile);
  }

  private initSelections(d: DoctorDetailProfile): void {
    const firstOption = d.consultationOptions[0];
    if (firstOption) {
      this.selectedConsultationId.set(firstOption.id);
    }
    if (d.timeSlots.length) {
      this.selectedTimeSlot.set(d.timeSlots[0]);
    }
  }

  doctorName(d: DoctorDetailProfile): string {
    const title = d.title ? `${d.title} ` : 'Dr. ';
    return `${title}${d.user?.firstName ?? ''} ${d.user?.lastName ?? ''}`.trim();
  }

  qualificationLine(d: DoctorDetailProfile): string {
    return (d.qualifications ?? []).map((q) => q.degree).join(', ');
  }

  specialtyLine(d: DoctorDetailProfile): string {
    const name = d.specialties?.[0]?.name ?? 'General Physician';
    const urdu = this.specialtyUrdu();
    return urdu ? `${name} - ${urdu}` : name;
  }

  formatFee(fee: number, currency = 'PKR'): string {
    const symbol = !currency || currency === 'USD' || currency === 'PKR' ? 'Rs.' : currency;
    return `${symbol} ${fee.toLocaleString()}`;
  }

  ratingPercent(score: number): number {
    return Math.round((score / 5) * 100);
  }

  starArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? 1 : 0));
  }

  selectConsultation(option: DoctorConsultationOption): void {
    this.selectedConsultationId.set(option.id);
  }

  selectDate(index: number): void {
    this.selectedDateIndex.set(index);
  }

  selectTimeSlot(slot: string): void {
    this.selectedTimeSlot.set(slot);
  }

  monthLabel(): string {
    const date = this.dateOptions()[this.selectedDateIndex()]?.date ?? new Date();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  isTopBooked(): boolean {
    const d = this.doctor();
    if (!d) return false;
    return (d.yearsOfExperience ?? 0) >= 15;
  }

  findDoctorsLink(): string[] {
    const slug = this.specialtySlug() || this.doctor()?.specialties?.[0]?.slug || 'general-practitioner';
    return ['/find-doctors', slug];
  }

  findDoctorsQueryParams(): { city: string } {
    return { city: this.city() };
  }

  scrollDates(direction: 'left' | 'right'): void {
    const el = document.getElementById('date-scroll');
    if (el) {
      el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  }
}
