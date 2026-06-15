import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  CreateUserRequest,
  ManagedUser,
  PaginationMeta,
  UpdateUserRequest,
  UserListQuery,
} from '../../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getUsers(query: UserListQuery): Observable<ApiResponse<{ users: ManagedUser[]; pagination: PaginationMeta }>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('limit', query.limit)
      .set('sortBy', query.sortBy)
      .set('sortOrder', query.sortOrder);

    if (query.search) params = params.set('search', query.search);
    if (query.role) params = params.set('role', query.role);
    if (query.isActive) params = params.set('isActive', query.isActive);
    if (query.isEmailVerified) params = params.set('isEmailVerified', query.isEmailVerified);

    return this.http.get<ApiResponse<{ users: ManagedUser[]; pagination: PaginationMeta }>>(
      this.baseUrl,
      { params },
    );
  }

  getUserById(id: string): Observable<ApiResponse<{ user: ManagedUser }>> {
    return this.http.get<ApiResponse<{ user: ManagedUser }>>(`${this.baseUrl}/${id}`);
  }

  createUser(payload: CreateUserRequest): Observable<ApiResponse<{ user: ManagedUser }>> {
    return this.http.post<ApiResponse<{ user: ManagedUser }>>(this.baseUrl, payload);
  }

  updateUser(id: string, payload: UpdateUserRequest): Observable<ApiResponse<{ user: ManagedUser }>> {
    return this.http.put<ApiResponse<{ user: ManagedUser }>>(`${this.baseUrl}/${id}`, payload);
  }

  deleteUser(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/${id}`);
  }
}
