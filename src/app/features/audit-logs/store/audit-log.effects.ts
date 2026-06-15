import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { AuditLogApiService } from '../services/audit-log-api.service';
import { AuditLogActions, DEFAULT_AUDIT_LOG_LIST_QUERY } from './audit-log.actions';
import { selectAuditLogsQuery } from './audit-log.selectors';

@Injectable()
export class AuditLogEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(AuditLogApiService);
  private readonly store = inject(Store);

  loadLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditLogActions.loadLogs),
      withLatestFrom(this.store.select(selectAuditLogsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_AUDIT_LOG_LIST_QUERY, ...current, ...query };
        return this.api.getLogs(merged).pipe(
          map((res) =>
            AuditLogActions.loadLogsSuccess({
              logs: res.data.logs,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(AuditLogActions.loadLogsFailure({ error: err.error?.message ?? 'Failed to load audit logs' })),
          ),
        );
      }),
    ),
  );
}
