import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { DEFAULT_REVIEW_LIST_QUERY } from '../../../core/models/review.model';
import { ReviewApiService } from '../services/review-api.service';
import { ReviewsActions } from './reviews.actions';
import { selectReviewsQuery } from './reviews.selectors';

@Injectable()
export class ReviewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ReviewApiService);
  private readonly store = inject(Store);

  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviews),
      withLatestFrom(this.store.select(selectReviewsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_REVIEW_LIST_QUERY, ...current, ...query };
        return this.api.getReviews(merged).pipe(
          map((res) =>
            ReviewsActions.loadReviewsSuccess({
              reviews: res.data.reviews,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(ReviewsActions.loadReviewsFailure({ error: err.error?.message ?? 'Failed to load reviews' })),
          ),
        );
      }),
    ),
  );

  loadMyReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadMyReviews),
      exhaustMap(() =>
        this.api.getMyReviews().pipe(
          map((res) => ReviewsActions.loadMyReviewsSuccess({ reviews: res.data.reviews })),
          catchError((err) =>
            of(ReviewsActions.loadMyReviewsFailure({ error: err.error?.message ?? 'Failed to load reviews' })),
          ),
        ),
      ),
    ),
  );

  loadDoctorReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadDoctorReviews),
      exhaustMap(() =>
        this.api.getDoctorReviews().pipe(
          map((res) => ReviewsActions.loadDoctorReviewsSuccess({ reviews: res.data.reviews })),
          catchError((err) =>
            of(ReviewsActions.loadDoctorReviewsFailure({ error: err.error?.message ?? 'Failed to load reviews' })),
          ),
        ),
      ),
    ),
  );

  loadByDoctorProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadByDoctorProfile),
      exhaustMap(({ doctorProfileId }) =>
        this.api.getByDoctorProfileId(doctorProfileId).pipe(
          map((res) =>
            ReviewsActions.loadByDoctorProfileSuccess({
              reviews: res.data.reviews,
              stats: res.data.stats,
            }),
          ),
          catchError((err) =>
            of(
              ReviewsActions.loadByDoctorProfileFailure({
                error: err.error?.message ?? 'Failed to load doctor reviews',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadByAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadByAppointment),
      exhaustMap(({ appointmentId }) =>
        this.api.getByAppointmentId(appointmentId).pipe(
          map((res) => ReviewsActions.loadByAppointmentSuccess({ review: res.data.review })),
          catchError((err) =>
            of(ReviewsActions.loadByAppointmentFailure({ error: err.error?.message ?? 'Review not found' })),
          ),
        ),
      ),
    ),
  );

  createReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.createReview),
      exhaustMap(({ appointmentId, payload }) =>
        this.api.createForAppointment(appointmentId, payload).pipe(
          map((res) =>
            ReviewsActions.createReviewSuccess({
              review: res.data.review,
              message: res.message ?? 'Review submitted',
            }),
          ),
          catchError((err) =>
            of(ReviewsActions.createReviewFailure({ error: err.error?.message ?? 'Failed to submit review' })),
          ),
        ),
      ),
    ),
  );

  updateReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.updateReview),
      exhaustMap(({ id, payload }) =>
        this.api.updateReview(id, payload).pipe(
          map((res) =>
            ReviewsActions.updateReviewSuccess({
              review: res.data.review,
              message: res.message ?? 'Review updated',
            }),
          ),
          catchError((err) =>
            of(ReviewsActions.updateReviewFailure({ error: err.error?.message ?? 'Failed to update review' })),
          ),
        ),
      ),
    ),
  );

  moderateReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.moderateReview),
      exhaustMap(({ id, payload }) =>
        this.api.moderateReview(id, payload).pipe(
          map((res) =>
            ReviewsActions.moderateReviewSuccess({
              review: res.data.review,
              message: res.message ?? 'Review moderated',
            }),
          ),
          catchError((err) =>
            of(ReviewsActions.moderateReviewFailure({ error: err.error?.message ?? 'Failed to moderate review' })),
          ),
        ),
      ),
    ),
  );

  deleteReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.deleteReview),
      exhaustMap(({ id }) =>
        this.api.deleteReview(id).pipe(
          map((res) =>
            ReviewsActions.deleteReviewSuccess({ message: res.message ?? 'Review removed', id }),
          ),
          catchError((err) =>
            of(ReviewsActions.deleteReviewFailure({ error: err.error?.message ?? 'Failed to delete review' })),
          ),
        ),
      ),
    ),
  );
}
