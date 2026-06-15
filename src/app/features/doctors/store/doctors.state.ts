import {
  DEFAULT_DOCTOR_LIST_QUERY,
  DEFAULT_DOCTOR_SEARCH_QUERY,
  Doctor,
  DoctorListQuery,
  DoctorSearchQuery,
  DoctorSearchResult,
} from '../../../core/models/doctor.model';

export interface DoctorsState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  myProfile: Doctor | null;
  searchResults: DoctorSearchResult[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  searchPagination: { page: number; limit: number; total: number; totalPages: number };
  query: DoctorListQuery;
  searchQuery: DoctorSearchQuery;
  loading: boolean;
  searchLoading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const DOCTORS_FEATURE_KEY = 'doctors';

export const initialDoctorsState: DoctorsState = {
  doctors: [],
  selectedDoctor: null,
  myProfile: null,
  searchResults: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  searchPagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
  query: { ...DEFAULT_DOCTOR_LIST_QUERY },
  searchQuery: { ...DEFAULT_DOCTOR_SEARCH_QUERY },
  loading: false,
  searchLoading: false,
  saving: false,
  error: null,
  successMessage: null,
};
