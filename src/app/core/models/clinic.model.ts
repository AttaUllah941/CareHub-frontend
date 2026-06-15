import { PaginationMeta } from './medical-specialty.model';
import { DaySchedule, DEFAULT_WEEKLY_SCHEDULE } from './doctor-availability.model';

export interface ClinicLocation {
  latitude?: number;
  longitude?: number;
}

export interface ClinicWorkingDay {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breaks: { startTime: string; endTime: string }[];
}

export interface ClinicManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ClinicDoctor {
  id: string;
  userId: string;
  title?: string;
  licenseNumber?: string;
  verificationStatus?: string;
  isActive: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  specialties?: { id: string; name: string; slug: string }[];
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  location: ClinicLocation;
  workingHours: ClinicWorkingDay[];
  doctorProfileIds: string[];
  doctors?: ClinicDoctor[];
  managerId?: string | null;
  manager?: ClinicManager | null;
  mapUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicListQuery {
  page: number;
  limit: number;
  search: string;
  city: string;
  country: string;
  isActive: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreateClinicRequest {
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  location?: ClinicLocation;
  workingHours?: ClinicWorkingDay[];
  doctorProfileIds?: string[];
  managerId?: string;
}

export interface UpdateClinicRequest extends Partial<CreateClinicRequest> {
  isActive?: boolean;
}

export const DEFAULT_CLINIC_LIST_QUERY: ClinicListQuery = {
  page: 1,
  limit: 10,
  search: '',
  city: '',
  country: '',
  isActive: '',
  sortBy: 'name',
  sortOrder: 'asc',
};

export const DEFAULT_CLINIC_WORKING_HOURS: ClinicWorkingDay[] = [
  { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '17:00', breaks: [] },
  { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 6, isOpen: false, openTime: '09:00', closeTime: '17:00', breaks: [] },
];

export function workingHoursToSchedule(hours: ClinicWorkingDay[]): DaySchedule[] {
  return hours.map((h) => ({
    dayOfWeek: h.dayOfWeek,
    isAvailable: h.isOpen,
    startTime: h.openTime,
    endTime: h.closeTime,
    breaks: h.breaks ?? [],
  }));
}

export function scheduleToWorkingHours(schedule: DaySchedule[]): ClinicWorkingDay[] {
  return schedule.map((s) => ({
    dayOfWeek: s.dayOfWeek,
    isOpen: s.isAvailable,
    openTime: s.startTime,
    closeTime: s.endTime,
    breaks: s.breaks ?? [],
  }));
}

export function defaultWorkingHoursFromWeekly(): ClinicWorkingDay[] {
  return scheduleToWorkingHours(DEFAULT_WEEKLY_SCHEDULE.map((d) => ({
    ...d,
    isAvailable: d.dayOfWeek >= 1 && d.dayOfWeek <= 5,
    startTime: '08:00',
    endTime: '18:00',
  })));
}

export type { PaginationMeta };
