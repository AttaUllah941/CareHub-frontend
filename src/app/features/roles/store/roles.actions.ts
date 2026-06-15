import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AssignPermissionsRequest,
  AssignRoleRequest,
  CreatePermissionRequest,
  CreateRoleRequest,
  PaginationMeta,
  Permission,
  PermissionListQuery,
  Role,
  RoleListQuery,
  UpdatePermissionRequest,
  UpdateRoleRequest,
} from '../../../core/models/role.model';

export const RolesActions = createActionGroup({
  source: 'Roles',
  events: {
    'Load Roles': props<{ query?: Partial<RoleListQuery> }>(),
    'Load Roles Success': props<{ roles: Role[]; pagination: PaginationMeta; query: RoleListQuery }>(),
    'Load Roles Failure': props<{ error: string }>(),

    'Load Role': props<{ id: string }>(),
    'Load Role Success': props<{ role: Role }>(),
    'Load Role Failure': props<{ error: string }>(),

    'Create Role': props<{ payload: CreateRoleRequest }>(),
    'Create Role Success': props<{ role: Role; message: string }>(),
    'Create Role Failure': props<{ error: string }>(),

    'Update Role': props<{ id: string; payload: UpdateRoleRequest }>(),
    'Update Role Success': props<{ role: Role; message: string }>(),
    'Update Role Failure': props<{ error: string }>(),

    'Delete Role': props<{ id: string }>(),
    'Delete Role Success': props<{ message: string }>(),
    'Delete Role Failure': props<{ error: string }>(),

    'Assign Permissions': props<{ id: string; payload: AssignPermissionsRequest }>(),
    'Assign Permissions Success': props<{ role: Role; message: string }>(),
    'Assign Permissions Failure': props<{ error: string }>(),

    'Assign Role To User': props<{ id: string; payload: AssignRoleRequest }>(),
    'Assign Role To User Success': props<{ message: string }>(),
    'Assign Role To User Failure': props<{ error: string }>(),

    'Load Permissions': props<{ query?: Partial<PermissionListQuery> }>(),
    'Load Permissions Success': props<{ permissions: Permission[]; pagination: PaginationMeta; query: PermissionListQuery }>(),
    'Load Permissions Failure': props<{ error: string }>(),

    'Load All Permissions': emptyProps(),
    'Load All Permissions Success': props<{ permissions: Permission[] }>(),
    'Load All Permissions Failure': props<{ error: string }>(),

    'Load Permission': props<{ id: string }>(),
    'Load Permission Success': props<{ permission: Permission }>(),
    'Load Permission Failure': props<{ error: string }>(),

    'Create Permission': props<{ payload: CreatePermissionRequest }>(),
    'Create Permission Success': props<{ permission: Permission; message: string }>(),
    'Create Permission Failure': props<{ error: string }>(),

    'Update Permission': props<{ id: string; payload: UpdatePermissionRequest }>(),
    'Update Permission Success': props<{ permission: Permission; message: string }>(),
    'Update Permission Failure': props<{ error: string }>(),

    'Delete Permission': props<{ id: string }>(),
    'Delete Permission Success': props<{ message: string }>(),
    'Delete Permission Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
