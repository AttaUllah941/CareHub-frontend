import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  CreateLanguageRequest,
  Language,
  LanguageListQuery,
  PaginationMeta,
  UpdateLanguageRequest,
} from '../../../core/models/language.model';

@Injectable({ providedIn: 'root' })
export class LanguageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/languages`;

  getLanguages(
    query: LanguageListQuery,
  ): Observable<ApiResponse<{ languages: Language[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ languages: Language[]; pagination: PaginationMeta }>>(
      this.baseUrl,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getAllLanguages(): Observable<ApiResponse<{ languages: Language[] }>> {
    return this.http.get<ApiResponse<{ languages: Language[] }>>(`${this.baseUrl}/all`);
  }

  getLanguageById(id: string): Observable<ApiResponse<{ language: Language }>> {
    return this.http.get<ApiResponse<{ language: Language }>>(`${this.baseUrl}/${id}`);
  }

  createLanguage(payload: CreateLanguageRequest): Observable<ApiResponse<{ language: Language }>> {
    return this.http.post<ApiResponse<{ language: Language }>>(this.baseUrl, payload);
  }

  updateLanguage(id: string, payload: UpdateLanguageRequest): Observable<ApiResponse<{ language: Language }>> {
    return this.http.put<ApiResponse<{ language: Language }>>(`${this.baseUrl}/${id}`, payload);
  }

  deleteLanguage(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/${id}`);
  }

  private buildParams(query: Record<string, string | number>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
