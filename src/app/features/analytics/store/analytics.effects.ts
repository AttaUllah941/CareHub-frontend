import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { AnalyticsApiService } from '../services/analytics-api.service';
import { AnalyticsActions, DEFAULT_ANALYTICS_QUERY } from './analytics.actions';
import { selectAnalyticsQuery } from './analytics.selectors';

@Injectable()
export class AnalyticsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(AnalyticsApiService);
  private readonly store = inject(Store);

  loadOverview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticsActions.loadOverview),
      withLatestFrom(this.store.select(selectAnalyticsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_ANALYTICS_QUERY, ...current, ...query };
        return this.api.getOverview(merged).pipe(
          map((res) => AnalyticsActions.loadOverviewSuccess({ overview: res.data, query: merged })),
          catchError((err) =>
            of(AnalyticsActions.loadOverviewFailure({ error: err.error?.message ?? 'Failed to load analytics' })),
          ),
        );
      }),
    ),
  );
}
