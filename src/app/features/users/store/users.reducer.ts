import { createReducer, on } from '@ngrx/store';
import { DEFAULT_USER_LIST_QUERY } from '../../../core/models/user.model';
import { UsersActions } from './users.actions';
import { initialUsersState } from './users.state';

export const usersReducer = createReducer(
  initialUsersState,

  on(UsersActions.loadUsers, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_USER_LIST_QUERY, ...state.query, ...query },
  })),

  on(UsersActions.loadUsersSuccess, (state, { users, pagination, query }) => ({
    ...state,
    users,
    pagination,
    query,
    loading: false,
  })),

  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedUser: null,
  })),

  on(UsersActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
  })),

  on(UsersActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.createUser, UsersActions.updateUser, (state) => ({
    ...state,
    saving: true,
    error: null,
    successMessage: null,
  })),

  on(UsersActions.createUserSuccess, UsersActions.updateUserSuccess, (state, { user, message }) => ({
    ...state,
    selectedUser: user,
    saving: false,
    successMessage: message,
    users: state.users.some((u) => u.id === user.id)
      ? state.users.map((u) => (u.id === user.id ? user : u))
      : state.users,
  })),

  on(UsersActions.createUserFailure, UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(UsersActions.deleteUser, (state) => ({ ...state, saving: true, error: null })),

  on(UsersActions.deleteUserSuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
  })),

  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(UsersActions.setQuery, (state, { query }) => ({
    ...state,
    query: { ...state.query, ...query },
  })),

  on(UsersActions.clearSelectedUser, (state) => ({ ...state, selectedUser: null })),

  on(UsersActions.clearError, (state) => ({ ...state, error: null })),

  on(UsersActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
