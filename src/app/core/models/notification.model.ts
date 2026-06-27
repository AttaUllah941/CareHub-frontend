import { PaginationMeta } from './doctor.model';

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  unreadOnly?: boolean | 'true' | 'false';
}

export interface NotificationListResponse {
  notifications: AppNotification[];
  pagination: PaginationMeta;
}
