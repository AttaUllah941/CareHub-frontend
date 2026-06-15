import { AuditLog, AuditLogListQuery } from '../../../core/models/audit-log.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import { DEFAULT_AUDIT_LOG_LIST_QUERY } from './audit-log.actions';

export const AUDIT_LOG_FEATURE_KEY = 'auditLogs';

export interface AuditLogState {
  logs: AuditLog[];
  pagination: PaginationMeta | null;
  query: AuditLogListQuery;
  selectedLog: AuditLog | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuditLogState = {
  logs: [],
  pagination: null,
  query: DEFAULT_AUDIT_LOG_LIST_QUERY,
  selectedLog: null,
  loading: false,
  error: null,
};
