import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import {
  InitiatePaymentRequest,
  Payment,
  PaymentGateway,
  PaymentListQuery,
  RefundPaymentRequest,
} from '../../../core/models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/payments`;

  getMyPayments(
    query?: Partial<PaymentListQuery>,
  ): Observable<ApiResponse<{ payments: Payment[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ payments: Payment[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/me`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  getPayments(
    query: PaymentListQuery,
  ): Observable<ApiResponse<{ payments: Payment[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ payments: Payment[]; pagination: PaginationMeta }>>(this.baseUrl, {
      params: this.buildParams(query as unknown as Record<string, string | number>),
    });
  }

  getByAppointmentId(appointmentId: string): Observable<ApiResponse<{ payment: Payment }>> {
    return this.http.get<ApiResponse<{ payment: Payment }>>(`${this.baseUrl}/appointment/${appointmentId}`);
  }

  getPaymentById(id: string): Observable<ApiResponse<{ payment: Payment }>> {
    return this.http.get<ApiResponse<{ payment: Payment }>>(`${this.baseUrl}/${id}`);
  }

  initiatePayment(
    appointmentId: string,
    payload: InitiatePaymentRequest,
  ): Observable<ApiResponse<{ payment: Payment }>> {
    return this.http.post<ApiResponse<{ payment: Payment }>>(
      `${this.baseUrl}/appointment/${appointmentId}/initiate`,
      payload,
    );
  }

  completeCallback(
    gateway: PaymentGateway,
    params: Record<string, string>,
  ): Observable<ApiResponse<{ payment: Payment }>> {
    const path = gateway === 'JAZZCASH' ? 'jazzcash' : 'easypaisa';
    return this.http.post<ApiResponse<{ payment: Payment }>>(`${this.baseUrl}/callback/${path}`, params);
  }

  initiateRefund(id: string, payload: RefundPaymentRequest): Observable<ApiResponse<{ payment: Payment }>> {
    return this.http.post<ApiResponse<{ payment: Payment }>>(`${this.baseUrl}/${id}/refund`, payload);
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
