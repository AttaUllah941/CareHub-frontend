import { Permission, Role, RoleListQuery, PermissionListQuery, DEFAULT_ROLE_LIST_QUERY, DEFAULT_PERMISSION_LIST_QUERY } from '../../../core/models/role.model';

export interface RolesState {
  roles: Role[];
  permissions: Permission[];
  allPermissions: Permission[];
  selectedRole: Role | null;
  selectedPermission: Permission | null;
  rolesPagination: { page: number; limit: number; total: number; totalPages: number };
  permissionsPagination: { page: number; limit: number; total: number; totalPages: number };
  rolesQuery: RoleListQuery;
  permissionsQuery: PermissionListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const ROLES_FEATURE_KEY = 'roles';

export const initialRolesState: RolesState = {
  roles: [],
  permissions: [],
  allPermissions: [],
  selectedRole: null,
  selectedPermission: null,
  rolesPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  permissionsPagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  rolesQuery: { ...DEFAULT_ROLE_LIST_QUERY },
  permissionsQuery: { ...DEFAULT_PERMISSION_LIST_QUERY },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
