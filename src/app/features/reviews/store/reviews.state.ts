import {
  Review,
  ReviewListQuery,
  ReviewRatingStats,
  DEFAULT_REVIEW_LIST_QUERY,
} from '../../../core/models/review.model';

export interface ReviewsState {
  reviews: Review[];
  myReviews: Review[];
  doctorReviews: Review[];
  doctorProfileReviews: Review[];
  doctorStats: ReviewRatingStats | null;
  selectedReview: Review | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: ReviewListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const REVIEWS_FEATURE_KEY = 'reviews';

export const initialReviewsState: ReviewsState = {
  reviews: [],
  myReviews: [],
  doctorReviews: [],
  doctorProfileReviews: [],
  doctorStats: null,
  selectedReview: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_REVIEW_LIST_QUERY },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
