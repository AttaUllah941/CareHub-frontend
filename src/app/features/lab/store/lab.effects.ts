import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_LAB_LIST_QUERY } from '../../../core/models/lab.model';
import { LabApiService } from '../services/lab-api.service';
import { LabActions } from './lab.actions';
import { selectLabState } from './lab.selectors';

@Injectable()
export class LabEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(LabApiService);
  private readonly store = inject(Store);

  loadLabs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.loadLabs),
      withLatestFrom(this.store.select(selectLabState)),
      exhaustMap(([{ query }, state]) => {
        const merged = { ...DEFAULT_LAB_LIST_QUERY, ...state.labsQuery, ...query };
        return this.api.getLabs(merged).pipe(
          map((res) => LabActions.loadLabsSuccess({ labs: res.data.labs, pagination: res.data.pagination, query: merged })),
          catchError((err) => of(LabActions.loadLabsFailure({ error: err.error?.message ?? 'Failed to load labs' }))),
        );
      }),
    ),
  );

  createLab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.createLab),
      exhaustMap(({ payload }) =>
        this.api.createLab(payload).pipe(
          map((res) => LabActions.createLabSuccess({ lab: res.data.lab, message: res.message ?? 'Lab created' })),
          tap(() => this.store.dispatch(LabActions.loadLabs({}))),
          catchError((err) => of(LabActions.createLabFailure({ error: err.error?.message ?? 'Failed to create lab' }))),
        ),
      ),
    ),
  );

  loadTests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.loadTests),
      exhaustMap(({ query }) =>
        this.api.getTests(query).pipe(
          map((res) => LabActions.loadTestsSuccess({ tests: res.data.tests, pagination: res.data.pagination })),
          catchError((err) => of(LabActions.loadTestsFailure({ error: err.error?.message ?? 'Failed to load tests' }))),
        ),
      ),
    ),
  );

  createTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.createTest),
      exhaustMap(({ payload }) =>
        this.api.createTest(payload).pipe(
          map((res) => LabActions.createTestSuccess({ test: res.data.test, message: res.message ?? 'Test created' })),
          tap(() => this.store.dispatch(LabActions.loadTests({}))),
          catchError((err) => of(LabActions.createTestFailure({ error: err.error?.message ?? 'Failed to create test' }))),
        ),
      ),
    ),
  );

  loadBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.loadBookings),
      exhaustMap(({ query }) =>
        this.api.getBookings(query).pipe(
          map((res) => LabActions.loadBookingsSuccess({ bookings: res.data.bookings, pagination: res.data.pagination })),
          catchError((err) => of(LabActions.loadBookingsFailure({ error: err.error?.message ?? 'Failed to load bookings' }))),
        ),
      ),
    ),
  );

  loadMyBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.loadMyBookings),
      exhaustMap(() =>
        this.api.getMyBookings().pipe(
          map((res) => LabActions.loadMyBookingsSuccess({ bookings: res.data.bookings })),
          catchError((err) => of(LabActions.loadMyBookingsFailure({ error: err.error?.message ?? 'Failed to load bookings' }))),
        ),
      ),
    ),
  );

  createBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.createBooking),
      exhaustMap(({ payload }) =>
        this.api.createBooking(payload).pipe(
          map((res) => LabActions.createBookingSuccess({ booking: res.data.booking, message: res.message ?? 'Booking created' })),
          catchError((err) => of(LabActions.createBookingFailure({ error: err.error?.message ?? 'Failed to create booking' }))),
        ),
      ),
    ),
  );

  updateBookingStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.updateBookingStatus),
      exhaustMap(({ id, status, notes }) =>
        this.api.updateBookingStatus(id, { status, notes }).pipe(
          map((res) => LabActions.updateBookingStatusSuccess({ booking: res.data.booking, message: res.message ?? 'Updated' })),
          catchError((err) => of(LabActions.updateBookingStatusFailure({ error: err.error?.message ?? 'Update failed' }))),
        ),
      ),
    ),
  );

  loadMyReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.loadMyReports),
      exhaustMap(() =>
        this.api.getMyReports().pipe(
          map((res) => LabActions.loadMyReportsSuccess({ reports: res.data.reports })),
          catchError((err) => of(LabActions.loadMyReportsFailure({ error: err.error?.message ?? 'Failed to load reports' }))),
        ),
      ),
    ),
  );

  loadReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.loadReports),
      exhaustMap(({ query }) =>
        this.api.getReports(query).pipe(
          map((res) => LabActions.loadReportsSuccess({ reports: res.data.reports, pagination: res.data.pagination })),
          catchError((err) => of(LabActions.loadReportsFailure({ error: err.error?.message ?? 'Failed to load reports' }))),
        ),
      ),
    ),
  );

  uploadReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.uploadReport),
      exhaustMap(({ formData }) =>
        this.api.uploadReport(formData).pipe(
          map((res) => LabActions.uploadReportSuccess({ report: res.data.report, message: res.message ?? 'Report uploaded' })),
          catchError((err) => of(LabActions.uploadReportFailure({ error: err.error?.message ?? 'Upload failed' }))),
        ),
      ),
    ),
  );
}
