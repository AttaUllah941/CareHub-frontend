import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { DoctorAvailabilityApiService } from '../services/doctor-availability-api.service';
import { DoctorAvailabilityActions } from './doctor-availability.actions';

@Injectable()
export class DoctorAvailabilityEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(DoctorAvailabilityApiService);

  loadAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorAvailabilityActions.loadAvailability),
      exhaustMap(() =>
        this.api.getMyAvailability().pipe(
          map((res) =>
            DoctorAvailabilityActions.loadAvailabilitySuccess({ availability: res.data.availability }),
          ),
          catchError((err) =>
            of(
              DoctorAvailabilityActions.loadAvailabilityFailure({
                error: err.error?.message ?? 'Failed to load availability',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorAvailabilityActions.updateAvailability),
      exhaustMap(({ payload }) =>
        this.api.updateMyAvailability(payload).pipe(
          map((res) =>
            DoctorAvailabilityActions.updateAvailabilitySuccess({
              availability: res.data.availability,
              message: res.message ?? 'Availability saved',
            }),
          ),
          catchError((err) =>
            of(
              DoctorAvailabilityActions.updateAvailabilityFailure({
                error: err.error?.message ?? 'Failed to save availability',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadSlotsPreview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorAvailabilityActions.loadSlotsPreview),
      exhaustMap(({ date }) =>
        this.api.getMySlots(date).pipe(
          map((res) => DoctorAvailabilityActions.loadSlotsPreviewSuccess(res.data)),
          catchError((err) =>
            of(
              DoctorAvailabilityActions.loadSlotsPreviewFailure({
                error: err.error?.message ?? 'Failed to load slots',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
