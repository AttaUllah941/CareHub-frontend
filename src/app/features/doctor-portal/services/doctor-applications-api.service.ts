import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import {
  CreateDoctorApplicationRequest,
  DoctorApplicationResponse,
} from '../models/doctor-api.model';

@Injectable({ providedIn: 'root' })
export class DoctorApplicationsApiService {
  private readonly api = inject(ApiClientService);

  create(
    payload: CreateDoctorApplicationRequest,
  ): Observable<DoctorApplicationResponse> {
    return this.api
      .post<{ application: DoctorApplicationResponse }>('/doctor-applications', payload)
      .pipe(map((res: ApiResponse<{ application: DoctorApplicationResponse }>) => res.data.application));
  }
}
