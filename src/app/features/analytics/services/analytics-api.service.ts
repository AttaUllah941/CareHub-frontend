import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { AnalyticsOverview, AnalyticsQuery, GrowthTrend, RevenueTrend } from '../../../core/models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/analytics`;

  getOverview(query?: AnalyticsQuery): Observable<ApiResponse<AnalyticsOverview>> {
    return this.http.get<ApiResponse<AnalyticsOverview>>(`${this.baseUrl}/overview`, {
      params: this.buildParams(query ?? {}),
    });
  }

  getRevenueTrends(query?: AnalyticsQuery): Observable<ApiResponse<RevenueTrend>> {
    return this.http.get<ApiResponse<RevenueTrend>>(`${this.baseUrl}/revenue-trends`, {
      params: this.buildParams(query ?? {}),
    });
  }

  getDoctorGrowth(query?: AnalyticsQuery): Observable<ApiResponse<GrowthTrend>> {
    return this.http.get<ApiResponse<GrowthTrend>>(`${this.baseUrl}/doctor-growth`, {
      params: this.buildParams(query ?? {}),
    });
  }

  getPatientGrowth(query?: AnalyticsQuery): Observable<ApiResponse<GrowthTrend>> {
    return this.http.get<ApiResponse<GrowthTrend>>(`${this.baseUrl}/patient-growth`, {
      params: this.buildParams(query ?? {}),
    });
  }

  getAppointmentGrowth(query?: AnalyticsQuery): Observable<ApiResponse<GrowthTrend>> {
    return this.http.get<ApiResponse<GrowthTrend>>(`${this.baseUrl}/appointment-growth`, {
      params: this.buildParams(query ?? {}),
    });
  }

  private buildParams(query: AnalyticsQuery): HttpParams {
    let params = new HttpParams();
    if (query.fromDate) params = params.set('fromDate', query.fromDate);
    if (query.toDate) params = params.set('toDate', query.toDate);
    if (query.granularity) params = params.set('granularity', query.granularity);
    return params;
  }
}
