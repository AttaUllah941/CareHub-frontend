import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_APPOINTMENT_LIST_QUERY } from '../../../core/models/appointment.model';
import { AppointmentApiService } from '../services/appointment-api.service';
import { AppointmentsActions } from './appointments.actions';
import { selectAppointmentsQuery } from './appointments.selectors';

@Injectable()
export class AppointmentsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(AppointmentApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  loadAvailableSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.loadAvailableSlots),
      exhaustMap(({ doctorProfileId, date, clinicId }) =>
        this.api.getAvailableSlots(doctorProfileId, date, clinicId).pipe(
          map((res) => AppointmentsActions.loadAvailableSlotsSuccess({ slots: res.data })),
          catchError((err) =>
            of(
              AppointmentsActions.loadAvailableSlotsFailure({
                error: err.error?.message ?? 'Failed to load slots',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadRecurringSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.loadRecurringSlots),
      exhaustMap(({ doctorProfileId, fromDate, toDate, clinicId, maxDays }) =>
        this.api.getRecurringSlots(doctorProfileId, fromDate, toDate, { clinicId, maxDays }).pipe(
          map((res) => AppointmentsActions.loadRecurringSlotsSuccess({ slots: res.data })),
          catchError((err) =>
            of(
              AppointmentsActions.loadRecurringSlotsFailure({
                error: err.error?.message ?? 'Failed to load recurring slots',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.loadAppointments),
      withLatestFrom(this.store.select(selectAppointmentsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_APPOINTMENT_LIST_QUERY, ...current, ...query };
        return this.api.getAppointments(merged).pipe(
          map((res) =>
            AppointmentsActions.loadAppointmentsSuccess({
              appointments: res.data.appointments,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(
              AppointmentsActions.loadAppointmentsFailure({
                error: err.error?.message ?? 'Failed to load appointments',
              }),
            ),
          ),
        );
      }),
    ),
  );

  loadMyAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.loadMyAppointments),
      exhaustMap(({ status }) =>
        this.api.getMyAppointments(status).pipe(
          map((res) =>
            AppointmentsActions.loadMyAppointmentsSuccess({ appointments: res.data.appointments }),
          ),
          catchError((err) =>
            of(
              AppointmentsActions.loadMyAppointmentsFailure({
                error: err.error?.message ?? 'Failed to load appointments',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadDoctorAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.loadDoctorAppointments),
      exhaustMap(({ status }) =>
        this.api.getDoctorAppointments(status).pipe(
          map((res) =>
            AppointmentsActions.loadDoctorAppointmentsSuccess({ appointments: res.data.appointments }),
          ),
          catchError((err) =>
            of(
              AppointmentsActions.loadDoctorAppointmentsFailure({
                error: err.error?.message ?? 'Failed to load appointments',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  bookAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.bookAppointment),
      exhaustMap(({ payload }) =>
        this.api.bookAppointment(payload).pipe(
          map((res) =>
            AppointmentsActions.bookAppointmentSuccess({
              appointment: res.data.appointment,
              message: res.message ?? 'Appointment booked',
            }),
          ),
          catchError((err) =>
            of(
              AppointmentsActions.bookAppointmentFailure({
                error: err.error?.message ?? 'Failed to book appointment',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  bookAppointmentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.bookAppointmentSuccess),
        tap(() => this.router.navigate(['/patient/appointments'])),
      ),
    { dispatch: false },
  );

  updateAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.updateAppointment),
      exhaustMap(({ id, payload, patientMode }) => {
        const request$ = patientMode
          ? this.api.updateMyAppointment(id, payload)
          : this.api.adminUpdateAppointment(id, payload);
        return request$.pipe(
          map((res) =>
            AppointmentsActions.updateAppointmentSuccess({
              appointment: res.data.appointment,
              message: res.message ?? 'Appointment updated',
            }),
          ),
          catchError((err) =>
            of(
              AppointmentsActions.updateAppointmentFailure({
                error: err.error?.message ?? 'Failed to update appointment',
              }),
            ),
          ),
        );
      }),
    ),
  );

  cancelAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.cancelAppointment),
      exhaustMap(({ id, payload, patientMode }) => {
        const request$ = patientMode
          ? this.api.cancelMyAppointment(id, payload)
          : this.api.adminCancelAppointment(id, payload);
        return request$.pipe(
          map((res) =>
            AppointmentsActions.cancelAppointmentSuccess({
              appointment: res.data.appointment,
              message: res.message ?? 'Appointment cancelled',
            }),
          ),
          catchError((err) =>
            of(
              AppointmentsActions.cancelAppointmentFailure({
                error: err.error?.message ?? 'Failed to cancel appointment',
              }),
            ),
          ),
        );
      }),
    ),
  );

  rescheduleAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.rescheduleAppointment),
      exhaustMap(({ id, payload, patientMode }) => {
        const request$ = patientMode
          ? this.api.rescheduleMyAppointment(id, payload)
          : this.api.adminRescheduleAppointment(id, payload);
        return request$.pipe(
          map((res) =>
            AppointmentsActions.rescheduleAppointmentSuccess({
              appointment: res.data.appointment,
              message: res.message ?? 'Appointment rescheduled',
            }),
          ),
          catchError((err) =>
            of(
              AppointmentsActions.rescheduleAppointmentFailure({
                error: err.error?.message ?? 'Failed to reschedule appointment',
              }),
            ),
          ),
        );
      }),
    ),
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.updateStatus),
      exhaustMap(({ id, payload, doctorMode }) => {
        const request$ = doctorMode
          ? this.api.updateDoctorStatus(id, payload)
          : this.api.adminUpdateStatus(id, payload);
        return request$.pipe(
          map((res) =>
            AppointmentsActions.updateStatusSuccess({
              appointment: res.data.appointment,
              message: res.message ?? 'Status updated',
            }),
          ),
          catchError((err) =>
            of(
              AppointmentsActions.updateStatusFailure({
                error: err.error?.message ?? 'Failed to update status',
              }),
            ),
          ),
        );
      }),
    ),
  );
}
