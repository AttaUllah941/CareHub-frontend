export interface DoctorDashboardStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  newThisMonth: number;
}

export interface PatientDashboardStats {
  total: number;
  active: number;
  newThisMonth: number;
}

export interface AppointmentDashboardStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
  thisMonth: number;
}

export interface RevenueDashboardStats {
  total: number;
  refunded: number;
  net: number;
  currency: string;
  thisMonth: number;
  lastMonth: number;
}

export interface PendingApprovalStats {
  doctors: number;
  reviews: number;
  appointments: number;
  total: number;
}

export interface PendingDoctorSummary {
  id: string;
  title?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  verificationStatus: string;
  createdAt: string;
  user?: { firstName?: string; lastName?: string; email?: string };
  specialties?: { id: string; name: string }[];
}

export interface RecentAppointmentSummary {
  id: string;
  appointmentDate: string;
  startTime: string;
  status: string;
  consultationFee?: number;
  currency?: string;
  createdAt: string;
  patient?: { firstName?: string; lastName?: string };
  doctor?: { title?: string; firstName?: string; lastName?: string };
  clinic?: { name?: string };
}

export interface AdminDashboardStats {
  doctors: DoctorDashboardStats;
  patients: PatientDashboardStats;
  appointments: AppointmentDashboardStats;
  revenue: RevenueDashboardStats;
  pendingApprovals: PendingApprovalStats;
  recentPendingDoctors: PendingDoctorSummary[];
  recentAppointments: RecentAppointmentSummary[];
  generatedAt: string;
}

export function formatDashboardAmount(amount: number, currency = 'PKR'): string {
  if (amount >= 1_000_000) {
    return `${currency} ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${currency} ${(amount / 1_000).toFixed(1)}K`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export function revenueChangePercent(thisMonth: number, lastMonth: number): number | null {
  if (lastMonth === 0) return thisMonth > 0 ? 100 : null;
  return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
}
