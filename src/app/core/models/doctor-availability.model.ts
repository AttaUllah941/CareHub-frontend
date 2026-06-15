export interface AvailabilityBreak {
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  breaks: AvailabilityBreak[];
}

export interface VacationDate {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface DoctorAvailability {
  id: string;
  doctorProfileId: string;
  slotDurationMinutes: number;
  weeklySchedule: DaySchedule[];
  vacationDates: VacationDate[];
  timezone: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}

export interface SlotsResponse {
  date: string;
  slots: AvailabilitySlot[];
  slotDurationMinutes: number;
}

export interface UpdateAvailabilityRequest {
  slotDurationMinutes?: number;
  weeklySchedule?: DaySchedule[];
  vacationDates?: VacationDate[];
  timezone?: string;
  isActive?: boolean;
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const SLOT_DURATION_OPTIONS = [15, 20, 30, 45, 60, 90, 120];

export const DEFAULT_WEEKLY_SCHEDULE: DaySchedule[] = [
  { dayOfWeek: 0, isAvailable: false, startTime: '09:00', endTime: '17:00', breaks: [] },
  { dayOfWeek: 1, isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 2, isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 3, isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 4, isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 5, isAvailable: true, startTime: '09:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 6, isAvailable: false, startTime: '09:00', endTime: '17:00', breaks: [] },
];
