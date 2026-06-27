export interface MedicalSpecialty {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
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

export interface MedicalSpecialtyListQuery {
  page: number;
  limit: number;
  search: string;
  isActive: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreateMedicalSpecialtyRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateMedicalSpecialtyRequest {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export const DEFAULT_MEDICAL_SPECIALTY_LIST_QUERY: MedicalSpecialtyListQuery = {
  page: 1,
  limit: 10,
  search: '',
  isActive: '',
  sortBy: 'name',
  sortOrder: 'asc',
};
