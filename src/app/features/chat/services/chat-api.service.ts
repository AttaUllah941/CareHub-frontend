import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import {
  ChatConversation,
  ChatListQuery,
  ChatMessage,
  ChatMessagesQuery,
  CreateConversationRequest,
} from '../../../core/models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/chat`;

  getConversations(query?: Partial<ChatListQuery>): Observable<
    ApiResponse<{ conversations: ChatConversation[]; pagination: PaginationMeta }>
  > {
    return this.http.get<ApiResponse<{ conversations: ChatConversation[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/conversations`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  createConversation(payload: CreateConversationRequest): Observable<ApiResponse<{ conversation: ChatConversation }>> {
    return this.http.post<ApiResponse<{ conversation: ChatConversation }>>(`${this.baseUrl}/conversations`, payload);
  }

  getConversation(id: string): Observable<ApiResponse<{ conversation: ChatConversation }>> {
    return this.http.get<ApiResponse<{ conversation: ChatConversation }>>(`${this.baseUrl}/conversations/${id}`);
  }

  getMessages(
    conversationId: string,
    query?: Partial<ChatMessagesQuery>,
  ): Observable<ApiResponse<{ messages: ChatMessage[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ messages: ChatMessage[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/conversations/${conversationId}/messages`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  sendMessage(conversationId: string, content: string): Observable<ApiResponse<{ message: ChatMessage }>> {
    return this.http.post<ApiResponse<{ message: ChatMessage }>>(
      `${this.baseUrl}/conversations/${conversationId}/messages`,
      { content },
    );
  }

  uploadAttachment(conversationId: string, file: File, caption?: string): Observable<ApiResponse<{ message: ChatMessage }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) formData.append('caption', caption);
    return this.http.post<ApiResponse<{ message: ChatMessage }>>(
      `${this.baseUrl}/conversations/${conversationId}/attachments`,
      formData,
    );
  }

  markRead(conversationId: string, messageId?: string): Observable<ApiResponse<unknown>> {
    return this.http.patch<ApiResponse<unknown>>(`${this.baseUrl}/conversations/${conversationId}/read`, {
      messageId,
    });
  }

  downloadAttachment(messageId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/messages/${messageId}/download`, { responseType: 'blob' });
  }

  private buildParams(query: Record<string, string | number | boolean | undefined>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
