import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { DashboardApiService } from '../services/dashboard-api.service';
import { DashboardActions } from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(DashboardApiService);

  loadAdminStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadAdminStats),
      exhaustMap(() =>
        this.api.getAdminStats().pipe(
          map((res) => DashboardActions.loadAdminStatsSuccess({ stats: res.data.stats })),
          catchError((err) =>
            of(
              DashboardActions.loadAdminStatsFailure({
                error: err.error?.message ?? 'Failed to load dashboard',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
