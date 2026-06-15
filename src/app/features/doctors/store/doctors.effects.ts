import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_DOCTOR_LIST_QUERY, DEFAULT_DOCTOR_SEARCH_QUERY } from '../../../core/models/doctor.model';
import { DoctorApiService } from '../services/doctor-api.service';
import { DoctorsActions } from './doctors.actions';
import { selectDoctorsQuery, selectSearchQuery } from './doctors.selectors';

@Injectable()
export class DoctorsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(DoctorApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  loadDoctors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.loadDoctors),
      withLatestFrom(this.store.select(selectDoctorsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_DOCTOR_LIST_QUERY, ...current, ...query };
        return this.api.getDoctors(merged).pipe(
          map((res) =>
            DoctorsActions.loadDoctorsSuccess({
              doctors: res.data.doctors,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(DoctorsActions.loadDoctorsFailure({ error: err.error?.message ?? 'Failed to load doctors' })),
          ),
        );
      }),
    ),
  );

  searchDoctors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.searchDoctors),
      withLatestFrom(this.store.select(selectSearchQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_DOCTOR_SEARCH_QUERY, ...current, ...query };
        return this.api.searchDoctors(merged).pipe(
          map((res) =>
            DoctorsActions.searchDoctorsSuccess({
              doctors: res.data.doctors,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(DoctorsActions.searchDoctorsFailure({ error: err.error?.message ?? 'Failed to search doctors' })),
          ),
        );
      }),
    ),
  );

  loadDoctor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.loadDoctor),
      exhaustMap(({ id }) =>
        this.api.getDoctorById(id).pipe(
          map((res) => DoctorsActions.loadDoctorSuccess({ doctor: res.data.doctor })),
          catchError((err) =>
            of(DoctorsActions.loadDoctorFailure({ error: err.error?.message ?? 'Failed to load doctor' })),
          ),
        ),
      ),
    ),
  );

  loadMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.loadMyProfile),
      exhaustMap(() =>
        this.api.getMyProfile().pipe(
          map((res) => DoctorsActions.loadMyProfileSuccess({ doctor: res.data.doctor })),
          catchError((err) =>
            of(DoctorsActions.loadMyProfileFailure({ error: err.error?.message ?? 'Profile not found' })),
          ),
        ),
      ),
    ),
  );

  createDoctor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.createDoctor),
      exhaustMap(({ payload }) =>
        this.api.createDoctor(payload).pipe(
          map((res) =>
            DoctorsActions.createDoctorSuccess({
              doctor: res.data.doctor,
              message: res.message ?? 'Doctor created',
            }),
          ),
          catchError((err) =>
            of(DoctorsActions.createDoctorFailure({ error: err.error?.message ?? 'Failed to create doctor' })),
          ),
        ),
      ),
    ),
  );

  createDoctorSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DoctorsActions.createDoctorSuccess),
        tap(({ doctor }) => this.router.navigate(['/admin/doctors', doctor.id])),
      ),
    { dispatch: false },
  );

  createMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.createMyProfile),
      exhaustMap(({ payload }) =>
        this.api.createMyProfile(payload).pipe(
          map((res) =>
            DoctorsActions.createMyProfileSuccess({
              doctor: res.data.doctor,
              message: res.message ?? 'Profile created',
            }),
          ),
          catchError((err) =>
            of(DoctorsActions.createMyProfileFailure({ error: err.error?.message ?? 'Failed to create profile' })),
          ),
        ),
      ),
    ),
  );

  updateDoctor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.updateDoctor),
      exhaustMap(({ id, payload }) =>
        this.api.updateDoctor(id, payload).pipe(
          map((res) =>
            DoctorsActions.updateDoctorSuccess({
              doctor: res.data.doctor,
              message: res.message ?? 'Doctor updated',
            }),
          ),
          catchError((err) =>
            of(DoctorsActions.updateDoctorFailure({ error: err.error?.message ?? 'Failed to update doctor' })),
          ),
        ),
      ),
    ),
  );

  updateMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.updateMyProfile),
      exhaustMap(({ payload }) =>
        this.api.updateMyProfile(payload).pipe(
          map((res) =>
            DoctorsActions.updateMyProfileSuccess({
              doctor: res.data.doctor,
              message: res.message ?? 'Profile updated',
            }),
          ),
          catchError((err) =>
            of(DoctorsActions.updateMyProfileFailure({ error: err.error?.message ?? 'Failed to update profile' })),
          ),
        ),
      ),
    ),
  );

  verifyDoctor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.verifyDoctor),
      exhaustMap(({ id, payload }) =>
        this.api.verifyDoctor(id, payload).pipe(
          map((res) =>
            DoctorsActions.verifyDoctorSuccess({
              doctor: res.data.doctor,
              message: res.message ?? 'Verification updated',
            }),
          ),
          catchError((err) =>
            of(DoctorsActions.verifyDoctorFailure({ error: err.error?.message ?? 'Failed to verify doctor' })),
          ),
        ),
      ),
    ),
  );

  deleteDoctor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DoctorsActions.deleteDoctor),
      exhaustMap(({ id }) =>
        this.api.deleteDoctor(id).pipe(
          map((res) => DoctorsActions.deleteDoctorSuccess({ message: res.message ?? 'Doctor deactivated' })),
          catchError((err) =>
            of(DoctorsActions.deleteDoctorFailure({ error: err.error?.message ?? 'Failed to delete doctor' })),
          ),
        ),
      ),
    ),
  );

  deleteDoctorSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DoctorsActions.deleteDoctorSuccess),
        tap(() => {
          this.router.navigate(['/admin/doctors']);
          this.store.dispatch(DoctorsActions.loadDoctors({}));
        }),
      ),
    { dispatch: false },
  );
}
