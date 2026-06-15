import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  AssignPermissionsRequest,
  AssignRoleRequest,
  CreatePermissionRequest,
  CreateRoleRequest,
  PaginationMeta,
  Permission,
  PermissionListQuery,
  Role,
  RoleListQuery,
  UpdatePermissionRequest,
  UpdateRoleRequest,
} from '../../../core/models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/rbac`;

  // ─── Roles ───────────────────────────────────────────────
  getRoles(query: RoleListQuery): Observable<ApiResponse<{ roles: Role[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ roles: Role[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/roles`,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getRoleById(id: string): Observable<ApiResponse<{ role: Role }>> {
    return this.http.get<ApiResponse<{ role: Role }>>(`${this.baseUrl}/roles/${id}`);
  }

  createRole(payload: CreateRoleRequest): Observable<ApiResponse<{ role: Role }>> {
    return this.http.post<ApiResponse<{ role: Role }>>(`${this.baseUrl}/roles`, payload);
  }

  updateRole(id: string, payload: UpdateRoleRequest): Observable<ApiResponse<{ role: Role }>> {
    return this.http.put<ApiResponse<{ role: Role }>>(`${this.baseUrl}/roles/${id}`, payload);
  }

  deleteRole(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/roles/${id}`);
  }

  assignPermissions(id: string, payload: AssignPermissionsRequest): Observable<ApiResponse<{ role: Role }>> {
    return this.http.put<ApiResponse<{ role: Role }>>(`${this.baseUrl}/roles/${id}/permissions`, payload);
  }

  assignRoleToUser(id: string, payload: AssignRoleRequest): Observable<ApiResponse<{ user: unknown; role: Role }>> {
    return this.http.post<ApiResponse<{ user: unknown; role: Role }>>(`${this.baseUrl}/roles/${id}/assign`, payload);
  }

  // ─── Permissions ─────────────────────────────────────────
  getAllPermissions(): Observable<ApiResponse<{ permissions: Permission[] }>> {
    return this.http.get<ApiResponse<{ permissions: Permission[] }>>(`${this.baseUrl}/permissions/all`);
  }

  getPermissions(
    query: PermissionListQuery,
  ): Observable<ApiResponse<{ permissions: Permission[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ permissions: Permission[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/permissions`,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getPermissionById(id: string): Observable<ApiResponse<{ permission: Permission }>> {
    return this.http.get<ApiResponse<{ permission: Permission }>>(`${this.baseUrl}/permissions/${id}`);
  }

  createPermission(payload: CreatePermissionRequest): Observable<ApiResponse<{ permission: Permission }>> {
    return this.http.post<ApiResponse<{ permission: Permission }>>(`${this.baseUrl}/permissions`, payload);
  }

  updatePermission(id: string, payload: UpdatePermissionRequest): Observable<ApiResponse<{ permission: Permission }>> {
    return this.http.put<ApiResponse<{ permission: Permission }>>(`${this.baseUrl}/permissions/${id}`, payload);
  }

  deletePermission(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/permissions/${id}`);
  }

  private buildParams(query: Record<string, string | number>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
