import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  MedicalRecord,
  MedicalRecordListQuery,
  UpdateMedicalRecordRequest,
  UploadMedicalRecordRequest,
} from '../../../core/models/medical-record.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import { MedicalRecordHistoryEntry } from '../../../core/models/medical-record.model';

export const MedicalRecordsActions = createActionGroup({
  source: 'MedicalRecords',
  events: {
    'Load Records': props<{ query?: Partial<MedicalRecordListQuery> }>(),
    'Load Records Success': props<{
      records: MedicalRecord[];
      pagination: PaginationMeta;
      query: MedicalRecordListQuery;
    }>(),
    'Load Records Failure': props<{ error: string }>(),

    'Load My Records': props<{ recordType?: string }>(),
    'Load My Records Success': props<{ records: MedicalRecord[] }>(),
    'Load My Records Failure': props<{ error: string }>(),

    'Load By Patient': props<{ patientProfileId: string; recordType?: string }>(),
    'Load By Patient Success': props<{ records: MedicalRecord[] }>(),
    'Load By Patient Failure': props<{ error: string }>(),

    'Load Record By Id': props<{ id: string }>(),
    'Load Record By Id Success': props<{ record: MedicalRecord }>(),
    'Load Record By Id Failure': props<{ error: string }>(),

    'Load Record History': props<{ id: string }>(),
    'Load Record History Success': props<{
      recordId: string;
      currentVersion: number;
      history: MedicalRecordHistoryEntry[];
    }>(),
    'Load Record History Failure': props<{ error: string }>(),

    'Upload Record': props<{ payload: UploadMedicalRecordRequest }>(),
    'Upload Record Success': props<{ record: MedicalRecord; message: string }>(),
    'Upload Record Failure': props<{ error: string }>(),

    'Upload New Version': props<{ id: string; file: File; changeNote?: string }>(),
    'Upload New Version Success': props<{ record: MedicalRecord; message: string }>(),
    'Upload New Version Failure': props<{ error: string }>(),

    'Update Record': props<{ id: string; payload: UpdateMedicalRecordRequest }>(),
    'Update Record Success': props<{ record: MedicalRecord; message: string }>(),
    'Update Record Failure': props<{ error: string }>(),

    'Delete Record': props<{ id: string }>(),
    'Delete Record Success': props<{ message: string; id: string }>(),
    'Delete Record Failure': props<{ error: string }>(),

    'Download Record': props<{ id: string; filename?: string; version?: number }>(),
    'Download Record Success': emptyProps(),
    'Download Record Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
    'Clear Selected Record': emptyProps(),
  },
});
