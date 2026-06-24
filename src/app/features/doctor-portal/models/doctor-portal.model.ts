export type DoctorApplicationStatus = 'pending' | 'approved' | 'rejected';

export type AppointmentStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type AppointmentType = 'clinic' | 'video';

export interface UploadedDocument {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
}

export interface DoctorQualificationEntry {
  degree: string;
  institution: string;
  year: number | null;
}

export interface ClinicInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
}

export interface AvailabilitySlot {
  day: number;
  dayLabel: string;
  startTime: string;
  endTime: string;
}

export interface DoctorRegistrationApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  qualifications: DoctorQualificationEntry[];
  yearsOfExperience: number;
  clinic: ClinicInfo;
  consultationFee: number;
  videoConsultationFee: number;
  availability: AvailabilitySlot[];
  documents: {
    medicalLicense?: UploadedDocument;
    certifications?: UploadedDocument;
    profilePhoto?: UploadedDocument;
    identityProof?: UploadedDocument;
  };
  bio?: string;
  status: DoctorApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface DoctorPortalProfile {
  id: string;
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications: DoctorQualificationEntry[];
  yearsOfExperience: number;
  clinic: ClinicInfo;
  consultationFee: number;
  videoConsultationFee: number;
  availability: AvailabilitySlot[];
  profilePhotoUrl?: string;
  bio?: string;
}

export interface DoctorAppointment {
  id: string;
  doctorId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  type: AppointmentType;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  notes?: string;
  fee: number;
  createdAt: string;
}

export interface DoctorPatientRecord {
  id: string;
  doctorId: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  conditions: string[];
  visitCount: number;
}

export interface DoctorPrescription {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; duration: string }[];
  notes?: string;
  createdAt: string;
}

export interface ConsultationStats {
  totalConsultations: number;
  videoConsultations: number;
  clinicVisits: number;
  completedThisMonth: number;
  pendingAppointments: number;
  averageRating: number;
  totalReviews: number;
}

export interface EarningsSummary {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  pendingPayout: number;
  currency: string;
  recentTransactions: EarningsTransaction[];
}

export interface EarningsTransaction {
  id: string;
  date: string;
  patientName: string;
  type: AppointmentType;
  amount: number;
  status: 'paid' | 'pending';
}

export interface DoctorRegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  qualifications: DoctorQualificationEntry[];
  yearsOfExperience: number;
  clinic: ClinicInfo;
  consultationFee: number;
  videoConsultationFee: number;
  availability: AvailabilitySlot[];
  documents: DoctorRegistrationApplication['documents'];
}

export const DAY_OPTIONS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
];

export const TIME_SLOT_OPTIONS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM', '08:00 PM',
];
