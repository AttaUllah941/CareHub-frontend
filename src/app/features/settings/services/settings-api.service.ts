import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  EmailSettings,
  FeatureFlags,
  GeneralSettings,
  PaymentSettings,
  PublicSettings,
  SmsSettings,
  SystemSettings,
} from '../../../core/models/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/settings`;

  getSettings(): Observable<ApiResponse<{ settings: SystemSettings }>> {
    return this.http.get<ApiResponse<{ settings: SystemSettings }>>(this.baseUrl);
  }

  getPublicSettings(): Observable<ApiResponse<{ settings: PublicSettings }>> {
    return this.http.get<ApiResponse<{ settings: PublicSettings }>>(`${this.baseUrl}/public`);
  }

  updateGeneral(payload: Partial<GeneralSettings>): Observable<ApiResponse<{ settings: SystemSettings; message: string }>> {
    return this.http.put<ApiResponse<{ settings: SystemSettings; message: string }>>(`${this.baseUrl}/general`, payload);
  }

  updateEmail(payload: Partial<EmailSettings>): Observable<ApiResponse<{ settings: SystemSettings; message: string }>> {
    return this.http.put<ApiResponse<{ settings: SystemSettings; message: string }>>(`${this.baseUrl}/email`, payload);
  }

  updateSms(payload: Partial<SmsSettings>): Observable<ApiResponse<{ settings: SystemSettings; message: string }>> {
    return this.http.put<ApiResponse<{ settings: SystemSettings; message: string }>>(`${this.baseUrl}/sms`, payload);
  }

  updatePayment(payload: Partial<PaymentSettings>): Observable<ApiResponse<{ settings: SystemSettings; message: string }>> {
    return this.http.put<ApiResponse<{ settings: SystemSettings; message: string }>>(`${this.baseUrl}/payment`, payload);
  }

  updateFeatureFlags(payload: Partial<FeatureFlags>): Observable<ApiResponse<{ settings: SystemSettings; message: string }>> {
    return this.http.put<ApiResponse<{ settings: SystemSettings; message: string }>>(`${this.baseUrl}/feature-flags`, payload);
  }
}
