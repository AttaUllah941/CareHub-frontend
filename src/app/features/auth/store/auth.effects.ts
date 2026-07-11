import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { ReferenceDataService } from '../../../core/services/reference-data.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '../../../core/models/auth.model';
import { AuthActions } from './auth.actions';
import { ROLE_DASHBOARD_ROUTES } from './auth.state';
import { resolvePostLoginUrl } from '../../../core/utils/auth-navigation.util';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authApi = inject(AuthApiService);
  private readonly referenceData = inject(ReferenceDataService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authApi.login(credentials).pipe(
          map((res) => AuthActions.loginSuccess({ response: res.data })),
          catchError((err) =>
            of(AuthActions.loginFailure({ error: err.error?.message ?? 'Login failed' })),
          ),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ payload }) =>
        this.authApi.register(payload).pipe(
          map((res) => AuthActions.registerSuccess({ response: res.data })),
          catchError((err) =>
            of(AuthActions.registerFailure({ error: err.error?.message ?? 'Registration failed' })),
          ),
        ),
      ),
    ),
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      exhaustMap(({ payload }) =>
        this.authApi.forgotPassword(payload).pipe(
          map((res) =>
            AuthActions.forgotPasswordSuccess({
              message: res.message ?? 'Reset link sent if account exists.',
              devResetToken: res.data?.devResetToken,
            }),
          ),
          catchError((err) =>
            of(
              AuthActions.forgotPasswordFailure({
                error: err.error?.message ?? 'Failed to send reset link',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      exhaustMap(({ payload }) =>
        this.authApi.resetPassword(payload).pipe(
          map((res) =>
            AuthActions.resetPasswordSuccess({
              message: res.message ?? 'Password reset successful',
            }),
          ),
          catchError((err) =>
            of(
              AuthActions.resetPasswordFailure({
                error: err.error?.message ?? 'Password reset failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      exhaustMap(({ payload }) =>
        this.authApi.changePassword(payload).pipe(
          map((res) =>
            AuthActions.changePasswordSuccess({
              message: res.message ?? 'Password changed successfully',
            }),
          ),
          catchError((err) =>
            of(
              AuthActions.changePasswordFailure({
                error: err.error?.message ?? 'Password change failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(({ response }) => {
          this.tokenStorage.setTokens(response.accessToken, response.refreshToken);
          this.referenceData.loadSpecialties();

          const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];
          const dashboardRoute = ROLE_DASHBOARD_ROUTES[response.user.role] ?? '/';
          const destination = resolvePostLoginUrl(
            response.user.role,
            returnUrl,
            dashboardRoute,
          );
          this.router.navigateByUrl(destination);
        }),
      ),
    { dispatch: false },
  );

  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap(() => this.router.navigate(['/auth/login'])),
      ),
    { dispatch: false },
  );

  changePasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.changePasswordSuccess),
        tap(() => {
          this.tokenStorage.clearTokens();
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authApi.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())),
        ),
      ),
    ),
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.tokenStorage.clearTokens();
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );

  initSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initSession),
      exhaustMap(() => {
        if (!this.tokenStorage.hasValidToken()) {
          return of(AuthActions.loadProfileFailure({ error: 'No token' }));
        }
        return this.authApi.getProfile().pipe(
          map((res) =>
            AuthActions.loadProfileSuccess({
              user: res.data.user,
              accessToken: this.tokenStorage.getAccessToken() ?? '',
              refreshToken: this.tokenStorage.getRefreshToken() ?? '',
            }),
          ),
          catchError((err) =>
            of(AuthActions.loadProfileFailure({ error: err.error?.message ?? 'Session expired' })),
          ),
        );
      }),
    ),
  );

  sessionRestored$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loadProfileSuccess),
        tap(() => this.referenceData.loadSpecialties()),
      ),
    { dispatch: false },
  );

  sessionExpired$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loadProfileFailure, AuthActions.sessionExpired),
        tap(() => this.tokenStorage.clearTokens()),
      ),
    { dispatch: false },
  );
}
