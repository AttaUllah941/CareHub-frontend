import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
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
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  register(payload: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, payload);
  }

  login(payload: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, payload);
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/refresh`, { refreshToken });
  }

  logout(): Observable<ApiResponse<MessageResponse>> {
    return this.http.post<ApiResponse<MessageResponse>>(`${this.baseUrl}/logout`, {});
  }

  getProfile(): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.baseUrl}/me`);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<ApiResponse<ForgotPasswordResponse>> {
    return this.http.post<ApiResponse<ForgotPasswordResponse>>(
      `${this.baseUrl}/forgot-password`,
      payload,
    );
  }

  resetPassword(payload: ResetPasswordRequest): Observable<ApiResponse<MessageResponse>> {
    return this.http.post<ApiResponse<MessageResponse>>(
      `${this.baseUrl}/reset-password`,
      payload,
    );
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiResponse<MessageResponse>> {
    return this.http.post<ApiResponse<MessageResponse>>(
      `${this.baseUrl}/change-password`,
      payload,
    );
  }
}
