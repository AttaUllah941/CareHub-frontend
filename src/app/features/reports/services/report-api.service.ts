import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { AnyReport, ExportFormat, ReportQuery, ReportType } from '../../../core/models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/reports`;

  getReport(type: ReportType, query: ReportQuery): Observable<ApiResponse<{ report: AnyReport }>> {
    const path = type.toLowerCase();
    return this.http.get<ApiResponse<{ report: AnyReport }>>(`${this.baseUrl}/${path}`, {
      params: this.buildParams(query),
    });
  }

  exportReport(type: ReportType, format: ExportFormat, query: ReportQuery): Observable<Blob> {
    const path = `${type.toLowerCase()}/export/${format}`;
    return this.http.get(`${this.baseUrl}/${path}`, {
      params: this.buildParams(query),
      responseType: 'blob',
    });
  }

  private buildParams(query: ReportQuery): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
