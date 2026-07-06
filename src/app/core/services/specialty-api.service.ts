import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { ApiResponse } from '../models/api.model';
import { MedicalSpecialty } from '../models/medical-specialty.model';

@Injectable({ providedIn: 'root' })
export class SpecialtyApiService {
  private readonly api = inject(ApiClientService);

  listPublic(search?: string): Observable<ApiResponse<{ specialties: MedicalSpecialty[] }>> {
    return this.api.get<{ specialties: MedicalSpecialty[] }>('/medical-specialties/public', {
      params: {
        ...(search ? { search } : {}),
        _t: Date.now(),
      },
      skipLoading: true,
    });
  }

  getBySlug(slug: string): Observable<ApiResponse<{ specialty: MedicalSpecialty }>> {
    return this.api.get<{ specialty: MedicalSpecialty }>(`/medical-specialties/public/${slug}`, {
      skipLoading: true,
    });
  }
}
