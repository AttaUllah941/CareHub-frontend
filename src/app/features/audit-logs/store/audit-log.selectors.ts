import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUDIT_LOG_FEATURE_KEY, AuditLogState } from './audit-log.state';

export const selectAuditLogState = createFeatureSelector<AuditLogState>(AUDIT_LOG_FEATURE_KEY);

export const selectAuditLogs = createSelector(selectAuditLogState, (s) => s.logs);
export const selectAuditLogsPagination = createSelector(selectAuditLogState, (s) => s.pagination);
export const selectAuditLogsQuery = createSelector(selectAuditLogState, (s) => s.query);
export const selectSelectedAuditLog = createSelector(selectAuditLogState, (s) => s.selectedLog);
export const selectAuditLogsLoading = createSelector(selectAuditLogState, (s) => s.loading);
export const selectAuditLogsError = createSelector(selectAuditLogState, (s) => s.error);
