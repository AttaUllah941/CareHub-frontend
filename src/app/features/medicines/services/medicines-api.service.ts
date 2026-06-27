import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { PaginationMeta } from '../../../core/models/doctor.model';
import {
  CreateMedicineOrderRequest,
  Medicine,
  MedicineListQuery,
  MedicineOrder,
} from '../../../core/models/medicine.model';

@Injectable({ providedIn: 'root' })
export class MedicinesApiService {
  private readonly api = inject(ApiClientService);

  listPublic(
    query: MedicineListQuery = {},
  ): Observable<ApiResponse<{ medicines: Medicine[]; pagination: PaginationMeta }>> {
    return this.api.get<{ medicines: Medicine[]; pagination: PaginationMeta }>('/medicines/public', {
      params: query as Record<string, string | number | undefined>,
    });
  }

  getPublicDetail(id: string): Observable<ApiResponse<{ medicine: Medicine }>> {
    return this.api.get<{ medicine: Medicine }>(`/medicines/public/${id}`);
  }

  createOrder(
    payload: CreateMedicineOrderRequest,
  ): Observable<ApiResponse<{ order: MedicineOrder }>> {
    return this.api.post<{ order: MedicineOrder }>('/medicines/orders', payload);
  }

  listMyOrders(): Observable<ApiResponse<{ orders: MedicineOrder[]; pagination: PaginationMeta }>> {
    return this.api.get<{ orders: MedicineOrder[]; pagination: PaginationMeta }>('/medicines/orders/me');
  }

  getOrderById(id: string): Observable<ApiResponse<{ order: MedicineOrder }>> {
    return this.api.get<{ order: MedicineOrder }>(`/medicines/orders/${id}`);
  }
}
