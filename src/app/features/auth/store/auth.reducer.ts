import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  on(
    AuthActions.login,
    AuthActions.register,
    AuthActions.forgotPassword,
    AuthActions.resetPassword,
    AuthActions.changePassword,
    (state) => ({
      ...state,
      loading: true,
      error: null,
      successMessage: null,
    }),
  ),

  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    isAuthenticated: true,
    loading: false,
    error: null,
    successMessage: null,
  })),

  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
    successMessage: 'Account created successfully. Please sign in.',
  })),

  on(
    AuthActions.loginFailure,
    AuthActions.registerFailure,
    AuthActions.forgotPasswordFailure,
    AuthActions.resetPasswordFailure,
    AuthActions.changePasswordFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),

  on(AuthActions.forgotPasswordSuccess, (state, { message, devResetToken }) => ({
    ...state,
    loading: false,
    error: null,
    successMessage: message,
    devResetToken: devResetToken ?? null,
  })),

  on(AuthActions.resetPasswordSuccess, AuthActions.changePasswordSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    error: null,
    successMessage: message,
  })),

  on(AuthActions.logout, (state) => ({ ...state, loading: true })),

  on(AuthActions.logoutSuccess, () => initialAuthState),

  on(AuthActions.loadProfileSuccess, (state, { user, accessToken, refreshToken }) => ({
    ...state,
    user,
    accessToken,
    refreshToken,
    isAuthenticated: true,
    loading: false,
  })),

  on(AuthActions.loadProfileFailure, () => initialAuthState),

  on(AuthActions.sessionTokensRefreshed, (state, { accessToken, refreshToken }) => ({
    ...state,
    accessToken,
    refreshToken,
    isAuthenticated: true,
  })),

  on(AuthActions.sessionExpired, () => initialAuthState),

  on(AuthActions.initSession, (state) => ({ ...state, loading: true })),

  on(AuthActions.clearError, (state) => ({ ...state, error: null })),

  on(AuthActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
