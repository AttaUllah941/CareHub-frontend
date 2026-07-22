import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { PaginationMeta } from '../../../core/models/doctor.model';
import { MedicineOrder, PharmacySummary } from '../../../core/models/medicine.model';

export interface PharmacyOrdersResponse {
  pharmacy: PharmacySummary;
  orders: MedicineOrder[];
  pagination: PaginationMeta;
}

@Injectable({ providedIn: 'root' })
export class PharmacyOrdersApiService {
  private readonly api = inject(ApiClientService);

  listOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Observable<ApiResponse<PharmacyOrdersResponse>> {
    return this.api.get<PharmacyOrdersResponse>('/pharmacy/orders', {
      params: params as Record<string, string | number | undefined>,
    });
  }

  getOrder(id: string): Observable<ApiResponse<{ order: MedicineOrder }>> {
    return this.api.get<{ order: MedicineOrder }>(`/pharmacy/orders/${id}`);
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<{ order: MedicineOrder }>> {
    return this.api.patch<{ order: MedicineOrder }>(`/pharmacy/orders/${id}/status`, { status });
  }
}
