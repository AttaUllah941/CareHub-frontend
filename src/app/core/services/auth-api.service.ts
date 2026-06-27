import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from '../models/auth.model';
import { ApiResponse } from '../models/api.model';

/** Public auth endpoints that must not receive Authorization headers */
export const PUBLIC_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
] as const;

/**
 * HTTP service for authentication API endpoints.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly api = inject(ApiClientService);
  private readonly basePath = '/auth';

  register(payload: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>(`${this.basePath}/register`, payload);
  }

  login(payload: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>(`${this.basePath}/login`, payload);
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>(`${this.basePath}/refresh`, { refreshToken });
  }

  logout(): Observable<ApiResponse<MessageResponse>> {
    return this.api.post<MessageResponse>(`${this.basePath}/logout`, {});
  }

  getProfile(): Observable<ApiResponse<{ user: User }>> {
    return this.api.get<{ user: User }>(`${this.basePath}/me`);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<ApiResponse<ForgotPasswordResponse>> {
    return this.api.post<ForgotPasswordResponse>(`${this.basePath}/forgot-password`, payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<ApiResponse<MessageResponse>> {
    return this.api.post<MessageResponse>(`${this.basePath}/reset-password`, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiResponse<MessageResponse>> {
    return this.api.post<MessageResponse>(`${this.basePath}/change-password`, payload);
  }
}
