import { createReducer, on } from '@ngrx/store';
import { AuditLogActions } from './audit-log.actions';
import { initialState } from './audit-log.state';

export const auditLogReducer = createReducer(
  initialState,
  on(AuditLogActions.loadLogs, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...state.query, ...query },
  })),
  on(AuditLogActions.loadLogsSuccess, (state, { logs, pagination, query }) => ({
    ...state,
    loading: false,
    logs,
    pagination,
    query,
  })),
  on(AuditLogActions.loadLogsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(AuditLogActions.selectLog, (state, { log }) => ({ ...state, selectedLog: log })),
  on(AuditLogActions.clearError, (state) => ({ ...state, error: null })),
);
