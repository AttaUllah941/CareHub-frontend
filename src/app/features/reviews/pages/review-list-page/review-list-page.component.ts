import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { ReviewService } from '../../services/review.service';
import { ReviewTableComponent } from '../../components/review-table/review-table.component';
import { ReviewDetailComponent } from '../../components/review-detail/review-detail.component';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Appointment } from '../../../../core/models/appointment.model';
import { CreateReviewRequest, Review } from '../../../../core/models/review.model';

@Component({
  selector: 'app-review-list-page',
  standalone: true,
  imports: [DatePipe, ReviewTableComponent, ReviewDetailComponent, ReviewFormComponent, AlertComponent],
  templateUrl: './review-list-page.component.html',
  styleUrl: './review-list-page.component.scss',
})
export class ReviewListPageComponent implements OnInit {
  protected readonly reviewService = inject(ReviewService);
  protected readonly appointmentService = inject(AppointmentService);

  readonly selected = signal<Review | null>(null);
  readonly editing = signal<Review | null>(null);
  readonly reviewingAppointment = signal<Appointment | null>(null);

  constructor() {
    effect(() => {
      if (this.reviewService.successMessage()) {
        this.reviewingAppointment.set(null);
        this.editing.set(null);
        this.reviewService.loadMyReviews();
        this.appointmentService.loadMyAppointments('COMPLETED');
      }
    });
  }

  ngOnInit(): void {
    this.reviewService.clearError();
    this.reviewService.clearSuccessMessage();
    this.reviewService.loadMyReviews();
    this.appointmentService.loadMyAppointments('COMPLETED');
  }

  completedWithoutReview(): Appointment[] {
    const reviewed = new Set(this.reviewService.myReviews().map((r) => r.appointmentId));
    return this.appointmentService
      .myAppointments()
      .filter((a) => a.status === 'COMPLETED' && !reviewed.has(a.id));
  }

  startReview(appointment: Appointment): void {
    this.reviewingAppointment.set(appointment);
    this.editing.set(null);
    this.selected.set(null);
  }

  onView(r: Review): void {
    this.selected.set(r);
    this.editing.set(null);
    this.reviewingAppointment.set(null);
  }

  onEdit(r: Review): void {
    this.editing.set(r);
    this.selected.set(null);
    this.reviewingAppointment.set(null);
  }

  onSubmitCreate(payload: CreateReviewRequest): void {
    const appt = this.reviewingAppointment();
    if (!appt) return;
    this.reviewService.createReview(appt.id, payload);
  }

  onSubmitEdit(payload: CreateReviewRequest): void {
    const review = this.editing();
    if (!review) return;
    this.reviewService.updateReview(review.id, payload);
  }

  closeDetail(): void {
    this.selected.set(null);
    this.editing.set(null);
    this.reviewingAppointment.set(null);
  }
}
