import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_PATIENT_LIST_QUERY } from '../../../core/models/patient.model';
import { PatientApiService } from '../services/patient-api.service';
import { PatientsActions } from './patients.actions';
import { selectPatientsQuery } from './patients.selectors';

@Injectable()
export class PatientsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(PatientApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  loadPatients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.loadPatients),
      withLatestFrom(this.store.select(selectPatientsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_PATIENT_LIST_QUERY, ...current, ...query };
        return this.api.getPatients(merged).pipe(
          map((res) =>
            PatientsActions.loadPatientsSuccess({
              patients: res.data.patients,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(PatientsActions.loadPatientsFailure({ error: err.error?.message ?? 'Failed to load patients' })),
          ),
        );
      }),
    ),
  );

  loadPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.loadPatient),
      exhaustMap(({ id }) =>
        this.api.getPatientById(id).pipe(
          map((res) => PatientsActions.loadPatientSuccess({ patient: res.data.patient })),
          catchError((err) =>
            of(PatientsActions.loadPatientFailure({ error: err.error?.message ?? 'Failed to load patient' })),
          ),
        ),
      ),
    ),
  );

  loadMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.loadMyProfile),
      exhaustMap(() =>
        this.api.getMyProfile().pipe(
          map((res) => PatientsActions.loadMyProfileSuccess({ patient: res.data.patient })),
          catchError((err) =>
            of(PatientsActions.loadMyProfileFailure({ error: err.error?.message ?? 'Profile not found' })),
          ),
        ),
      ),
    ),
  );

  createPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.createPatient),
      exhaustMap(({ payload }) =>
        this.api.createPatient(payload).pipe(
          map((res) =>
            PatientsActions.createPatientSuccess({
              patient: res.data.patient,
              message: res.message ?? 'Patient created',
            }),
          ),
          catchError((err) =>
            of(PatientsActions.createPatientFailure({ error: err.error?.message ?? 'Failed to create patient' })),
          ),
        ),
      ),
    ),
  );

  createPatientSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PatientsActions.createPatientSuccess),
        tap(({ patient }) => this.router.navigate(['/admin/patients', patient.id])),
      ),
    { dispatch: false },
  );

  createMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.createMyProfile),
      exhaustMap(({ payload }) =>
        this.api.createMyProfile(payload).pipe(
          map((res) =>
            PatientsActions.createMyProfileSuccess({
              patient: res.data.patient,
              message: res.message ?? 'Profile created',
            }),
          ),
          catchError((err) =>
            of(PatientsActions.createMyProfileFailure({ error: err.error?.message ?? 'Failed to create profile' })),
          ),
        ),
      ),
    ),
  );

  updatePatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.updatePatient),
      exhaustMap(({ id, payload }) =>
        this.api.updatePatient(id, payload).pipe(
          map((res) =>
            PatientsActions.updatePatientSuccess({
              patient: res.data.patient,
              message: res.message ?? 'Patient updated',
            }),
          ),
          catchError((err) =>
            of(PatientsActions.updatePatientFailure({ error: err.error?.message ?? 'Failed to update patient' })),
          ),
        ),
      ),
    ),
  );

  updateMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.updateMyProfile),
      exhaustMap(({ payload }) =>
        this.api.updateMyProfile(payload).pipe(
          map((res) =>
            PatientsActions.updateMyProfileSuccess({
              patient: res.data.patient,
              message: res.message ?? 'Profile updated',
            }),
          ),
          catchError((err) =>
            of(PatientsActions.updateMyProfileFailure({ error: err.error?.message ?? 'Failed to update profile' })),
          ),
        ),
      ),
    ),
  );

  deletePatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.deletePatient),
      exhaustMap(({ id }) =>
        this.api.deletePatient(id).pipe(
          map((res) => PatientsActions.deletePatientSuccess({ message: res.message ?? 'Patient deactivated' })),
          catchError((err) =>
            of(PatientsActions.deletePatientFailure({ error: err.error?.message ?? 'Failed to delete patient' })),
          ),
        ),
      ),
    ),
  );

  deletePatientSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PatientsActions.deletePatientSuccess),
        tap(() => {
          this.router.navigate(['/admin/patients']);
          this.store.dispatch(PatientsActions.loadPatients({}));
        }),
      ),
    { dispatch: false },
  );
}
