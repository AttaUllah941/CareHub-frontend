import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateReviewRequest,
  ModerateReviewRequest,
  Review,
  ReviewListQuery,
  ReviewRatingStats,
  UpdateReviewRequest,
} from '../../../core/models/review.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const ReviewsActions = createActionGroup({
  source: 'Reviews',
  events: {
    'Load Reviews': props<{ query?: Partial<ReviewListQuery> }>(),
    'Load Reviews Success': props<{
      reviews: Review[];
      pagination: PaginationMeta;
      query: ReviewListQuery;
    }>(),
    'Load Reviews Failure': props<{ error: string }>(),

    'Load My Reviews': emptyProps(),
    'Load My Reviews Success': props<{ reviews: Review[] }>(),
    'Load My Reviews Failure': props<{ error: string }>(),

    'Load Doctor Reviews': emptyProps(),
    'Load Doctor Reviews Success': props<{ reviews: Review[] }>(),
    'Load Doctor Reviews Failure': props<{ error: string }>(),

    'Load By Doctor Profile': props<{ doctorProfileId: string }>(),
    'Load By Doctor Profile Success': props<{
      reviews: Review[];
      stats: ReviewRatingStats;
    }>(),
    'Load By Doctor Profile Failure': props<{ error: string }>(),

    'Load By Appointment': props<{ appointmentId: string }>(),
    'Load By Appointment Success': props<{ review: Review }>(),
    'Load By Appointment Failure': props<{ error: string }>(),

    'Create Review': props<{ appointmentId: string; payload: CreateReviewRequest }>(),
    'Create Review Success': props<{ review: Review; message: string }>(),
    'Create Review Failure': props<{ error: string }>(),

    'Update Review': props<{ id: string; payload: UpdateReviewRequest }>(),
    'Update Review Success': props<{ review: Review; message: string }>(),
    'Update Review Failure': props<{ error: string }>(),

    'Moderate Review': props<{ id: string; payload: ModerateReviewRequest }>(),
    'Moderate Review Success': props<{ review: Review; message: string }>(),
    'Moderate Review Failure': props<{ error: string }>(),

    'Delete Review': props<{ id: string }>(),
    'Delete Review Success': props<{ message: string; id: string }>(),
    'Delete Review Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
    'Clear Selected Review': emptyProps(),
  },
});
