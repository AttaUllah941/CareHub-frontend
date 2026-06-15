import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AssignPermissionsRequest,
  AssignRoleRequest,
  CreatePermissionRequest,
  CreateRoleRequest,
  PermissionListQuery,
  RoleListQuery,
  UpdatePermissionRequest,
  UpdateRoleRequest,
} from '../../../core/models/role.model';
import { RolesActions } from '../store/roles.actions';
import {
  selectAllPermissions,
  selectPermissions,
  selectPermissionsByModule,
  selectPermissionsPagination,
  selectPermissionsQuery,
  selectRoles,
  selectRolesError,
  selectRolesLoading,
  selectRolesPagination,
  selectRolesQuery,
  selectRolesSaving,
  selectRolesSuccessMessage,
  selectSelectedPermission,
  selectSelectedRole,
} from '../store/roles.selectors';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly store = inject(Store);

  readonly roles = this.store.selectSignal(selectRoles);
  readonly selectedRole = this.store.selectSignal(selectSelectedRole);
  readonly rolesPagination = this.store.selectSignal(selectRolesPagination);
  readonly rolesQuery = this.store.selectSignal(selectRolesQuery);

  readonly permissions = this.store.selectSignal(selectPermissions);
  readonly allPermissions = this.store.selectSignal(selectAllPermissions);
  readonly permissionsByModule = this.store.selectSignal(selectPermissionsByModule);
  readonly selectedPermission = this.store.selectSignal(selectSelectedPermission);
  readonly permissionsPagination = this.store.selectSignal(selectPermissionsPagination);
  readonly permissionsQuery = this.store.selectSignal(selectPermissionsQuery);

  readonly loading = this.store.selectSignal(selectRolesLoading);
  readonly saving = this.store.selectSignal(selectRolesSaving);
  readonly error = this.store.selectSignal(selectRolesError);
  readonly successMessage = this.store.selectSignal(selectRolesSuccessMessage);

  loadRoles(query?: Partial<RoleListQuery>): void {
    this.store.dispatch(RolesActions.loadRoles({ query }));
  }

  loadRole(id: string): void {
    this.store.dispatch(RolesActions.loadRole({ id }));
  }

  createRole(payload: CreateRoleRequest): void {
    this.store.dispatch(RolesActions.createRole({ payload }));
  }

  updateRole(id: string, payload: UpdateRoleRequest): void {
    this.store.dispatch(RolesActions.updateRole({ id, payload }));
  }

  deleteRole(id: string): void {
    this.store.dispatch(RolesActions.deleteRole({ id }));
  }

  assignPermissions(id: string, payload: AssignPermissionsRequest): void {
    this.store.dispatch(RolesActions.assignPermissions({ id, payload }));
  }

  assignRoleToUser(id: string, payload: AssignRoleRequest): void {
    this.store.dispatch(RolesActions.assignRoleToUser({ id, payload }));
  }

  loadPermissions(query?: Partial<PermissionListQuery>): void {
    this.store.dispatch(RolesActions.loadPermissions({ query }));
  }

  loadAllPermissions(): void {
    this.store.dispatch(RolesActions.loadAllPermissions());
  }

  createPermission(payload: CreatePermissionRequest): void {
    this.store.dispatch(RolesActions.createPermission({ payload }));
  }

  deletePermission(id: string): void {
    this.store.dispatch(RolesActions.deletePermission({ id }));
  }

  clearError(): void {
    this.store.dispatch(RolesActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(RolesActions.clearSuccessMessage());
  }
}
