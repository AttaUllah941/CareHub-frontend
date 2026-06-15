import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { VideoChatMessage, VideoSession, VideoSessionResponse } from '../../../core/models/video-consultation.model';

@Injectable({ providedIn: 'root' })
export class VideoConsultationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/video-consultations`;

  createOrJoinSession(appointmentId: string): Observable<ApiResponse<VideoSessionResponse>> {
    return this.http.post<ApiResponse<VideoSessionResponse>>(
      `${this.baseUrl}/appointment/${appointmentId}/session`,
      {},
    );
  }

  getSession(sessionId: string): Observable<ApiResponse<VideoSessionResponse>> {
    return this.http.get<ApiResponse<VideoSessionResponse>>(`${this.baseUrl}/session/${sessionId}`);
  }

  getSessionByAppointment(appointmentId: string): Observable<ApiResponse<VideoSessionResponse>> {
    return this.http.get<ApiResponse<VideoSessionResponse>>(
      `${this.baseUrl}/appointment/${appointmentId}/session`,
    );
  }

  endSession(sessionId: string): Observable<ApiResponse<{ session: VideoSession }>> {
    return this.http.post<ApiResponse<{ session: VideoSession }>>(`${this.baseUrl}/session/${sessionId}/end`, {});
  }

  getMessages(sessionId: string): Observable<ApiResponse<{ messages: VideoChatMessage[] }>> {
    return this.http.get<ApiResponse<{ messages: VideoChatMessage[] }>>(
      `${this.baseUrl}/session/${sessionId}/messages`,
    );
  }

  startRecording(sessionId: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/session/${sessionId}/recording/start`, {});
  }

  stopRecording(
    sessionId: string,
    payload?: { storageKey?: string; fileSizeBytes?: number; durationSeconds?: number },
  ): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/session/${sessionId}/recording/stop`, payload ?? {});
  }
}
