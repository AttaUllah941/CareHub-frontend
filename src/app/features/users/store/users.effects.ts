import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_USER_LIST_QUERY } from '../../../core/models/user.model';
import { UserApiService } from '../services/user-api.service';
import { UsersActions } from './users.actions';
import { selectUsersQuery } from './users.selectors';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly userApi = inject(UserApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      withLatestFrom(this.store.select(selectUsersQuery)),
      exhaustMap(([{ query }, currentQuery]) => {
        const mergedQuery = { ...DEFAULT_USER_LIST_QUERY, ...currentQuery, ...query };
        return this.userApi.getUsers(mergedQuery).pipe(
          map((res) =>
            UsersActions.loadUsersSuccess({
              users: res.data.users,
              pagination: res.data.pagination,
              query: mergedQuery,
            }),
          ),
          catchError((err) =>
            of(UsersActions.loadUsersFailure({ error: err.error?.message ?? 'Failed to load users' })),
          ),
        );
      }),
    ),
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUser),
      exhaustMap(({ id }) =>
        this.userApi.getUserById(id).pipe(
          map((res) => UsersActions.loadUserSuccess({ user: res.data.user })),
          catchError((err) =>
            of(UsersActions.loadUserFailure({ error: err.error?.message ?? 'Failed to load user' })),
          ),
        ),
      ),
    ),
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      exhaustMap(({ payload }) =>
        this.userApi.createUser(payload).pipe(
          map((res) =>
            UsersActions.createUserSuccess({
              user: res.data.user,
              message: res.message ?? 'User created successfully',
            }),
          ),
          catchError((err) =>
            of(UsersActions.createUserFailure({ error: err.error?.message ?? 'Failed to create user' })),
          ),
        ),
      ),
    ),
  );

  createUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.createUserSuccess),
        tap(({ user }) => this.router.navigate(['/admin/users', user.id])),
      ),
    { dispatch: false },
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      exhaustMap(({ id, payload }) =>
        this.userApi.updateUser(id, payload).pipe(
          map((res) =>
            UsersActions.updateUserSuccess({
              user: res.data.user,
              message: res.message ?? 'User updated successfully',
            }),
          ),
          catchError((err) =>
            of(UsersActions.updateUserFailure({ error: err.error?.message ?? 'Failed to update user' })),
          ),
        ),
      ),
    ),
  );

  updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserSuccess),
        tap(({ user }) => this.router.navigate(['/admin/users', user.id])),
      ),
    { dispatch: false },
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      exhaustMap(({ id }) =>
        this.userApi.deleteUser(id).pipe(
          map((res) =>
            UsersActions.deleteUserSuccess({ message: res.message ?? 'User deactivated successfully' }),
          ),
          catchError((err) =>
            of(UsersActions.deleteUserFailure({ error: err.error?.message ?? 'Failed to delete user' })),
          ),
        ),
      ),
    ),
  );

  deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.deleteUserSuccess),
        tap(() => {
          this.router.navigate(['/admin/users']);
          this.store.dispatch(UsersActions.loadUsers({}));
        }),
      ),
    { dispatch: false },
  );
}
