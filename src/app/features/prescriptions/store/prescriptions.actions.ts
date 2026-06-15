import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreatePrescriptionRequest,
  Prescription,
  PrescriptionListQuery,
  UpdatePrescriptionRequest,
} from '../../../core/models/prescription.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const PrescriptionsActions = createActionGroup({
  source: 'Prescriptions',
  events: {
    'Load Prescriptions': props<{ query?: Partial<PrescriptionListQuery> }>(),
    'Load Prescriptions Success': props<{
      prescriptions: Prescription[];
      pagination: PaginationMeta;
      query: PrescriptionListQuery;
    }>(),
    'Load Prescriptions Failure': props<{ error: string }>(),

    'Load My Prescriptions': emptyProps(),
    'Load My Prescriptions Success': props<{ prescriptions: Prescription[] }>(),
    'Load My Prescriptions Failure': props<{ error: string }>(),

    'Load Doctor Prescriptions': emptyProps(),
    'Load Doctor Prescriptions Success': props<{ prescriptions: Prescription[] }>(),
    'Load Doctor Prescriptions Failure': props<{ error: string }>(),

    'Load By Consultation': props<{ consultationId: string }>(),
    'Load By Consultation Success': props<{ prescription: Prescription }>(),
    'Load By Consultation Failure': props<{ error: string }>(),

    'Create Prescription': props<{ consultationId: string; payload: CreatePrescriptionRequest }>(),
    'Create Prescription Success': props<{ prescription: Prescription; message: string }>(),
    'Create Prescription Failure': props<{ error: string }>(),

    'Update Prescription': props<{ id: string; payload: UpdatePrescriptionRequest }>(),
    'Update Prescription Success': props<{ prescription: Prescription; message: string }>(),
    'Update Prescription Failure': props<{ error: string }>(),

    'Delete Prescription': props<{ id: string }>(),
    'Delete Prescription Success': props<{ message: string; id: string }>(),
    'Delete Prescription Failure': props<{ error: string }>(),

    'Download Pdf': props<{ id: string; filename?: string }>(),
    'Download Pdf Success': emptyProps(),
    'Download Pdf Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
    'Clear Selected Prescription': emptyProps(),
  },
});
