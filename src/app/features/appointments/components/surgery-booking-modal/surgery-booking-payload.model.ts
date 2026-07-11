import { SurgeryConsultationStatus } from '../../../../core/models/surgery.model';

export interface SurgeryBookingPayload {
  bookingRef: string;
  requestType: 'surgery_consultation';
  surgery: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    estimatedCostFrom: number;
    estimatedCostTo?: number;
    estimatedCostFormatted: string;
    duration: string;
    anesthesiaType: string;
    hospitalStay?: string;
  };
  hospital: {
    id: string;
    slug: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    facilities: string[];
    rating: number;
  };
  surgeon: {
    id: string;
    name: string;
    specialty: string;
    yearsOfExperience?: number;
  };
  consultation: {
    date: string;
    dateFormatted: string;
    timeSlot: string;
  };
  preSurgeryRequirements: string[];
  requirementsAcknowledged: boolean;
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    medicalHistory: string;
    notes: string;
  };
  meta: {
    createdAt: string;
    status: SurgeryConsultationStatus;
  };
}
