import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserRole,
} from '../../../core/models/auth.model';
import { AuthActions } from '../store/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthSuccessMessage,
  selectDevResetToken,
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
} from '../store/auth.selectors';

/**
 * Auth Service — facade over NgRx store for feature components.
 * Components dispatch actions through this service instead of importing store directly.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(selectUser);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly role = this.store.selectSignal(selectUserRole);
  readonly loading = this.store.selectSignal(selectAuthLoading);
  readonly error = this.store.selectSignal(selectAuthError);
  readonly successMessage = this.store.selectSignal(selectAuthSuccessMessage);
  readonly devResetToken = this.store.selectSignal(selectDevResetToken);

  initSession(): void {
    this.store.dispatch(AuthActions.initSession());
  }

  login(credentials: LoginRequest): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  register(payload: RegisterRequest): void {
    this.store.dispatch(AuthActions.register({ payload }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  forgotPassword(payload: ForgotPasswordRequest): void {
    this.store.dispatch(AuthActions.forgotPassword({ payload }));
  }

  resetPassword(payload: ResetPasswordRequest): void {
    this.store.dispatch(AuthActions.resetPassword({ payload }));
  }

  changePassword(payload: ChangePasswordRequest): void {
    this.store.dispatch(AuthActions.changePassword({ payload }));
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(AuthActions.clearSuccessMessage());
  }

  hasRole(...roles: UserRole[]): boolean {
    const userRole = this.role();
    return userRole !== null && roles.includes(userRole);
  }
}
