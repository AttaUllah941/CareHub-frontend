import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import { AuditLog, AuditLogListQuery } from '../../../core/models/audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditLogApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/audit-logs`;

  getLogs(query?: Partial<AuditLogListQuery>): Observable<ApiResponse<{ logs: AuditLog[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ logs: AuditLog[]; pagination: PaginationMeta }>>(this.baseUrl, {
      params: this.buildParams(query ?? {}),
    });
  }

  getLogById(id: string): Observable<ApiResponse<{ log: AuditLog }>> {
    return this.http.get<ApiResponse<{ log: AuditLog }>>(`${this.baseUrl}/${id}`);
  }

  private buildParams(query: Partial<AuditLogListQuery>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
