export interface ClinicWorkingDay {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breaks: { startTime: string; endTime: string }[];
}

export const DEFAULT_CLINIC_WORKING_HOURS: ClinicWorkingDay[] = [
  { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '17:00', breaks: [] },
  { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
  { dayOfWeek: 6, isOpen: false, openTime: '09:00', closeTime: '17:00', breaks: [] },
];
