import { createReducer, on } from '@ngrx/store';
import { DEFAULT_REVIEW_LIST_QUERY } from '../../../core/models/review.model';
import { Review } from '../../../core/models/review.model';
import { ReviewsActions } from './reviews.actions';
import { initialReviewsState } from './reviews.state';

const setSaving = (state: typeof initialReviewsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialReviewsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const reviewsReducer = createReducer(
  initialReviewsState,

  on(ReviewsActions.loadReviews, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_REVIEW_LIST_QUERY, ...state.query, ...query },
  })),
  on(ReviewsActions.loadReviewsSuccess, (state, { reviews, pagination, query }) => ({
    ...state,
    reviews,
    pagination,
    query,
    loading: false,
  })),
  on(ReviewsActions.loadReviewsFailure, setFailure),

  on(
    ReviewsActions.loadMyReviews,
    ReviewsActions.loadDoctorReviews,
    ReviewsActions.loadByDoctorProfile,
    ReviewsActions.loadByAppointment,
    (state) => ({ ...state, loading: true, error: null }),
  ),
  on(ReviewsActions.loadMyReviewsSuccess, (state, { reviews }) => ({
    ...state,
    myReviews: reviews,
    loading: false,
  })),
  on(ReviewsActions.loadDoctorReviewsSuccess, (state, { reviews }) => ({
    ...state,
    doctorReviews: reviews,
    loading: false,
  })),
  on(ReviewsActions.loadByDoctorProfileSuccess, (state, { reviews, stats }) => ({
    ...state,
    doctorProfileReviews: reviews,
    doctorStats: stats,
    loading: false,
  })),
  on(ReviewsActions.loadByAppointmentSuccess, (state, { review }) => ({
    ...state,
    selectedReview: review,
    loading: false,
  })),
  on(
    ReviewsActions.loadMyReviewsFailure,
    ReviewsActions.loadDoctorReviewsFailure,
    ReviewsActions.loadByDoctorProfileFailure,
    ReviewsActions.loadByAppointmentFailure,
    setFailure,
  ),
  on(ReviewsActions.clearSelectedReview, (state) => ({
    ...state,
    selectedReview: null,
  })),

  on(
    ReviewsActions.createReview,
    ReviewsActions.updateReview,
    ReviewsActions.moderateReview,
    ReviewsActions.deleteReview,
    setSaving,
  ),
  on(ReviewsActions.createReviewSuccess, (state, { review, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedReview: review,
    myReviews: upsert(state.myReviews, review),
    reviews: upsert(state.reviews, review),
  })),
  on(ReviewsActions.updateReviewSuccess, (state, { review, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedReview: review,
    myReviews: upsert(state.myReviews, review),
    doctorReviews: upsert(state.doctorReviews, review),
    reviews: upsert(state.reviews, review),
  })),
  on(ReviewsActions.moderateReviewSuccess, (state, { review, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    reviews: upsert(state.reviews, review),
    doctorReviews: upsert(state.doctorReviews, review),
    myReviews: upsert(state.myReviews, review),
  })),
  on(ReviewsActions.deleteReviewSuccess, (state, { message, id }) => ({
    ...state,
    saving: false,
    successMessage: message,
    reviews: state.reviews.filter((r) => r.id !== id),
    myReviews: state.myReviews.filter((r) => r.id !== id),
    doctorReviews: state.doctorReviews.filter((r) => r.id !== id),
    selectedReview: state.selectedReview?.id === id ? null : state.selectedReview,
  })),
  on(
    ReviewsActions.createReviewFailure,
    ReviewsActions.updateReviewFailure,
    ReviewsActions.moderateReviewFailure,
    ReviewsActions.deleteReviewFailure,
    setFailure,
  ),

  on(ReviewsActions.clearError, (state) => ({ ...state, error: null })),
  on(ReviewsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);

function upsert(list: Review[], review: Review) {
  return list.some((r) => r.id === review.id)
    ? list.map((r) => (r.id === review.id ? review : r))
    : [review, ...list];
}
