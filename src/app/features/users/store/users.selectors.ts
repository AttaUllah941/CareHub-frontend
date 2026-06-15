import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USERS_FEATURE_KEY, UsersState } from './users.state';

export const selectUsersState = createFeatureSelector<UsersState>(USERS_FEATURE_KEY);

export const selectUsers = createSelector(selectUsersState, (state) => state.users);
export const selectSelectedUser = createSelector(selectUsersState, (state) => state.selectedUser);
export const selectUsersPagination = createSelector(selectUsersState, (state) => state.pagination);
export const selectUsersQuery = createSelector(selectUsersState, (state) => state.query);
export const selectUsersLoading = createSelector(selectUsersState, (state) => state.loading);
export const selectUsersSaving = createSelector(selectUsersState, (state) => state.saving);
export const selectUsersError = createSelector(selectUsersState, (state) => state.error);
export const selectUsersSuccessMessage = createSelector(
  selectUsersState,
  (state) => state.successMessage,
);
