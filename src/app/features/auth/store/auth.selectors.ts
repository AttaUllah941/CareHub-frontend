import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY, AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectUser = createSelector(selectAuthState, (state) => state.user);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);

export const selectUserRole = createSelector(selectAuthState, (state) => state.user?.role ?? null);

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectAuthSuccessMessage = createSelector(
  selectAuthState,
  (state) => state.successMessage,
);

export const selectDevResetToken = createSelector(selectAuthState, (state) => state.devResetToken);

export const selectUserFullName = createSelector(selectUser, (user) =>
  user ? `${user.firstName} ${user.lastName}` : '',
);
