export type MedicalRecordType = 'REPORT' | 'SCAN' | 'IMAGE' | 'LAB' | 'OTHER';

export interface MedicalRecordHistoryEntry {
  id?: string;
  version: number;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  uploadedByUserId: string;
  changeNote?: string;
  uploadedAt: string;
  uploadedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface MedicalRecord {
  id: string;
  patientProfileId: string;
  familyMemberId?: string | null;
  consultationId?: string | null;
  appointmentId?: string | null;
  recordType: MedicalRecordType;
  title: string;
  description?: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  version: number;
  history?: MedicalRecordHistoryEntry[];
  uploadedByUserId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    user?: { firstName?: string; lastName?: string; email?: string };
  };
  familyMember?: {
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
  };
  uploadedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface MedicalRecordListQuery {
  page: number;
  limit: number;
  patientProfileId: string;
  recordType: string;
  search: string;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface UploadMedicalRecordRequest {
  file: File;
  recordType: MedicalRecordType;
  title: string;
  description?: string;
  patientProfileId?: string;
  familyMemberId?: string;
  consultationId?: string;
  appointmentId?: string;
}

export interface UpdateMedicalRecordRequest {
  title?: string;
  description?: string;
  recordType?: MedicalRecordType;
}

export const MEDICAL_RECORD_TYPE_OPTIONS: { value: MedicalRecordType; label: string }[] = [
  { value: 'REPORT', label: 'Report' },
  { value: 'SCAN', label: 'Scan' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'LAB', label: 'Lab Result' },
  { value: 'OTHER', label: 'Other' },
];

export const DEFAULT_MEDICAL_RECORD_LIST_QUERY: MedicalRecordListQuery = {
  page: 1,
  limit: 10,
  patientProfileId: '',
  recordType: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function medicalRecordTypeLabel(type: MedicalRecordType): string {
  return MEDICAL_RECORD_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatRecordDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
