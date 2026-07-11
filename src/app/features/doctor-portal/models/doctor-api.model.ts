export interface DoctorUserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DoctorQualificationApi {
  degree: string;
  institution: string;
  year?: number;
}

export interface DoctorSpecialtyApi {
  id: string;
  name: string;
  slug: string;
}

export interface ApiDoctorProfile {
  id: string;
  userId: string;
  user?: DoctorUserSummary;
  title: string;
  city: string;
  bio: string;
  about: string;
  yearsOfExperience: number;
  consultationFee: number;
  currency: string;
  profileImageUrl?: string;
  qualifications: DoctorQualificationApi[];
  specialties: DoctorSpecialtyApi[];
  averageRating: number;
  reviewCount: number;
  verificationStatus: string;
}

export interface ApiClinic {
  id: string;
  doctorId: string;
  name: string;
  address: string;
  city: string;
  consultationFee?: number;
  isActive: boolean;
}

export interface ApiSchedule {
  id: string;
  doctorId: string;
  clinicId: string | null;
  dayOfWeek: number | null;
  specificDate: string | null;
  startTime: string;
  endTime: string;
  consultationType: 'clinic' | 'video';
  isActive: boolean;
}

export interface CreateDoctorApplicationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  documents: {
    type: string;
    url: string;
    mimeType: 'application/pdf' | 'image/jpeg' | 'image/jpg' | 'image/png';
    size: number;
  }[];
  specialtySlug: string;
  yearsOfExperience: number;
  qualifications: {
    degree: string;
    institution: string;
    year?: number;
  }[];
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  clinicPhone: string;
  consultationFee: number;
  videoConsultationFee?: number;
  availability: {
    day: number;
    startTime: string;
    endTime: string;
  }[];
}

export interface DoctorApplicationResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}
