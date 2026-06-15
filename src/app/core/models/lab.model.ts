import { PaginationMeta } from './appointment.model';

export type LabTestCategory = 'BLOOD' | 'URINE' | 'STOOL' | 'IMAGING' | 'HORMONE' | 'COVID' | 'OTHER';
export type LabBookingStatus = 'PENDING' | 'CONFIRMED' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type LabCollectionType = 'LAB_VISIT' | 'HOME_COLLECTION';
export type LabReportStatus = 'PENDING' | 'AVAILABLE' | 'REVIEWED';

export interface Lab {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  homeCollectionAvailable: boolean;
  homeCollectionFee: number;
  openingHours?: string;
  rating: number;
  isActive: boolean;
}

export interface LabTest {
  id: string;
  labId: string;
  name: string;
  code?: string;
  category: LabTestCategory;
  description?: string;
  price: number;
  currency: string;
  sampleType?: string;
  preparationInstructions?: string;
  turnaroundHours: number;
  homeCollectionAvailable: boolean;
  lab?: Lab;
  isActive: boolean;
}

export interface LabBookingItem {
  id?: string;
  labTestId: string;
  testName: string;
  testCode?: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface LabBooking {
  id: string;
  bookingNumber: string;
  patientProfileId: string;
  labId: string;
  status: LabBookingStatus;
  collectionType: LabCollectionType;
  items: LabBookingItem[];
  scheduledDate?: string | null;
  scheduledTimeSlot?: string;
  homeAddress?: string;
  homeCity?: string;
  homePhone?: string;
  collectionNotes?: string;
  subtotal: number;
  collectionFee: number;
  total: number;
  currency: string;
  notes?: string;
  patient?: { id: string; user?: { firstName: string; lastName: string; email?: string } };
  lab?: Lab;
  createdAt?: string;
}

export interface LabReport {
  id: string;
  labBookingId?: string | null;
  patientProfileId: string;
  labId: string;
  title: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: LabReportStatus;
  notes?: string;
  patient?: { id: string; user?: { firstName: string; lastName: string } };
  createdAt?: string;
}

export interface LabListQuery {
  page: number;
  limit: number;
  search?: string;
  city?: string;
  homeCollectionAvailable?: boolean;
}

export interface CreateLabRequest {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  homeCollectionAvailable?: boolean;
  homeCollectionFee?: number;
}

export interface CreateLabTestRequest {
  labId: string;
  name: string;
  code?: string;
  category?: LabTestCategory;
  price: number;
  sampleType?: string;
  preparationInstructions?: string;
  turnaroundHours?: number;
  homeCollectionAvailable?: boolean;
}

export interface CreateLabBookingRequest {
  items: { labTestId: string }[];
  collectionType?: LabCollectionType;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  homeAddress?: string;
  homeCity?: string;
  homePhone?: string;
  collectionNotes?: string;
  notes?: string;
}

export const DEFAULT_LAB_LIST_QUERY: LabListQuery = { page: 1, limit: 10 };

export const LAB_BOOKING_STATUS_OPTIONS: { value: LabBookingStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'SAMPLE_COLLECTED', label: 'Sample Collected' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function labBookingStatusLabel(status: LabBookingStatus): string {
  return LAB_BOOKING_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function labBookingStatusClass(status: LabBookingStatus): string {
  const map: Record<LabBookingStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SAMPLE_COLLECTED: 'bg-indigo-100 text-indigo-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return map[status];
}
