import { createReducer, on } from '@ngrx/store';
import { DEFAULT_PERMISSION_LIST_QUERY, DEFAULT_ROLE_LIST_QUERY } from '../../../core/models/role.model';
import { RolesActions } from './roles.actions';
import { initialRolesState } from './roles.state';

const setSaving = (state: typeof initialRolesState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialRolesState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const rolesReducer = createReducer(
  initialRolesState,

  on(RolesActions.loadRoles, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    rolesQuery: { ...DEFAULT_ROLE_LIST_QUERY, ...state.rolesQuery, ...query },
  })),
  on(RolesActions.loadRolesSuccess, (state, { roles, pagination, query }) => ({
    ...state,
    roles,
    rolesPagination: pagination,
    rolesQuery: query,
    loading: false,
  })),
  on(RolesActions.loadRolesFailure, setFailure),

  on(RolesActions.loadRole, (state) => ({ ...state, loading: true, error: null, selectedRole: null })),
  on(RolesActions.loadRoleSuccess, (state, { role }) => ({ ...state, selectedRole: role, loading: false })),
  on(RolesActions.loadRoleFailure, setFailure),

  on(
    RolesActions.createRole,
    RolesActions.updateRole,
    RolesActions.deleteRole,
    RolesActions.assignPermissions,
    RolesActions.assignRoleToUser,
    RolesActions.createPermission,
    RolesActions.updatePermission,
    RolesActions.deletePermission,
    setSaving,
  ),

  on(RolesActions.createRoleSuccess, RolesActions.updateRoleSuccess, RolesActions.assignPermissionsSuccess, (state, { role, message }) => ({
    ...state,
    selectedRole: role,
    saving: false,
    successMessage: message,
    roles: state.roles.some((r) => r.id === role.id)
      ? state.roles.map((r) => (r.id === role.id ? role : r))
      : state.roles,
  })),

  on(RolesActions.createPermissionSuccess, RolesActions.updatePermissionSuccess, (state, { permission, message }) => ({
    ...state,
    selectedPermission: permission,
    saving: false,
    successMessage: message,
  })),

  on(RolesActions.deleteRoleSuccess, RolesActions.deletePermissionSuccess, RolesActions.assignRoleToUserSuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
  })),

  on(
    RolesActions.createRoleFailure,
    RolesActions.updateRoleFailure,
    RolesActions.deleteRoleFailure,
    RolesActions.assignPermissionsFailure,
    RolesActions.assignRoleToUserFailure,
    RolesActions.createPermissionFailure,
    RolesActions.updatePermissionFailure,
    RolesActions.deletePermissionFailure,
    setFailure,
  ),

  on(RolesActions.loadPermissions, (state, { query }) => ({
    ...state,
    loading: true,
    permissionsQuery: { ...DEFAULT_PERMISSION_LIST_QUERY, ...state.permissionsQuery, ...query },
  })),
  on(RolesActions.loadPermissionsSuccess, (state, { permissions, pagination, query }) => ({
    ...state,
    permissions,
    permissionsPagination: pagination,
    permissionsQuery: query,
    loading: false,
  })),
  on(RolesActions.loadPermissionsFailure, setFailure),

  on(RolesActions.loadAllPermissions, (state) => ({ ...state, loading: true })),
  on(RolesActions.loadAllPermissionsSuccess, (state, { permissions }) => ({
    ...state,
    allPermissions: permissions,
    loading: false,
  })),
  on(RolesActions.loadAllPermissionsFailure, setFailure),

  on(RolesActions.loadPermission, (state) => ({ ...state, loading: true, selectedPermission: null })),
  on(RolesActions.loadPermissionSuccess, (state, { permission }) => ({
    ...state,
    selectedPermission: permission,
    loading: false,
  })),
  on(RolesActions.loadPermissionFailure, setFailure),

  on(RolesActions.clearError, (state) => ({ ...state, error: null })),
  on(RolesActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
