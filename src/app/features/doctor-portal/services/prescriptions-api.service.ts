import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { PaginationMeta } from '../../../core/models/doctor.model';
import { DoctorPrescription } from '../models/doctor-portal.model';

export interface CreatePrescriptionRequest {
  patientName: string;
  patientId?: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; duration: string }[];
  notes?: string;
}

export interface PrescriptionListResponse {
  prescriptions: DoctorPrescription[];
  pagination: PaginationMeta;
}

@Injectable({ providedIn: 'root' })
export class PrescriptionsApiService {
  private readonly api = inject(ApiClientService);

  listMine(query: { page?: number; limit?: number } = {}): Observable<PrescriptionListResponse> {
    return this.api
      .get<PrescriptionListResponse>('/doctor/prescriptions', {
        params: query as Record<string, number | undefined>,
      })
      .pipe(map((res: ApiResponse<PrescriptionListResponse>) => res.data));
  }

  listPatientMine(query: { page?: number; limit?: number } = {}): Observable<PrescriptionListResponse> {
    return this.api
      .get<PrescriptionListResponse>('/prescriptions/me', {
        params: query as Record<string, number | undefined>,
      })
      .pipe(map((res: ApiResponse<PrescriptionListResponse>) => res.data));
  }

  create(payload: CreatePrescriptionRequest): Observable<DoctorPrescription> {
    return this.api
      .post<{ prescription: DoctorPrescription }>('/doctor/prescriptions', payload)
      .pipe(map((res) => res.data.prescription));
  }
}
