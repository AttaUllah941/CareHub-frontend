export type ReportType = 'REVENUE' | 'DOCTORS' | 'PATIENTS' | 'APPOINTMENTS';

export type ExportFormat = 'pdf' | 'excel';

export interface ReportMeta {
  fromDate: string | null;
  toDate: string | null;
  generatedAt: string;
}

export interface ReportQuery {
  fromDate: string;
  toDate: string;
  status?: string;
  verificationStatus?: string;
}

export interface RevenueReportRow {
  id: string;
  gateway: string;
  amount: number;
  refundAmount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  patient: string;
  doctor: string;
  appointmentDate?: string | null;
}

export interface RevenueReport {
  type: 'REVENUE';
  meta: ReportMeta;
  summary: {
    totalAmount: number;
    refundAmount: number;
    netAmount: number;
    transactionCount: number;
    currency: string;
  };
  byGateway: { gateway: string; amount: number; count: number }[];
  byMonth: { period: string; amount: number; count: number }[];
  rows: RevenueReportRow[];
}

export interface DoctorReportRow {
  id: string;
  name: string;
  email?: string;
  title?: string;
  verificationStatus: string;
  consultationFee?: number;
  yearsOfExperience?: number;
  city?: string;
  specialties?: string;
  appointmentCount: number;
  createdAt: string;
}

export interface DoctorReport {
  type: 'DOCTORS';
  meta: ReportMeta;
  summary: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
    avgConsultationFee: number;
  };
  byVerificationStatus: { status: string; count: number }[];
  bySpecialty: { specialtyId?: string; name: string; count: number }[];
  rows: DoctorReportRow[];
}

export interface PatientReportRow {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  gender?: string;
  isActive: boolean;
  appointmentCount: number;
  createdAt: string;
}

export interface PatientReport {
  type: 'PATIENTS';
  meta: ReportMeta;
  summary: { total: number; active: number; inactive: number };
  byCity: { city: string; count: number }[];
  rows: PatientReportRow[];
}

export interface AppointmentReportRow {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus?: string;
  consultationFee?: number;
  currency?: string;
  patient: string;
  doctor: string;
  clinic?: string;
  createdAt: string;
}

export interface AppointmentReport {
  type: 'APPOINTMENTS';
  meta: ReportMeta;
  summary: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  byStatus: { status: string; count: number }[];
  byMonth: { period: string; count: number }[];
  rows: AppointmentReportRow[];
}

export type AnyReport = RevenueReport | DoctorReport | PatientReport | AppointmentReport;

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'REVENUE', label: 'Revenue' },
  { value: 'DOCTORS', label: 'Doctors' },
  { value: 'PATIENTS', label: 'Patients' },
  { value: 'APPOINTMENTS', label: 'Appointments' },
];

export const DEFAULT_REPORT_QUERY: ReportQuery = {
  fromDate: '',
  toDate: '',
  status: '',
  verificationStatus: '',
};

export function defaultDateRange(): { fromDate: string; toDate: string } {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  return {
    fromDate: from.toISOString().slice(0, 10),
    toDate: to.toISOString().slice(0, 10),
  };
}
