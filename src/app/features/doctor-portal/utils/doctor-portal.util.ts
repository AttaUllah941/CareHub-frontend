import { Appointment } from '../../../core/models/appointment.model';
import { resolveAssetUrl } from '../../../core/utils/asset-url.util';
import {
  ApiClinic,
  ApiDoctorProfile,
  ApiSchedule,
} from '../models/doctor-api.model';
import {
  AvailabilitySlot,
  ConsultationStats,
  DAY_OPTIONS,
  DoctorAppointment,
  DoctorPatientRecord,
  DoctorPortalProfile,
  EarningsSummary,
} from '../models/doctor-portal.model';

export function time24hTo12h(time: string): string {
  const [hourPart, minutePart] = time.split(':');
  let hours = Number(hourPart);
  const minutes = minutePart ?? '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  if (hours === 0) hours = 12;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

export function time12hTo24h(slot: string): string {
  const match = slot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return slot;
  let hours = Number(match[1]);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

export function mapSchedulesToAvailability(schedules: ApiSchedule[]): AvailabilitySlot[] {
  const byDay = new Map<number, ApiSchedule>();

  for (const schedule of schedules) {
    if (!schedule.isActive || schedule.dayOfWeek == null) continue;
    byDay.set(schedule.dayOfWeek, schedule);
  }

  return [...byDay.entries()]
    .map(([day, schedule]) => ({
      day,
      dayLabel: DAY_OPTIONS.find((option) => option.value === day)?.label ?? `Day ${day}`,
      startTime: time24hTo12h(schedule.startTime),
      endTime: time24hTo12h(schedule.endTime),
    }))
    .sort((a, b) => a.day - b.day);
}

export function mapToPortalProfile(
  doctor: ApiDoctorProfile,
  clinic: ApiClinic | null,
  schedules: ApiSchedule[],
): DoctorPortalProfile {
  const user = doctor.user;

  return {
    id: doctor.id,
    applicationId: '',
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() : doctor.title,
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    specialization: doctor.title || doctor.specialties[0]?.name || '',
    qualifications: (doctor.qualifications ?? []).map((q) => ({
      degree: q.degree,
      institution: q.institution,
      year: q.year ?? null,
    })),
    yearsOfExperience: doctor.yearsOfExperience ?? 0,
    clinic: clinic
      ? {
          name: clinic.name,
          address: clinic.address,
          city: clinic.city,
          phone: '',
        }
      : {
          name: '',
          address: '',
          city: doctor.city ?? '',
          phone: '',
        },
    consultationFee: doctor.consultationFee ?? 0,
    videoConsultationFee: doctor.consultationFee ?? 0,
    availability: mapSchedulesToAvailability(schedules),
    profilePhotoUrl: doctor.profileImageUrl ? resolveAssetUrl(doctor.profileImageUrl) : undefined,
    bio: doctor.bio,
  };
}

function mapAppointmentStatus(status: Appointment['status']): DoctorAppointment['status'] {
  if (status === 'confirmed') return 'accepted';
  return status;
}

export function mapApiAppointment(appointment: Appointment, fee: number): DoctorAppointment {
  const scheduled = new Date(appointment.scheduledAt);

  return {
    id: appointment.id,
    doctorId: appointment.doctorId,
    patientId: appointment.patientId ?? null,
    patientName: appointment.patientName,
    patientPhone: appointment.patientPhone ?? '',
    patientAge: 0,
    patientGender: '',
    type: appointment.consultationType === 'clinic' ? 'clinic' : 'video',
    date: scheduled.toISOString().split('T')[0],
    timeSlot: scheduled.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
    status: mapAppointmentStatus(appointment.status),
    fee,
    createdAt: appointment.createdAt ?? appointment.scheduledAt,
  };
}

export function buildPatientsFromAppointments(appointments: DoctorAppointment[]): DoctorPatientRecord[] {
  const patients = new Map<string, DoctorPatientRecord>();

  for (const appointment of appointments) {
    const key = appointment.patientId || appointment.patientName.trim().toLowerCase() || appointment.id;
    if (!appointment.patientName.trim()) continue;

    const existing = patients.get(key);
    if (!existing) {
      patients.set(key, {
        id: appointment.patientId || key,
        doctorId: appointment.doctorId,
        name: appointment.patientName,
        age: 0,
        gender: '—',
        phone: appointment.patientPhone || '—',
        lastVisit: appointment.date,
        conditions: [],
        visitCount: 1,
      });
      continue;
    }

    existing.visitCount += 1;
    if (appointment.patientPhone) {
      existing.phone = appointment.patientPhone;
    }
    if (appointment.date > existing.lastVisit) {
      existing.lastVisit = appointment.date;
    }
  }

  return [...patients.values()].sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
}

export function buildConsultationStats(
  appointments: DoctorAppointment[],
  averageRating: number,
  totalReviews: number,
): ConsultationStats {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const completed = appointments.filter((a) => a.status === 'completed');
  const completedThisMonth = completed.filter((a) => {
    const d = new Date(a.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  return {
    totalConsultations: completed.length,
    videoConsultations: completed.filter((a) => a.type === 'video').length,
    clinicVisits: completed.filter((a) => a.type === 'clinic').length,
    completedThisMonth: completedThisMonth.length,
    pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
    averageRating,
    totalReviews,
  };
}

export function buildEarningsSummary(
  appointments: DoctorAppointment[],
  currency: string,
): EarningsSummary {
  const completed = appointments.filter((a) => a.status === 'completed');
  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();

  const total = completed.reduce((sum, a) => sum + a.fee, 0);
  const monthTotal = completed
    .filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === thisMonth && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, a) => sum + a.fee, 0);
  const lastMonthTotal = completed
    .filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((sum, a) => sum + a.fee, 0);
  const pending = appointments
    .filter((a) => a.status === 'accepted')
    .reduce((sum, a) => sum + a.fee, 0);

  const recent = completed
    .slice(-5)
    .reverse()
    .map((a) => ({
      id: a.id,
      date: a.date,
      patientName: a.patientName,
      type: a.type,
      amount: a.fee,
      status: 'paid' as const,
    }));

  return {
    totalEarnings: total,
    thisMonth: monthTotal,
    lastMonth: lastMonthTotal,
    pendingPayout: pending,
    currency,
    recentTransactions: recent,
  };
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: 'Doctor', lastName: 'User' };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function normalizeUploadMimeType(mimeType: string): 'application/pdf' | 'image/jpeg' | 'image/png' {
  if (mimeType === 'image/jpg') return 'image/jpeg';
  if (mimeType === 'image/jpeg' || mimeType === 'image/png' || mimeType === 'application/pdf') {
    return mimeType;
  }
  return 'application/pdf';
}
