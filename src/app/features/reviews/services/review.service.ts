import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateReviewRequest,
  ModerateReviewRequest,
  ReviewListQuery,
  UpdateReviewRequest,
} from '../../../core/models/review.model';
import { ReviewsActions } from '../store/reviews.actions';
import {
  selectDoctorReviewStats,
  selectDoctorReviews,
  selectMyReviews,
  selectReviews,
  selectReviewsError,
  selectReviewsLoading,
  selectReviewsPagination,
  selectReviewsQuery,
  selectReviewsSaving,
  selectReviewsSuccessMessage,
  selectSelectedReview,
} from '../store/reviews.selectors';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly store = inject(Store);

  readonly reviews = this.store.selectSignal(selectReviews);
  readonly myReviews = this.store.selectSignal(selectMyReviews);
  readonly doctorReviews = this.store.selectSignal(selectDoctorReviews);
  readonly doctorStats = this.store.selectSignal(selectDoctorReviewStats);
  readonly selectedReview = this.store.selectSignal(selectSelectedReview);
  readonly pagination = this.store.selectSignal(selectReviewsPagination);
  readonly query = this.store.selectSignal(selectReviewsQuery);
  readonly loading = this.store.selectSignal(selectReviewsLoading);
  readonly saving = this.store.selectSignal(selectReviewsSaving);
  readonly error = this.store.selectSignal(selectReviewsError);
  readonly successMessage = this.store.selectSignal(selectReviewsSuccessMessage);

  loadReviews(query?: Partial<ReviewListQuery>): void {
    this.store.dispatch(ReviewsActions.loadReviews({ query }));
  }

  loadMyReviews(): void {
    this.store.dispatch(ReviewsActions.loadMyReviews());
  }

  loadDoctorReviews(): void {
    this.store.dispatch(ReviewsActions.loadDoctorReviews());
  }

  loadByDoctorProfile(doctorProfileId: string): void {
    this.store.dispatch(ReviewsActions.loadByDoctorProfile({ doctorProfileId }));
  }

  loadByAppointment(appointmentId: string): void {
    this.store.dispatch(ReviewsActions.loadByAppointment({ appointmentId }));
  }

  createReview(appointmentId: string, payload: CreateReviewRequest): void {
    this.store.dispatch(ReviewsActions.createReview({ appointmentId, payload }));
  }

  updateReview(id: string, payload: UpdateReviewRequest): void {
    this.store.dispatch(ReviewsActions.updateReview({ id, payload }));
  }

  moderateReview(id: string, payload: ModerateReviewRequest): void {
    this.store.dispatch(ReviewsActions.moderateReview({ id, payload }));
  }

  deleteReview(id: string): void {
    this.store.dispatch(ReviewsActions.deleteReview({ id }));
  }

  clearSelectedReview(): void {
    this.store.dispatch(ReviewsActions.clearSelectedReview());
  }

  clearError(): void {
    this.store.dispatch(ReviewsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(ReviewsActions.clearSuccessMessage());
  }
}
