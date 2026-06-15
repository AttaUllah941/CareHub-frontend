import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_MEDICAL_SPECIALTY_LIST_QUERY } from '../../../core/models/medical-specialty.model';
import { MedicalSpecialtyApiService } from '../services/medical-specialty-api.service';
import { MedicalSpecialtiesActions } from './medical-specialties.actions';
import { selectSpecialtiesQuery } from './medical-specialties.selectors';

@Injectable()
export class MedicalSpecialtiesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(MedicalSpecialtyApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  loadSpecialties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalSpecialtiesActions.loadSpecialties),
      withLatestFrom(this.store.select(selectSpecialtiesQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_MEDICAL_SPECIALTY_LIST_QUERY, ...current, ...query };
        return this.api.getSpecialties(merged).pipe(
          map((res) =>
            MedicalSpecialtiesActions.loadSpecialtiesSuccess({
              specialties: res.data.specialties,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(
              MedicalSpecialtiesActions.loadSpecialtiesFailure({
                error: err.error?.message ?? 'Failed to load medical specialties',
              }),
            ),
          ),
        );
      }),
    ),
  );

  loadAllSpecialties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalSpecialtiesActions.loadAllSpecialties),
      exhaustMap(() =>
        this.api.getAllSpecialties().pipe(
          map((res) =>
            MedicalSpecialtiesActions.loadAllSpecialtiesSuccess({ specialties: res.data.specialties }),
          ),
          catchError((err) =>
            of(
              MedicalSpecialtiesActions.loadAllSpecialtiesFailure({
                error: err.error?.message ?? 'Failed to load medical specialties',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadSpecialty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalSpecialtiesActions.loadSpecialty),
      exhaustMap(({ id }) =>
        this.api.getSpecialtyById(id).pipe(
          map((res) => MedicalSpecialtiesActions.loadSpecialtySuccess({ specialty: res.data.specialty })),
          catchError((err) =>
            of(
              MedicalSpecialtiesActions.loadSpecialtyFailure({
                error: err.error?.message ?? 'Failed to load medical specialty',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createSpecialty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalSpecialtiesActions.createSpecialty),
      exhaustMap(({ payload }) =>
        this.api.createSpecialty(payload).pipe(
          map((res) =>
            MedicalSpecialtiesActions.createSpecialtySuccess({
              specialty: res.data.specialty,
              message: res.message ?? 'Medical specialty created',
            }),
          ),
          catchError((err) =>
            of(
              MedicalSpecialtiesActions.createSpecialtyFailure({
                error: err.error?.message ?? 'Failed to create medical specialty',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createSpecialtySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MedicalSpecialtiesActions.createSpecialtySuccess),
        tap(({ specialty }) => this.router.navigate(['/admin/medical-specialties', specialty.id])),
      ),
    { dispatch: false },
  );

  updateSpecialty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalSpecialtiesActions.updateSpecialty),
      exhaustMap(({ id, payload }) =>
        this.api.updateSpecialty(id, payload).pipe(
          map((res) =>
            MedicalSpecialtiesActions.updateSpecialtySuccess({
              specialty: res.data.specialty,
              message: res.message ?? 'Medical specialty updated',
            }),
          ),
          catchError((err) =>
            of(
              MedicalSpecialtiesActions.updateSpecialtyFailure({
                error: err.error?.message ?? 'Failed to update medical specialty',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteSpecialty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalSpecialtiesActions.deleteSpecialty),
      exhaustMap(({ id }) =>
        this.api.deleteSpecialty(id).pipe(
          map((res) =>
            MedicalSpecialtiesActions.deleteSpecialtySuccess({
              message: res.message ?? 'Medical specialty deactivated',
            }),
          ),
          catchError((err) =>
            of(
              MedicalSpecialtiesActions.deleteSpecialtyFailure({
                error: err.error?.message ?? 'Failed to delete medical specialty',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteSpecialtySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MedicalSpecialtiesActions.deleteSpecialtySuccess),
        tap(() => {
          this.router.navigate(['/admin/medical-specialties']);
          this.store.dispatch(MedicalSpecialtiesActions.loadSpecialties({}));
        }),
      ),
    { dispatch: false },
  );
}
