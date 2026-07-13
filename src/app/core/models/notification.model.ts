import { PaginationMeta } from './doctor.model';

export interface NotificationData {
  appointmentId?: string | null;
  applicationId?: string | null;
  consultationType?: string | null;
  rejectionReason?: string | null;
  link?: string | null;
  [key: string]: unknown;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: NotificationData;
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
