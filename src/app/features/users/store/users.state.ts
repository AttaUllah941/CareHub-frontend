import { ManagedUser, UserListQuery, DEFAULT_USER_LIST_QUERY } from '../../../core/models/user.model';

export interface UsersState {
  users: ManagedUser[];
  selectedUser: ManagedUser | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query: UserListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const USERS_FEATURE_KEY = 'users';

export const initialUsersState: UsersState = {
  users: [],
  selectedUser: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_USER_LIST_QUERY },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
