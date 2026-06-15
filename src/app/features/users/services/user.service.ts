import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserListQuery,
} from '../../../core/models/user.model';
import { UsersActions } from '../store/users.actions';
import {
  selectSelectedUser,
  selectUsers,
  selectUsersError,
  selectUsersLoading,
  selectUsersPagination,
  selectUsersQuery,
  selectUsersSaving,
  selectUsersSuccessMessage,
} from '../store/users.selectors';

/** Facade over NgRx users store */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly store = inject(Store);

  readonly users = this.store.selectSignal(selectUsers);
  readonly selectedUser = this.store.selectSignal(selectSelectedUser);
  readonly pagination = this.store.selectSignal(selectUsersPagination);
  readonly query = this.store.selectSignal(selectUsersQuery);
  readonly loading = this.store.selectSignal(selectUsersLoading);
  readonly saving = this.store.selectSignal(selectUsersSaving);
  readonly error = this.store.selectSignal(selectUsersError);
  readonly successMessage = this.store.selectSignal(selectUsersSuccessMessage);

  loadUsers(query?: Partial<UserListQuery>): void {
    this.store.dispatch(UsersActions.loadUsers({ query }));
  }

  loadUser(id: string): void {
    this.store.dispatch(UsersActions.loadUser({ id }));
  }

  createUser(payload: CreateUserRequest): void {
    this.store.dispatch(UsersActions.createUser({ payload }));
  }

  updateUser(id: string, payload: UpdateUserRequest): void {
    this.store.dispatch(UsersActions.updateUser({ id, payload }));
  }

  deleteUser(id: string): void {
    this.store.dispatch(UsersActions.deleteUser({ id }));
  }

  setQuery(query: Partial<UserListQuery>): void {
    this.store.dispatch(UsersActions.setQuery({ query }));
  }

  clearSelectedUser(): void {
    this.store.dispatch(UsersActions.clearSelectedUser());
  }

  clearError(): void {
    this.store.dispatch(UsersActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(UsersActions.clearSuccessMessage());
  }
}
