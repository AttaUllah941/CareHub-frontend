import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Consultation,
  ConsultationListQuery,
  CreateConsultationRequest,
  UpdateConsultationRequest,
} from '../../../core/models/consultation.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const ConsultationsActions = createActionGroup({
  source: 'Consultations',
  events: {
    'Load Consultations': props<{ query?: Partial<ConsultationListQuery> }>(),
    'Load Consultations Success': props<{
      consultations: Consultation[];
      pagination: PaginationMeta;
      query: ConsultationListQuery;
    }>(),
    'Load Consultations Failure': props<{ error: string }>(),

    'Load My Consultations': emptyProps(),
    'Load My Consultations Success': props<{ consultations: Consultation[] }>(),
    'Load My Consultations Failure': props<{ error: string }>(),

    'Load Doctor Consultations': emptyProps(),
    'Load Doctor Consultations Success': props<{ consultations: Consultation[] }>(),
    'Load Doctor Consultations Failure': props<{ error: string }>(),

    'Load By Appointment': props<{ appointmentId: string }>(),
    'Load By Appointment Success': props<{ consultation: Consultation }>(),
    'Load By Appointment Failure': props<{ error: string }>(),

    'Load Consultation By Id': props<{ id: string }>(),
    'Load Consultation By Id Success': props<{ consultation: Consultation }>(),
    'Load Consultation By Id Failure': props<{ error: string }>(),

    'Create Consultation': props<{ appointmentId: string; payload: CreateConsultationRequest }>(),
    'Create Consultation Success': props<{ consultation: Consultation; message: string }>(),
    'Create Consultation Failure': props<{ error: string }>(),

    'Update Consultation': props<{ id: string; payload: UpdateConsultationRequest }>(),
    'Update Consultation Success': props<{ consultation: Consultation; message: string }>(),
    'Update Consultation Failure': props<{ error: string }>(),

    'Delete Consultation': props<{ id: string }>(),
    'Delete Consultation Success': props<{ message: string; id: string }>(),
    'Delete Consultation Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
    'Clear Selected Consultation': emptyProps(),
  },
});
