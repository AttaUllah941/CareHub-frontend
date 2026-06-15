import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_LANGUAGE_LIST_QUERY } from '../../../core/models/language.model';
import { LanguageApiService } from '../services/language-api.service';
import { LanguagesActions } from './languages.actions';
import { selectLanguagesQuery } from './languages.selectors';

@Injectable()
export class LanguagesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(LanguageApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  loadLanguages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguagesActions.loadLanguages),
      withLatestFrom(this.store.select(selectLanguagesQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_LANGUAGE_LIST_QUERY, ...current, ...query };
        return this.api.getLanguages(merged).pipe(
          map((res) =>
            LanguagesActions.loadLanguagesSuccess({
              languages: res.data.languages,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(LanguagesActions.loadLanguagesFailure({ error: err.error?.message ?? 'Failed to load languages' })),
          ),
        );
      }),
    ),
  );

  loadAllLanguages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguagesActions.loadAllLanguages),
      exhaustMap(() =>
        this.api.getAllLanguages().pipe(
          map((res) => LanguagesActions.loadAllLanguagesSuccess({ languages: res.data.languages })),
          catchError((err) =>
            of(LanguagesActions.loadAllLanguagesFailure({ error: err.error?.message ?? 'Failed to load languages' })),
          ),
        ),
      ),
    ),
  );

  loadLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguagesActions.loadLanguage),
      exhaustMap(({ id }) =>
        this.api.getLanguageById(id).pipe(
          map((res) => LanguagesActions.loadLanguageSuccess({ language: res.data.language })),
          catchError((err) =>
            of(LanguagesActions.loadLanguageFailure({ error: err.error?.message ?? 'Failed to load language' })),
          ),
        ),
      ),
    ),
  );

  createLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguagesActions.createLanguage),
      exhaustMap(({ payload }) =>
        this.api.createLanguage(payload).pipe(
          map((res) =>
            LanguagesActions.createLanguageSuccess({
              language: res.data.language,
              message: res.message ?? 'Language created',
            }),
          ),
          catchError((err) =>
            of(LanguagesActions.createLanguageFailure({ error: err.error?.message ?? 'Failed to create language' })),
          ),
        ),
      ),
    ),
  );

  createLanguageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LanguagesActions.createLanguageSuccess),
        tap(({ language }) => this.router.navigate(['/admin/languages', language.id])),
      ),
    { dispatch: false },
  );

  updateLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguagesActions.updateLanguage),
      exhaustMap(({ id, payload }) =>
        this.api.updateLanguage(id, payload).pipe(
          map((res) =>
            LanguagesActions.updateLanguageSuccess({
              language: res.data.language,
              message: res.message ?? 'Language updated',
            }),
          ),
          catchError((err) =>
            of(LanguagesActions.updateLanguageFailure({ error: err.error?.message ?? 'Failed to update language' })),
          ),
        ),
      ),
    ),
  );

  deleteLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguagesActions.deleteLanguage),
      exhaustMap(({ id }) =>
        this.api.deleteLanguage(id).pipe(
          map((res) =>
            LanguagesActions.deleteLanguageSuccess({ message: res.message ?? 'Language deactivated' }),
          ),
          catchError((err) =>
            of(LanguagesActions.deleteLanguageFailure({ error: err.error?.message ?? 'Failed to delete language' })),
          ),
        ),
      ),
    ),
  );

  deleteLanguageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LanguagesActions.deleteLanguageSuccess),
        tap(() => {
          this.router.navigate(['/admin/languages']);
          this.store.dispatch(LanguagesActions.loadLanguages({}));
        }),
      ),
    { dispatch: false },
  );
}
