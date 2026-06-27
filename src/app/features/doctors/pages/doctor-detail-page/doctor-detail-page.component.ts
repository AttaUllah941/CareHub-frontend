import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicDoctorApiService } from '../../services/public-doctor-api.service';
import { DoctorReviewsApiService } from '../../services/doctor-reviews-api.service';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserRole } from '../../../../core/models/auth.model';
import {
  DoctorConsultationOption,
  DoctorDetailProfile,
} from '../../../../core/models/doctor-profile.model';
import { DoctorReview } from '../../../../core/models/review.model';
import { buildBookingDateOptions, BookingDateOption } from '../../../appointments/utils/booking-date.util';
import { VideoConsultationModalComponent } from '../../../appointments/components/video-consultation-modal/video-consultation-modal.component';
import { ClinicAppointmentModalComponent } from '../../../appointments/components/clinic-appointment-modal/clinic-appointment-modal.component';

interface DateOption extends BookingDateOption {}

@Component({
  selector: 'app-doctor-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe, VideoConsultationModalComponent, ClinicAppointmentModalComponent],
  templateUrl: './doctor-detail-page.component.html',
  styleUrl: './doctor-detail-page.component.scss',
})
export class DoctorDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicDoctorApi = inject(PublicDoctorApiService);
  private readonly reviewsApi = inject(DoctorReviewsApiService);
  private readonly referenceData = inject(ReferenceDataService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  protected readonly authService = inject(AuthService);
  protected readonly UserRole = UserRole;

  readonly doctor = signal<DoctorDetailProfile | null>(null);
  readonly reviews = signal<DoctorReview[]>([]);
  readonly reviewsLoading = signal(false);
  readonly reviewSubmitting = signal(false);
  readonly reviewError = signal<string | null>(null);
  readonly showReviewForm = signal(false);
  readonly reviewRating = signal(5);
  readonly reviewHeadline = signal('');
  readonly reviewBody = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly city = signal('Lahore');
  readonly specialtySlug = signal('');

  readonly selectedConsultationId = signal('');
  readonly selectedDateIndex = signal(0);
  readonly selectedTimeSlot = signal('');
  patientPhone = '';
  patientName = '';
  promoCode = '';

  readonly dateOptions = signal<DateOption[]>(buildBookingDateOptions());

  readonly videoModalOpen = signal(false);
  readonly appointmentModalOpen = signal(false);

  readonly breadcrumbSpecialty = computed(() => {
    const d = this.doctor();
    const slug = this.specialtySlug() || d?.specialties?.[0]?.slug || '';
    return this.referenceData.getSpecialtyName(slug);
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
      this.reviews.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.reviews.set([]);

    this.publicDoctorApi.getDoctorById(id).subscribe({
      next: (res) => {
        const profile = res.data?.doctor;
        if (profile) {
          this.applyDoctor(profile);
          this.loadReviews(id);
        } else {
          this.doctor.set(null);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.doctor.set(null);
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  private loadReviews(doctorId: string): void {
    this.reviewsLoading.set(true);

    this.reviewsApi.listByDoctor(doctorId, { page: 1, limit: 20, sortBy: 'date', sortOrder: 'desc' }).subscribe({
      next: (res) => {
        this.reviews.set(res.data.reviews);
        this.reviewsLoading.set(false);
      },
      error: () => {
        this.reviews.set([]);
        this.reviewsLoading.set(false);
      },
    });
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
    const slug = this.specialtySlug() || d.specialties?.[0]?.slug;
    if (slug) return this.referenceData.getSpecialtyName(slug);
    return d.specialties?.[0]?.name ?? 'General Physician';
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

  openVideoModal(): void {
    this.videoModalOpen.set(true);
  }

  closeVideoModal(): void {
    this.videoModalOpen.set(false);
  }

  openAppointmentModal(): void {
    this.appointmentModalOpen.set(true);
  }

  closeAppointmentModal(): void {
    this.appointmentModalOpen.set(false);
  }

  canSubmitReview(): boolean {
    return (
      this.authService.isAuthenticated() &&
      this.authService.hasRole(UserRole.PATIENT) &&
      this.reviewHeadline().trim().length >= 3 &&
      this.reviewBody().trim().length >= 10
    );
  }

  submitReview(): void {
    const doctor = this.doctor();
    if (!doctor || !this.canSubmitReview() || this.reviewSubmitting()) return;

    this.reviewSubmitting.set(true);
    this.reviewError.set(null);

    this.reviewsApi
      .create(doctor.id, {
        rating: this.reviewRating(),
        headline: this.reviewHeadline().trim(),
        body: this.reviewBody().trim(),
      })
      .subscribe({
        next: () => {
          this.notifications.showSuccess('Thank you for your review.');
          this.reviewHeadline.set('');
          this.reviewBody.set('');
          this.reviewRating.set(5);
          this.showReviewForm.set(false);
          this.reviewSubmitting.set(false);
          this.loadReviews(doctor.id);
        },
        error: (err) => {
          this.reviewError.set(this.apiErrorService.getMessage(err));
          this.reviewSubmitting.set(false);
        },
      });
  }
}
