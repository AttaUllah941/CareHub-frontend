export interface Permission {
  id: string;
  name: string;
  slug: string;
  module: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: Permission[];
  permissionCount?: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoleListQuery {
  page: number;
  limit: number;
  search: string;
  isActive: '' | 'true' | 'false';
  isSystem: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PermissionListQuery {
  page: number;
  limit: number;
  search: string;
  module: string;
  isActive: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreateRoleRequest {
  name: string;
  slug: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreatePermissionRequest {
  name: string;
  slug: string;
  module: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  slug?: string;
  module?: string;
  description?: string;
  isActive?: boolean;
}

export interface AssignPermissionsRequest {
  permissionIds: string[];
}

export interface AssignRoleRequest {
  userId: string;
}

export const DEFAULT_ROLE_LIST_QUERY: RoleListQuery = {
  page: 1,
  limit: 10,
  search: '',
  isActive: '',
  isSystem: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const DEFAULT_PERMISSION_LIST_QUERY: PermissionListQuery = {
  page: 1,
  limit: 20,
  search: '',
  module: '',
  isActive: '',
  sortBy: 'module',
  sortOrder: 'asc',
};

export const PERMISSION_MODULES = ['users', 'roles', 'permissions', 'appointments', 'clinics'] as const;
