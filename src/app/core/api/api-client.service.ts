import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { ApiRequestOptions, buildRequestContext } from './api-request.model';
import { buildHttpParams } from './http-params.util';

/**
 * Base HTTP client for CareHub API — all feature services should use this.
 */
@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  get<T>(path: string, options?: ApiRequestOptions): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.resolveUrl(path), {
      params: options?.params ? buildHttpParams(options.params) : undefined,
      context: buildRequestContext(options),
    });
  }

  post<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.resolveUrl(path), body, {
      params: options?.params ? buildHttpParams(options.params) : undefined,
      context: buildRequestContext(options),
      headers: this.jsonHeaders(),
    });
  }

  put<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(this.resolveUrl(path), body, {
      params: options?.params ? buildHttpParams(options.params) : undefined,
      context: buildRequestContext(options),
      headers: this.jsonHeaders(),
    });
  }

  patch<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.resolveUrl(path), body, {
      params: options?.params ? buildHttpParams(options.params) : undefined,
      context: buildRequestContext(options),
      headers: this.jsonHeaders(),
    });
  }

  postFormData<T>(path: string, formData: FormData, options?: ApiRequestOptions): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.resolveUrl(path), formData, {
      context: buildRequestContext(options),
    });
  }

  delete<T>(path: string, options?: ApiRequestOptions): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.resolveUrl(path), {
      params: options?.params ? buildHttpParams(options.params) : undefined,
      context: buildRequestContext(options),
    });
  }

  /** Ping API root — useful for connectivity checks */
  ping(): Observable<ApiResponse<unknown>> {
    return this.get('/', { skipLoading: true, skipErrorToast: true });
  }

  private resolveUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalized}`;
  }

  private jsonHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }
}
