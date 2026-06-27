import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { ApiResponse } from '../models/api.model';
import { Language } from '../models/language.model';

@Injectable({ providedIn: 'root' })
export class LanguageApiService {
  private readonly api = inject(ApiClientService);

  listPublic(search?: string): Observable<ApiResponse<{ languages: Language[] }>> {
    return this.api.get<{ languages: Language[] }>('/languages/public', {
      params: search ? { search } : undefined,
      skipLoading: true,
    });
  }

  getByCode(code: string): Observable<ApiResponse<{ language: Language }>> {
    return this.api.get<{ language: Language }>(`/languages/public/${code}`, {
      skipLoading: true,
    });
  }
}
