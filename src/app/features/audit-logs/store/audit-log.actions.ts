import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuditLog, AuditLogListQuery, DEFAULT_AUDIT_LOG_LIST_QUERY } from '../../../core/models/audit-log.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const AuditLogActions = createActionGroup({
  source: 'AuditLog',
  events: {
    'Load Logs': props<{ query?: Partial<AuditLogListQuery> }>(),
    'Load Logs Success': props<{ logs: AuditLog[]; pagination: PaginationMeta; query: AuditLogListQuery }>(),
    'Load Logs Failure': props<{ error: string }>(),
    'Select Log': props<{ log: AuditLog | null }>(),
    'Clear Error': emptyProps(),
  },
});

export { DEFAULT_AUDIT_LOG_LIST_QUERY };
