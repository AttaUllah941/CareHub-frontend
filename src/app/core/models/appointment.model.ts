export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export type AppointmentPaymentStatus =
  | 'UNPAID'
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'NOT_REQUIRED';

export interface AppointmentPatient {
  id: string;
  user?: { firstName: string; lastName: string; email?: string; phone?: string };
}

export interface AppointmentDoctor {
  id: string;
  user?: { firstName: string; lastName: string };
  title?: string;
  specialties?: { id: string; name: string }[];
}

export interface AppointmentClinic {
  id: string;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
}

export interface AppointmentFamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

export interface Appointment {
  id: string;
  patientProfileId: string;
  familyMemberId?: string | null;
  doctorProfileId: string;
  clinicId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  consultationFee?: number;
  currency?: string;
  paymentStatus?: AppointmentPaymentStatus;
  paymentId?: string | null;
  bookedByUserId: string;
  patient?: AppointmentPatient;
  doctor?: AppointmentDoctor;
  clinic?: AppointmentClinic;
  familyMember?: AppointmentFamilyMember;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AppointmentListQuery {
  page: number;
  limit: number;
  patientProfileId: string;
  doctorProfileId: string;
  clinicId: string;
  status: '' | AppointmentStatus;
  fromDate: string;
  toDate: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface BookAppointmentRequest {
  doctorProfileId: string;
  clinicId: string;
  appointmentDate: string;
  startTime: string;
  familyMemberId?: string;
  reason?: string;
}

export interface UpdateAppointmentRequest {
  reason?: string;
  notes?: string;
}

export interface CancelAppointmentRequest {
  cancellationReason?: string;
}

export interface RescheduleAppointmentRequest {
  appointmentDate: string;
  startTime: string;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
}

export interface AvailableSlotsResponse {
  date: string;
  slots: { startTime: string; endTime: string }[];
  slotDurationMinutes: number;
  totalGenerated?: number;
  bookedCount?: number;
}

export interface RecurringDaySlots {
  date: string;
  slots: { startTime: string; endTime: string }[];
  slotDurationMinutes: number;
  totalGenerated?: number;
  bookedCount?: number;
  dayOfWeek: number;
  isRecurring: boolean;
}

export interface RecurringSlotsResponse {
  fromDate: string;
  toDate: string;
  slotDurationMinutes: number;
  days: RecurringDaySlots[];
  totalDays: number;
  totalAvailableSlots: number;
}

export const APPOINTMENT_STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'NO_SHOW', label: 'No Show' },
];

export const DEFAULT_APPOINTMENT_LIST_QUERY: AppointmentListQuery = {
  page: 1,
  limit: 10,
  patientProfileId: '',
  doctorProfileId: '',
  clinicId: '',
  status: '',
  fromDate: '',
  toDate: '',
  search: '',
  sortBy: 'appointmentDate',
  sortOrder: 'desc',
};

export function appointmentStatusLabel(status: AppointmentStatus): string {
  return APPOINTMENT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function appointmentStatusClass(status: AppointmentStatus): string {
  const map: Record<AppointmentStatus, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700',
    CONFIRMED: 'bg-blue-50 text-blue-700',
    CANCELLED: 'bg-red-50 text-red-700',
    COMPLETED: 'bg-green-50 text-green-700',
    NO_SHOW: 'bg-gray-100 text-gray-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700';
}

export function formatAppointmentDateTime(date: string, startTime: string): string {
  const d = new Date(date);
  return `${d.toLocaleDateString()} at ${startTime}`;
}
