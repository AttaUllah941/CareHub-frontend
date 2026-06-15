import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuditLog, AuditLogListQuery } from '../../../core/models/audit-log.model';
import { AuditLogActions } from '../store/audit-log.actions';
import {
  selectAuditLogs,
  selectAuditLogsError,
  selectAuditLogsLoading,
  selectAuditLogsPagination,
  selectSelectedAuditLog,
} from '../store/audit-log.selectors';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly store = inject(Store);

  readonly logs = this.store.selectSignal(selectAuditLogs);
  readonly pagination = this.store.selectSignal(selectAuditLogsPagination);
  readonly loading = this.store.selectSignal(selectAuditLogsLoading);
  readonly error = this.store.selectSignal(selectAuditLogsError);
  readonly selectedLog = this.store.selectSignal(selectSelectedAuditLog);

  loadLogs(query?: Partial<AuditLogListQuery>): void {
    this.store.dispatch(AuditLogActions.loadLogs({ query }));
  }

  selectLog(log: AuditLog | null): void {
    this.store.dispatch(AuditLogActions.selectLog({ log }));
  }

  clearError(): void {
    this.store.dispatch(AuditLogActions.clearError());
  }
}
