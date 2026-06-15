import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_CLINIC_LIST_QUERY } from '../../../core/models/clinic.model';
import { ClinicApiService } from '../services/clinic-api.service';
import { ClinicsActions } from './clinics.actions';
import { selectClinicsQuery } from './clinics.selectors';

@Injectable()
export class ClinicsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ClinicApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  loadClinics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.loadClinics),
      withLatestFrom(this.store.select(selectClinicsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_CLINIC_LIST_QUERY, ...current, ...query };
        return this.api.getClinics(merged).pipe(
          map((res) =>
            ClinicsActions.loadClinicsSuccess({
              clinics: res.data.clinics,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(ClinicsActions.loadClinicsFailure({ error: err.error?.message ?? 'Failed to load clinics' })),
          ),
        );
      }),
    ),
  );

  loadAllClinics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.loadAllClinics),
      exhaustMap(() =>
        this.api.getAllClinics().pipe(
          map((res) => ClinicsActions.loadAllClinicsSuccess({ clinics: res.data.clinics })),
          catchError((err) =>
            of(ClinicsActions.loadAllClinicsFailure({ error: err.error?.message ?? 'Failed to load clinics' })),
          ),
        ),
      ),
    ),
  );

  loadClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.loadClinic),
      exhaustMap(({ id }) =>
        this.api.getClinicById(id).pipe(
          map((res) => ClinicsActions.loadClinicSuccess({ clinic: res.data.clinic })),
          catchError((err) =>
            of(ClinicsActions.loadClinicFailure({ error: err.error?.message ?? 'Failed to load clinic' })),
          ),
        ),
      ),
    ),
  );

  loadMyClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.loadMyClinic),
      exhaustMap(() =>
        this.api.getMyClinic().pipe(
          map((res) => ClinicsActions.loadMyClinicSuccess({ clinic: res.data.clinic })),
          catchError((err) =>
            of(ClinicsActions.loadMyClinicFailure({ error: err.error?.message ?? 'Failed to load clinic' })),
          ),
        ),
      ),
    ),
  );

  createClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.createClinic),
      exhaustMap(({ payload }) =>
        this.api.createClinic(payload).pipe(
          map((res) =>
            ClinicsActions.createClinicSuccess({
              clinic: res.data.clinic,
              message: res.message ?? 'Clinic created',
            }),
          ),
          catchError((err) =>
            of(ClinicsActions.createClinicFailure({ error: err.error?.message ?? 'Failed to create clinic' })),
          ),
        ),
      ),
    ),
  );

  createClinicSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ClinicsActions.createClinicSuccess),
        tap(({ clinic }) => this.router.navigate(['/admin/clinics', clinic.id])),
      ),
    { dispatch: false },
  );

  updateClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.updateClinic),
      exhaustMap(({ id, payload }) =>
        this.api.updateClinic(id, payload).pipe(
          map((res) =>
            ClinicsActions.updateClinicSuccess({
              clinic: res.data.clinic,
              message: res.message ?? 'Clinic updated',
            }),
          ),
          catchError((err) =>
            of(ClinicsActions.updateClinicFailure({ error: err.error?.message ?? 'Failed to update clinic' })),
          ),
        ),
      ),
    ),
  );

  updateMyClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.updateMyClinic),
      exhaustMap(({ payload }) =>
        this.api.updateMyClinic(payload).pipe(
          map((res) =>
            ClinicsActions.updateMyClinicSuccess({
              clinic: res.data.clinic,
              message: res.message ?? 'Clinic updated',
            }),
          ),
          catchError((err) =>
            of(ClinicsActions.updateMyClinicFailure({ error: err.error?.message ?? 'Failed to update clinic' })),
          ),
        ),
      ),
    ),
  );

  assignDoctors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.assignDoctors),
      exhaustMap(({ id, doctorProfileIds }) =>
        this.api.assignDoctors(id, doctorProfileIds).pipe(
          map((res) =>
            ClinicsActions.assignDoctorsSuccess({
              clinic: res.data.clinic,
              message: res.message ?? 'Doctors assigned',
            }),
          ),
          catchError((err) =>
            of(ClinicsActions.assignDoctorsFailure({ error: err.error?.message ?? 'Failed to assign doctors' })),
          ),
        ),
      ),
    ),
  );

  deleteClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicsActions.deleteClinic),
      exhaustMap(({ id }) =>
        this.api.deleteClinic(id).pipe(
          map((res) => ClinicsActions.deleteClinicSuccess({ message: res.message ?? 'Clinic deactivated' })),
          catchError((err) =>
            of(ClinicsActions.deleteClinicFailure({ error: err.error?.message ?? 'Failed to delete clinic' })),
          ),
        ),
      ),
    ),
  );

  deleteClinicSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ClinicsActions.deleteClinicSuccess),
        tap(() => {
          this.router.navigate(['/admin/clinics']);
          this.store.dispatch(ClinicsActions.loadClinics({}));
        }),
      ),
    { dispatch: false },
  );
}
