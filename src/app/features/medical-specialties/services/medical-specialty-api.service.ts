import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  CreateMedicalSpecialtyRequest,
  MedicalSpecialty,
  MedicalSpecialtyListQuery,
  PaginationMeta,
  UpdateMedicalSpecialtyRequest,
} from '../../../core/models/medical-specialty.model';

@Injectable({ providedIn: 'root' })
export class MedicalSpecialtyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/medical-specialties`;

  getSpecialties(
    query: MedicalSpecialtyListQuery,
  ): Observable<ApiResponse<{ specialties: MedicalSpecialty[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ specialties: MedicalSpecialty[]; pagination: PaginationMeta }>>(
      this.baseUrl,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getAllSpecialties(): Observable<ApiResponse<{ specialties: MedicalSpecialty[] }>> {
    return this.http.get<ApiResponse<{ specialties: MedicalSpecialty[] }>>(`${this.baseUrl}/all`);
  }

  getSpecialtyById(id: string): Observable<ApiResponse<{ specialty: MedicalSpecialty }>> {
    return this.http.get<ApiResponse<{ specialty: MedicalSpecialty }>>(`${this.baseUrl}/${id}`);
  }

  createSpecialty(payload: CreateMedicalSpecialtyRequest): Observable<ApiResponse<{ specialty: MedicalSpecialty }>> {
    return this.http.post<ApiResponse<{ specialty: MedicalSpecialty }>>(this.baseUrl, payload);
  }

  updateSpecialty(
    id: string,
    payload: UpdateMedicalSpecialtyRequest,
  ): Observable<ApiResponse<{ specialty: MedicalSpecialty }>> {
    return this.http.put<ApiResponse<{ specialty: MedicalSpecialty }>>(`${this.baseUrl}/${id}`, payload);
  }

  deleteSpecialty(id: string): Observable<ApiResponse<{ message: string }>> {
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
