import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import {
  CreateMedicineRequest,
  CreatePharmacyOrderRequest,
  Medicine,
  MedicineListQuery,
  PharmacyInventory,
  PharmacyOrder,
  PrescriptionUpload,
  UpsertInventoryRequest,
} from '../../../core/models/pharmacy.model';

@Injectable({ providedIn: 'root' })
export class PharmacyApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pharmacy`;

  getMedicines(
    query?: Partial<MedicineListQuery>,
  ): Observable<ApiResponse<{ medicines: Medicine[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ medicines: Medicine[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/medicines`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  createMedicine(payload: CreateMedicineRequest): Observable<ApiResponse<{ medicine: Medicine }>> {
    return this.http.post<ApiResponse<{ medicine: Medicine }>>(`${this.baseUrl}/medicines`, payload);
  }

  updateMedicine(id: string, payload: Partial<CreateMedicineRequest>): Observable<ApiResponse<{ medicine: Medicine }>> {
    return this.http.put<ApiResponse<{ medicine: Medicine }>>(`${this.baseUrl}/medicines/${id}`, payload);
  }

  deleteMedicine(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/medicines/${id}`);
  }

  getInventory(query?: Record<string, string | number | boolean>): Observable<
    ApiResponse<{ inventory: PharmacyInventory[]; pagination: PaginationMeta }>
  > {
    return this.http.get<ApiResponse<{ inventory: PharmacyInventory[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/inventory`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  upsertInventory(payload: UpsertInventoryRequest): Observable<ApiResponse<{ inventory: PharmacyInventory }>> {
    return this.http.post<ApiResponse<{ inventory: PharmacyInventory }>>(`${this.baseUrl}/inventory`, payload);
  }

  adjustInventory(
    id: string,
    payload: { adjustment: number; reason?: string },
  ): Observable<ApiResponse<{ inventory: PharmacyInventory }>> {
    return this.http.patch<ApiResponse<{ inventory: PharmacyInventory }>>(
      `${this.baseUrl}/inventory/${id}/adjust`,
      payload,
    );
  }

  getOrders(query?: Record<string, string | number>): Observable<
    ApiResponse<{ orders: PharmacyOrder[]; pagination: PaginationMeta }>
  > {
    return this.http.get<ApiResponse<{ orders: PharmacyOrder[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/orders`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  getMyOrders(): Observable<ApiResponse<{ orders: PharmacyOrder[] }>> {
    return this.http.get<ApiResponse<{ orders: PharmacyOrder[] }>>(`${this.baseUrl}/orders/me`);
  }

  createOrder(payload: CreatePharmacyOrderRequest): Observable<ApiResponse<{ order: PharmacyOrder }>> {
    return this.http.post<ApiResponse<{ order: PharmacyOrder }>>(`${this.baseUrl}/orders`, payload);
  }

  createOrderFromPrescription(
    prescriptionId: string,
    payload?: Partial<CreatePharmacyOrderRequest>,
  ): Observable<ApiResponse<{ order: PharmacyOrder }>> {
    return this.http.post<ApiResponse<{ order: PharmacyOrder }>>(
      `${this.baseUrl}/orders/from-prescription/${prescriptionId}`,
      payload ?? {},
    );
  }

  updateOrderStatus(
    id: string,
    payload: { status: string; notes?: string },
  ): Observable<ApiResponse<{ order: PharmacyOrder }>> {
    return this.http.patch<ApiResponse<{ order: PharmacyOrder }>>(`${this.baseUrl}/orders/${id}/status`, payload);
  }

  cancelOrder(id: string, payload?: { cancellationReason?: string }): Observable<ApiResponse<{ order: PharmacyOrder }>> {
    return this.http.post<ApiResponse<{ order: PharmacyOrder }>>(`${this.baseUrl}/orders/${id}/cancel`, payload ?? {});
  }

  uploadPrescription(file: File, title?: string): Observable<ApiResponse<{ upload: PrescriptionUpload }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    return this.http.post<ApiResponse<{ upload: PrescriptionUpload }>>(`${this.baseUrl}/prescription-uploads`, formData);
  }

  getMyPrescriptionUploads(): Observable<ApiResponse<{ uploads: PrescriptionUpload[] }>> {
    return this.http.get<ApiResponse<{ uploads: PrescriptionUpload[] }>>(`${this.baseUrl}/prescription-uploads/me`);
  }

  getPrescriptionUploads(query?: Record<string, string | number>): Observable<
    ApiResponse<{ uploads: PrescriptionUpload[]; pagination: PaginationMeta }>
  > {
    return this.http.get<ApiResponse<{ uploads: PrescriptionUpload[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/prescription-uploads`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  reviewPrescriptionUpload(
    id: string,
    payload: { status: 'APPROVED' | 'REJECTED'; reviewNotes?: string },
  ): Observable<ApiResponse<{ upload: PrescriptionUpload }>> {
    return this.http.patch<ApiResponse<{ upload: PrescriptionUpload }>>(
      `${this.baseUrl}/prescription-uploads/${id}/review`,
      payload,
    );
  }

  private buildParams(query: Record<string, string | number | boolean | undefined>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
