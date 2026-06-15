export type NotificationType =
  | 'APPOINTMENT_BOOKED'
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'APPOINTMENT_REMINDER'
  | 'PRESCRIPTION_READY';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
export type NotificationDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface NotificationDelivery {
  id?: string;
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  sentAt?: string | null;
  error?: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  readAt?: string | null;
  scheduledFor?: string | null;
  sentAt?: string | null;
  deliveries: NotificationDelivery[];
  metadata?: {
    appointmentId?: string;
    prescriptionId?: string;
    consultationId?: string;
    actionUrl?: string;
  };
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  appointmentReminders: boolean;
  prescriptionAlerts: boolean;
  reminderLeadMinutes: number[];
}

export interface NotificationListQuery {
  page: number;
  limit: number;
  unreadOnly: string;
  userId: string;
  type: string;
  search: string;
  admin?: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  appointmentReminders?: boolean;
  prescriptionAlerts?: boolean;
  reminderLeadMinutes?: number[];
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  APPOINTMENT_BOOKED: 'Appointment Booked',
  APPOINTMENT_CONFIRMED: 'Appointment Confirmed',
  APPOINTMENT_CANCELLED: 'Appointment Cancelled',
  APPOINTMENT_RESCHEDULED: 'Appointment Rescheduled',
  APPOINTMENT_REMINDER: 'Appointment Reminder',
  PRESCRIPTION_READY: 'Prescription Ready',
};

export const DEFAULT_NOTIFICATION_LIST_QUERY: NotificationListQuery = {
  page: 1,
  limit: 20,
  unreadOnly: '',
  userId: '',
  type: '',
  search: '',
};

export function notificationTypeLabel(type: NotificationType): string {
  return NOTIFICATION_TYPE_LABELS[type] ?? type;
}

export function formatNotificationDate(date: string): string {
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function channelLabel(channel: NotificationChannel): string {
  switch (channel) {
    case 'EMAIL':
      return 'Email';
    case 'SMS':
      return 'SMS';
    case 'PUSH':
      return 'Push';
    case 'IN_APP':
      return 'In-App';
    default:
      return channel;
  }
}
