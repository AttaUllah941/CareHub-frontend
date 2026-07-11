import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { PaginationMeta } from '../../../core/models/doctor.model';
import {
  CreateSurgeryConsultationRequest,
  SurgeryConsultationListQuery,
  SurgeryConsultationListResponse,
  SurgeryConsultationStatus,
  SurgeryProcedure,
  SurgeryProcedureListQuery,
} from '../../../core/models/surgery.model';

@Injectable({ providedIn: 'root' })
export class SurgeriesApiService {
  private readonly api = inject(ApiClientService);

  listPublicProcedures(
    query: SurgeryProcedureListQuery = {},
  ): Observable<ApiResponse<{ procedures: SurgeryProcedure[]; pagination: PaginationMeta }>> {
    return this.api.get<{ procedures: SurgeryProcedure[]; pagination: PaginationMeta }>(
      '/surgeries/public/procedures',
      { params: query as Record<string, string | number | undefined> },
    );
  }

  getPublicProcedureDetail(
    slug: string,
  ): Observable<ApiResponse<{ procedure: SurgeryProcedure }>> {
    return this.api.get<{ procedure: SurgeryProcedure }>(`/surgeries/public/procedures/${slug}`);
  }

  createConsultationRequest(
    payload: CreateSurgeryConsultationRequest,
  ): Observable<ApiResponse<{ consultationRequest: { id: string; status: SurgeryConsultationStatus } }>> {
    return this.api.post<{ consultationRequest: { id: string; status: SurgeryConsultationStatus } }>(
      '/surgeries/consultation-requests',
      payload,
    );
  }

  listMine(
    query: SurgeryConsultationListQuery = {},
  ): Observable<ApiResponse<SurgeryConsultationListResponse>> {
    return this.api.get<SurgeryConsultationListResponse>('/surgeries/consultation-requests/me', {
      params: query as Record<string, string | number | undefined>,
    });
  }
}
