import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClientService } from '../api/api-client.service';
import { ApiResponse } from '../models/api.model';
import { UploadResult } from '../models/upload.model';
import { resolveAssetUrl } from '../utils/asset-url.util';

@Injectable({ providedIn: 'root' })
export class UploadsApiService {
  private readonly api = inject(ApiClientService);

  uploadFile(file: File): Observable<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.postFormData<UploadResult>('/uploads', formData).pipe(
      map((res: ApiResponse<UploadResult>) => ({
        ...res.data,
        url: resolveAssetUrl(res.data.url),
      })),
    );
  }

  uploadApplicationFile(file: File): Observable<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.postFormData<UploadResult>('/uploads/application', formData).pipe(
      map((res: ApiResponse<UploadResult>) => ({
        ...res.data,
        url: resolveAssetUrl(res.data.url),
      })),
    );
  }
}
