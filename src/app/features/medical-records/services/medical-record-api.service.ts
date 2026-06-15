import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import {
  MedicalRecord,
  MedicalRecordListQuery,
  UpdateMedicalRecordRequest,
  UploadMedicalRecordRequest,
} from '../../../core/models/medical-record.model';

@Injectable({ providedIn: 'root' })
export class MedicalRecordApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/medical-records`;

  uploadRecord(payload: UploadMedicalRecordRequest): Observable<ApiResponse<{ record: MedicalRecord }>> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('recordType', payload.recordType);
    formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    if (payload.patientProfileId) formData.append('patientProfileId', payload.patientProfileId);
    if (payload.familyMemberId) formData.append('familyMemberId', payload.familyMemberId);
    if (payload.consultationId) formData.append('consultationId', payload.consultationId);
    if (payload.appointmentId) formData.append('appointmentId', payload.appointmentId);
    return this.http.post<ApiResponse<{ record: MedicalRecord }>>(`${this.baseUrl}/upload`, formData);
  }

  uploadNewVersion(
    id: string,
    file: File,
    changeNote?: string,
  ): Observable<ApiResponse<{ record: MedicalRecord }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (changeNote) formData.append('changeNote', changeNote);
    return this.http.post<ApiResponse<{ record: MedicalRecord }>>(`${this.baseUrl}/${id}/upload`, formData);
  }

  getMyRecords(recordType?: string): Observable<ApiResponse<{ records: MedicalRecord[] }>> {
    let params = new HttpParams();
    if (recordType) params = params.set('recordType', recordType);
    return this.http.get<ApiResponse<{ records: MedicalRecord[] }>>(`${this.baseUrl}/me`, { params });
  }

  getByPatientId(
    patientProfileId: string,
    recordType?: string,
  ): Observable<ApiResponse<{ records: MedicalRecord[] }>> {
    let params = new HttpParams();
    if (recordType) params = params.set('recordType', recordType);
    return this.http.get<ApiResponse<{ records: MedicalRecord[] }>>(
      `${this.baseUrl}/patient/${patientProfileId}`,
      { params },
    );
  }

  getRecords(
    query: MedicalRecordListQuery,
  ): Observable<ApiResponse<{ records: MedicalRecord[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ records: MedicalRecord[]; pagination: PaginationMeta }>>(
      this.baseUrl,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getRecordById(id: string): Observable<ApiResponse<{ record: MedicalRecord }>> {
    return this.http.get<ApiResponse<{ record: MedicalRecord }>>(`${this.baseUrl}/${id}`);
  }

  getRecordHistory(id: string): Observable<
    ApiResponse<{ recordId: string; currentVersion: number; history: MedicalRecord['history'] }>
  > {
    return this.http.get<
      ApiResponse<{ recordId: string; currentVersion: number; history: MedicalRecord['history'] }>
    >(`${this.baseUrl}/${id}/history`);
  }

  updateRecord(id: string, payload: UpdateMedicalRecordRequest): Observable<ApiResponse<{ record: MedicalRecord }>> {
    return this.http.put<ApiResponse<{ record: MedicalRecord }>>(`${this.baseUrl}/${id}`, payload);
  }

  deleteRecord(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/${id}`);
  }

  downloadRecord(id: string, version?: number): Observable<Blob> {
    let params = new HttpParams();
    if (version) params = params.set('version', String(version));
    return this.http.get(`${this.baseUrl}/${id}/download`, { params, responseType: 'blob' });
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
