import { createFeatureSelector, createSelector } from '@ngrx/store';
import { REVIEWS_FEATURE_KEY, ReviewsState } from './reviews.state';

export const selectReviewsState = createFeatureSelector<ReviewsState>(REVIEWS_FEATURE_KEY);

export const selectReviews = createSelector(selectReviewsState, (s) => s.reviews);
export const selectMyReviews = createSelector(selectReviewsState, (s) => s.myReviews);
export const selectDoctorReviews = createSelector(selectReviewsState, (s) => s.doctorReviews);
export const selectDoctorProfileReviews = createSelector(selectReviewsState, (s) => s.doctorProfileReviews);
export const selectDoctorReviewStats = createSelector(selectReviewsState, (s) => s.doctorStats);
export const selectSelectedReview = createSelector(selectReviewsState, (s) => s.selectedReview);
export const selectReviewsPagination = createSelector(selectReviewsState, (s) => s.pagination);
export const selectReviewsQuery = createSelector(selectReviewsState, (s) => s.query);
export const selectReviewsLoading = createSelector(selectReviewsState, (s) => s.loading);
export const selectReviewsSaving = createSelector(selectReviewsState, (s) => s.saving);
export const selectReviewsError = createSelector(selectReviewsState, (s) => s.error);
export const selectReviewsSuccessMessage = createSelector(selectReviewsState, (s) => s.successMessage);
