import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import {
  DEFAULT_PERMISSION_LIST_QUERY,
  DEFAULT_ROLE_LIST_QUERY,
} from '../../../core/models/role.model';
import { RoleApiService } from '../services/role-api.service';
import { RolesActions } from './roles.actions';
import { selectPermissionsQuery, selectRolesQuery } from './roles.selectors';

@Injectable()
export class RolesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(RoleApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      withLatestFrom(this.store.select(selectRolesQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_ROLE_LIST_QUERY, ...current, ...query };
        return this.api.getRoles(merged).pipe(
          map((res) =>
            RolesActions.loadRolesSuccess({
              roles: res.data.roles,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(RolesActions.loadRolesFailure({ error: err.error?.message ?? 'Failed to load roles' })),
          ),
        );
      }),
    ),
  );

  loadRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRole),
      exhaustMap(({ id }) =>
        this.api.getRoleById(id).pipe(
          map((res) => RolesActions.loadRoleSuccess({ role: res.data.role })),
          catchError((err) =>
            of(RolesActions.loadRoleFailure({ error: err.error?.message ?? 'Failed to load role' })),
          ),
        ),
      ),
    ),
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.createRole),
      exhaustMap(({ payload }) =>
        this.api.createRole(payload).pipe(
          map((res) =>
            RolesActions.createRoleSuccess({
              role: res.data.role,
              message: res.message ?? 'Role created',
            }),
          ),
          catchError((err) =>
            of(RolesActions.createRoleFailure({ error: err.error?.message ?? 'Failed to create role' })),
          ),
        ),
      ),
    ),
  );

  createRoleSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RolesActions.createRoleSuccess),
        tap(({ role }) => this.router.navigate(['/admin/roles', role.id])),
      ),
    { dispatch: false },
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.updateRole),
      exhaustMap(({ id, payload }) =>
        this.api.updateRole(id, payload).pipe(
          map((res) =>
            RolesActions.updateRoleSuccess({
              role: res.data.role,
              message: res.message ?? 'Role updated',
            }),
          ),
          catchError((err) =>
            of(RolesActions.updateRoleFailure({ error: err.error?.message ?? 'Failed to update role' })),
          ),
        ),
      ),
    ),
  );

  assignPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.assignPermissions),
      exhaustMap(({ id, payload }) =>
        this.api.assignPermissions(id, payload).pipe(
          map((res) =>
            RolesActions.assignPermissionsSuccess({
              role: res.data.role,
              message: res.message ?? 'Permissions assigned',
            }),
          ),
          catchError((err) =>
            of(
              RolesActions.assignPermissionsFailure({
                error: err.error?.message ?? 'Failed to assign permissions',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  assignRoleToUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.assignRoleToUser),
      exhaustMap(({ id, payload }) =>
        this.api.assignRoleToUser(id, payload).pipe(
          map((res) =>
            RolesActions.assignRoleToUserSuccess({
              message: res.message ?? 'Role assigned to user',
            }),
          ),
          catchError((err) =>
            of(
              RolesActions.assignRoleToUserFailure({
                error: err.error?.message ?? 'Failed to assign role',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.deleteRole),
      exhaustMap(({ id }) =>
        this.api.deleteRole(id).pipe(
          map((res) => RolesActions.deleteRoleSuccess({ message: res.message ?? 'Role deleted' })),
          catchError((err) =>
            of(RolesActions.deleteRoleFailure({ error: err.error?.message ?? 'Failed to delete role' })),
          ),
        ),
      ),
    ),
  );

  deleteRoleSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RolesActions.deleteRoleSuccess),
        tap(() => {
          this.router.navigate(['/admin/roles']);
          this.store.dispatch(RolesActions.loadRoles({}));
        }),
      ),
    { dispatch: false },
  );

  loadAllPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadAllPermissions),
      exhaustMap(() =>
        this.api.getAllPermissions().pipe(
          map((res) => RolesActions.loadAllPermissionsSuccess({ permissions: res.data.permissions })),
          catchError((err) =>
            of(
              RolesActions.loadAllPermissionsFailure({
                error: err.error?.message ?? 'Failed to load permissions',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadPermissions),
      withLatestFrom(this.store.select(selectPermissionsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_PERMISSION_LIST_QUERY, ...current, ...query };
        return this.api.getPermissions(merged).pipe(
          map((res) =>
            RolesActions.loadPermissionsSuccess({
              permissions: res.data.permissions,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(
              RolesActions.loadPermissionsFailure({
                error: err.error?.message ?? 'Failed to load permissions',
              }),
            ),
          ),
        );
      }),
    ),
  );

  createPermission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.createPermission),
      exhaustMap(({ payload }) =>
        this.api.createPermission(payload).pipe(
          map((res) =>
            RolesActions.createPermissionSuccess({
              permission: res.data.permission,
              message: res.message ?? 'Permission created',
            }),
          ),
          catchError((err) =>
            of(
              RolesActions.createPermissionFailure({
                error: err.error?.message ?? 'Failed to create permission',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createPermissionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RolesActions.createPermissionSuccess),
        tap(() => {
          this.store.dispatch(RolesActions.loadPermissions({}));
        }),
      ),
    { dispatch: false },
  );

  deletePermission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.deletePermission),
      exhaustMap(({ id }) =>
        this.api.deletePermission(id).pipe(
          map((res) =>
            RolesActions.deletePermissionSuccess({ message: res.message ?? 'Permission deleted' }),
          ),
          catchError((err) =>
            of(
              RolesActions.deletePermissionFailure({
                error: err.error?.message ?? 'Failed to delete permission',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deletePermissionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RolesActions.deletePermissionSuccess),
        tap(() => this.store.dispatch(RolesActions.loadPermissions({}))),
      ),
    { dispatch: false },
  );
}
