import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  CreateFamilyMemberRequest,
  FamilyMember,
  FamilyMemberListQuery,
  PaginationMeta,
  UpdateFamilyMemberRequest,
} from '../../../core/models/family-member.model';

@Injectable({ providedIn: 'root' })
export class FamilyMemberApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/family-members`;

  getFamilyMembers(
    query: FamilyMemberListQuery,
  ): Observable<ApiResponse<{ familyMembers: FamilyMember[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ familyMembers: FamilyMember[]; pagination: PaginationMeta }>>(
      this.baseUrl,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getMyFamilyMembers(): Observable<ApiResponse<{ familyMembers: FamilyMember[] }>> {
    return this.http.get<ApiResponse<{ familyMembers: FamilyMember[] }>>(`${this.baseUrl}/me`);
  }

  getByPatientId(patientProfileId: string): Observable<ApiResponse<{ familyMembers: FamilyMember[] }>> {
    return this.http.get<ApiResponse<{ familyMembers: FamilyMember[] }>>(
      `${this.baseUrl}/patient/${patientProfileId}`,
    );
  }

  getFamilyMemberById(id: string): Observable<ApiResponse<{ familyMember: FamilyMember }>> {
    return this.http.get<ApiResponse<{ familyMember: FamilyMember }>>(`${this.baseUrl}/${id}`);
  }

  createFamilyMember(payload: CreateFamilyMemberRequest): Observable<ApiResponse<{ familyMember: FamilyMember }>> {
    return this.http.post<ApiResponse<{ familyMember: FamilyMember }>>(this.baseUrl, payload);
  }

  createMyFamilyMember(payload: CreateFamilyMemberRequest): Observable<ApiResponse<{ familyMember: FamilyMember }>> {
    return this.http.post<ApiResponse<{ familyMember: FamilyMember }>>(`${this.baseUrl}/me`, payload);
  }

  updateFamilyMember(
    id: string,
    payload: UpdateFamilyMemberRequest,
  ): Observable<ApiResponse<{ familyMember: FamilyMember }>> {
    return this.http.put<ApiResponse<{ familyMember: FamilyMember }>>(`${this.baseUrl}/${id}`, payload);
  }

  updateMyFamilyMember(
    id: string,
    payload: UpdateFamilyMemberRequest,
  ): Observable<ApiResponse<{ familyMember: FamilyMember }>> {
    return this.http.put<ApiResponse<{ familyMember: FamilyMember }>>(`${this.baseUrl}/me/${id}`, payload);
  }

  deleteFamilyMember(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/${id}`);
  }

  deleteMyFamilyMember(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/me/${id}`);
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
