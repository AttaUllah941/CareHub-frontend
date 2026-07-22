import { UserRole } from '../models/auth.model';
import { AppNotification } from '../models/notification.model';

/** Resolve where a notification should navigate based on type + user role. */
export function resolveNotificationRoute(
  notification: AppNotification,
  role: UserRole | string | null | undefined,
): string | null {
  const fromData = notification.data?.link;

  switch (notification.type) {
    case 'appointment_booked':
      if (role === UserRole.DOCTOR) return '/doctor/appointments';
      if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) return '/admin/dashboard';
      return typeof fromData === 'string' ? fromData : '/doctor/appointments';

    case 'appointment_confirmed':
    case 'appointment_cancelled':
    case 'appointment_rejected':
      if (role === UserRole.DOCTOR) return '/doctor/appointments';
      return '/my-appointments';

    case 'application_approved':
      return '/doctor/dashboard';

    case 'application_rejected':
      return '/join-as-doctor';

    default:
      if (typeof fromData === 'string' && fromData.startsWith('/')) return fromData;
      if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) return '/admin/dashboard';
      if (role === UserRole.DOCTOR) return '/doctor/dashboard';
      if (role === UserRole.PHARMACY) return '/pharmacy/orders';
      return '/my-appointments';
  }
}

export function notificationTypeLabel(type: string): string {
  switch (type) {
    case 'appointment_booked':
      return 'New booking';
    case 'appointment_confirmed':
      return 'Confirmed';
    case 'appointment_cancelled':
      return 'Cancelled';
    case 'appointment_rejected':
      return 'Not accepted';
    case 'application_approved':
      return 'Approved';
    case 'application_rejected':
      return 'Rejected';
    default:
      return 'Update';
  }
}
