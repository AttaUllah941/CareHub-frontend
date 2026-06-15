import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { SettingsApiService } from '../services/settings-api.service';
import { SettingsActions } from './settings.actions';

@Injectable()
export class SettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(SettingsApiService);

  loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadSettings),
      exhaustMap(() =>
        this.api.getSettings().pipe(
          map((res) => SettingsActions.loadSettingsSuccess({ settings: res.data.settings })),
          catchError((err) =>
            of(SettingsActions.loadSettingsFailure({ error: err.error?.message ?? 'Failed to load settings' })),
          ),
        ),
      ),
    ),
  );

  saveGeneral$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.saveGeneral),
      exhaustMap(({ payload }) =>
        this.api.updateGeneral(payload).pipe(
          map((res) => SettingsActions.saveSectionSuccess({ settings: res.data.settings, message: res.message ?? 'Settings saved' })),
          catchError((err) =>
            of(SettingsActions.saveSectionFailure({ error: err.error?.message ?? 'Failed to save general settings' })),
          ),
        ),
      ),
    ),
  );

  saveEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.saveEmail),
      exhaustMap(({ payload }) =>
        this.api.updateEmail(payload).pipe(
          map((res) => SettingsActions.saveSectionSuccess({ settings: res.data.settings, message: res.message ?? 'Settings saved' })),
          catchError((err) =>
            of(SettingsActions.saveSectionFailure({ error: err.error?.message ?? 'Failed to save email settings' })),
          ),
        ),
      ),
    ),
  );

  saveSms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.saveSms),
      exhaustMap(({ payload }) =>
        this.api.updateSms(payload).pipe(
          map((res) => SettingsActions.saveSectionSuccess({ settings: res.data.settings, message: res.message ?? 'Settings saved' })),
          catchError((err) =>
            of(SettingsActions.saveSectionFailure({ error: err.error?.message ?? 'Failed to save SMS settings' })),
          ),
        ),
      ),
    ),
  );

  savePayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.savePayment),
      exhaustMap(({ payload }) =>
        this.api.updatePayment(payload).pipe(
          map((res) => SettingsActions.saveSectionSuccess({ settings: res.data.settings, message: res.message ?? 'Settings saved' })),
          catchError((err) =>
            of(SettingsActions.saveSectionFailure({ error: err.error?.message ?? 'Failed to save payment settings' })),
          ),
        ),
      ),
    ),
  );

  saveFeatureFlags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.saveFeatureFlags),
      exhaustMap(({ payload }) =>
        this.api.updateFeatureFlags(payload).pipe(
          map((res) => SettingsActions.saveSectionSuccess({ settings: res.data.settings, message: res.message ?? 'Settings saved' })),
          catchError((err) =>
            of(SettingsActions.saveSectionFailure({ error: err.error?.message ?? 'Failed to save feature flags' })),
          ),
        ),
      ),
    ),
  );
}
