export interface Language {
  id: string;
  name: string;
  code: string;
  nativeName?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LanguageListQuery {
  page: number;
  limit: number;
  search: string;
  isActive: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreateLanguageRequest {
  name: string;
  code: string;
  nativeName?: string;
  description?: string;
}

export interface UpdateLanguageRequest {
  name?: string;
  code?: string;
  nativeName?: string;
  description?: string;
  isActive?: boolean;
}

export const DEFAULT_LANGUAGE_LIST_QUERY: LanguageListQuery = {
  page: 1,
  limit: 10,
  search: '',
  isActive: '',
  sortBy: 'name',
  sortOrder: 'asc',
};
