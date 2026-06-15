import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ROLES_FEATURE_KEY, RolesState } from './roles.state';

export const selectRolesState = createFeatureSelector<RolesState>(ROLES_FEATURE_KEY);

export const selectRoles = createSelector(selectRolesState, (s) => s.roles);
export const selectSelectedRole = createSelector(selectRolesState, (s) => s.selectedRole);
export const selectRolesPagination = createSelector(selectRolesState, (s) => s.rolesPagination);
export const selectRolesQuery = createSelector(selectRolesState, (s) => s.rolesQuery);

export const selectPermissions = createSelector(selectRolesState, (s) => s.permissions);
export const selectAllPermissions = createSelector(selectRolesState, (s) => s.allPermissions);
export const selectSelectedPermission = createSelector(selectRolesState, (s) => s.selectedPermission);
export const selectPermissionsPagination = createSelector(selectRolesState, (s) => s.permissionsPagination);
export const selectPermissionsQuery = createSelector(selectRolesState, (s) => s.permissionsQuery);

export const selectRolesLoading = createSelector(selectRolesState, (s) => s.loading);
export const selectRolesSaving = createSelector(selectRolesState, (s) => s.saving);
export const selectRolesError = createSelector(selectRolesState, (s) => s.error);
export const selectRolesSuccessMessage = createSelector(selectRolesState, (s) => s.successMessage);

export const selectPermissionsByModule = createSelector(selectAllPermissions, (permissions) => {
  const grouped: Record<string, typeof permissions> = {};
  permissions.forEach((p) => {
    if (!grouped[p.module]) grouped[p.module] = [];
    grouped[p.module].push(p);
  });
  return grouped;
});
