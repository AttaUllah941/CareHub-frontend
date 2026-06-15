import {
  MedicalRecord,
  MedicalRecordHistoryEntry,
  MedicalRecordListQuery,
  DEFAULT_MEDICAL_RECORD_LIST_QUERY,
} from '../../../core/models/medical-record.model';

export interface MedicalRecordsState {
  records: MedicalRecord[];
  myRecords: MedicalRecord[];
  patientRecords: MedicalRecord[];
  selectedRecord: MedicalRecord | null;
  recordHistory: MedicalRecordHistoryEntry[];
  currentVersion: number;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: MedicalRecordListQuery;
  loading: boolean;
  saving: boolean;
  downloading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const MEDICAL_RECORDS_FEATURE_KEY = 'medicalRecords';

export const initialMedicalRecordsState: MedicalRecordsState = {
  records: [],
  myRecords: [],
  patientRecords: [],
  selectedRecord: null,
  recordHistory: [],
  currentVersion: 1,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_MEDICAL_RECORD_LIST_QUERY },
  loading: false,
  saving: false,
  downloading: false,
  error: null,
  successMessage: null,
};
