import { PaginationMeta } from './appointment.model';

export type AuditAction =
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT';

export interface AuditActor {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export interface AuditLog {
  id: string;
  actorUserId?: string;
  actorEmail?: string;
  actorRole?: string;
  actor?: AuditActor;
  action: AuditAction;
  module: string;
  entityType?: string;
  entityId?: string;
  entityLabel?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  createdAt: string;
}

export interface AuditLogListQuery {
  page: number;
  limit: number;
  action?: AuditAction;
  module?: string;
  entityType?: string;
  actorUserId?: string;
  success?: boolean;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortOrder?: 'asc' | 'desc';
}

export const DEFAULT_AUDIT_LOG_LIST_QUERY: AuditLogListQuery = {
  page: 1,
  limit: 20,
  sortOrder: 'desc',
};

export const AUDIT_ACTIONS: AuditAction[] = [
  'LOGIN',
  'LOGIN_FAILED',
  'LOGOUT',
  'CREATE',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'REJECT',
];

export const AUDIT_MODULES = ['auth', 'users', 'doctors', 'patients', 'pharmacy', 'lab'];
