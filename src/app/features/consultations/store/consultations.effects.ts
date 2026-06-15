import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { DEFAULT_CONSULTATION_LIST_QUERY } from '../../../core/models/consultation.model';
import { ConsultationApiService } from '../services/consultation-api.service';
import { ConsultationsActions } from './consultations.actions';
import { selectConsultationsQuery } from './consultations.selectors';

@Injectable()
export class ConsultationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ConsultationApiService);
  private readonly store = inject(Store);

  loadConsultations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultationsActions.loadConsultations),
      withLatestFrom(this.store.select(selectConsultationsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_CONSULTATION_LIST_QUERY, ...current, ...query };
        return this.api.getConsultations(merged).pipe(
          map((res) =>
            ConsultationsActions.loadConsultationsSuccess({
              consultations: res.data.consultations,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(
              ConsultationsActions.loadConsultationsFailure({
                error: err.error?.message ?? 'Failed to load consultations',
              }),
            ),
          ),
        );
      }),
    ),
  );

  loadMyConsultations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultationsActions.loadMyConsultations),
      exhaustMap(() =>
        this.api.getMyConsultations().pipe(
          map((res) =>
            ConsultationsActions.loadMyConsultationsSuccess({ consultations: res.data.consultations }),
          ),
          catchError((err) =>
            of(
              ConsultationsActions.loadMyConsultationsFailure({
                error: err.error?.message ?? 'Failed to load consultations',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadDoctorConsultations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultationsActions.loadDoctorConsultations),
      exhaustMap(() =>
        this.api.getDoctorConsultations().pipe(
          map((res) =>
            ConsultationsActions.loadDoctorConsultationsSuccess({
              consultations: res.data.consultations,
            }),
          ),
          catchError((err) =>
            of(
              ConsultationsActions.loadDoctorConsultationsFailure({
                error: err.error?.message ?? 'Failed to load consultations',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadByAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultationsActions.loadByAppointment),
      exhaustMap(({ appointmentId }) =>
        this.api.getByAppointmentId(appointmentId).pipe(
          map((res) => ConsultationsActions.loadByAppointmentSuccess({ consultation: res.data.consultation })),
          catchError((err) =>
            of(
              ConsultationsActions.loadByAppointmentFailure({
                error: err.error?.message ?? 'Consultation not found',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadConsultationById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultationsActions.loadConsultationById),
      exhaustMap(({ id }) =>
        this.api.getConsultationById(id).pipe(
          map((res) =>
            ConsultationsActions.loadConsultationByIdSuccess({ consultation: res.data.consultation }),
          ),
          catchError((err) =>
            of(
              ConsultationsActions.loadConsultationByIdFailure({
                error: err.error?.message ?? 'Failed to load consultation',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createConsultation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultationsActions.createConsultation),
      exhaustMap(({ appointmentId, payload }) =>
        this.api.createForAppointment(appointmentId, payload).pipe(
          map((res) =>
            ConsultationsActions.createConsultationSuccess({
              consultation: res.data.consultation,
              message: res.message ?? 'Consultation recorded',
            }),
          ),
          catchError((err) =>
            of(
              ConsultationsActions.createConsultationFailure({
                error: err.error?.message ?? 'Failed to record consultation',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateConsultation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultationsActions.updateConsultation),
      exhaustMap(({ id, payload }) =>
        this.api.updateConsultation(id, payload).pipe(
          map((res) =>
            ConsultationsActions.updateConsultationSuccess({
              consultation: res.data.consultation,
              message: res.message ?? 'Consultation updated',
            }),
          ),
          catchError((err) =>
            of(
              ConsultationsActions.updateConsultationFailure({
                error: err.error?.message ?? 'Failed to update consultation',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteConsultation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsultationsActions.deleteConsultation),
      exhaustMap(({ id }) =>
        this.api.deleteConsultation(id).pipe(
          map((res) =>
            ConsultationsActions.deleteConsultationSuccess({
              message: res.message ?? 'Consultation removed',
              id,
            }),
          ),
          catchError((err) =>
            of(
              ConsultationsActions.deleteConsultationFailure({
                error: err.error?.message ?? 'Failed to delete consultation',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
