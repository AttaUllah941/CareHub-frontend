import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { ReportQuery } from '../../../core/models/report.model';
import { ReportApiService } from '../services/report-api.service';
import { ReportsActions } from './reports.actions';
import { selectActiveReportType, selectReportQuery } from './reports.selectors';

@Injectable()
export class ReportsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ReportApiService);
  private readonly store = inject(Store);

  loadReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsActions.loadReport),
      withLatestFrom(this.store.select(selectActiveReportType), this.store.select(selectReportQuery)),
      exhaustMap(([{ reportType, query }, activeType, currentQuery]) => {
        const resolvedType = reportType ?? activeType;
        const merged: ReportQuery = { ...currentQuery, ...(query ?? {}) };
        return this.api.getReport(resolvedType, merged).pipe(
          map((res) => ReportsActions.loadReportSuccess({ report: res.data.report })),
          catchError((err) =>
            of(ReportsActions.loadReportFailure({ error: err.error?.message ?? 'Failed to load report' })),
          ),
        );
      }),
    ),
  );

  exportReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsActions.exportReport),
      withLatestFrom(this.store.select(selectActiveReportType), this.store.select(selectReportQuery)),
      exhaustMap(([{ reportType, format, query }, activeType, currentQuery]) => {
        const resolvedType = reportType ?? activeType;
        const merged: ReportQuery = { ...currentQuery, ...(query ?? {}) };
        const ext = format === 'pdf' ? 'pdf' : 'xlsx';
        return this.api.exportReport(resolvedType, format, merged).pipe(
          tap((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `carehub-${resolvedType.toLowerCase()}-report.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
          }),
          map(() =>
            ReportsActions.exportReportSuccess({
              message: `${format.toUpperCase()} exported successfully`,
            }),
          ),
          catchError(() =>
            of(ReportsActions.exportReportFailure({ error: 'Failed to export report' })),
          ),
        );
      }),
    ),
  );
}
