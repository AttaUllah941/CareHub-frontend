import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreatePatientRequest,
  Patient,
  PatientListQuery,
  PaginationMeta,
  UpdateMyPatientProfileRequest,
  UpdatePatientRequest,
} from '../../../core/models/patient.model';

export const PatientsActions = createActionGroup({
  source: 'Patients',
  events: {
    'Load Patients': props<{ query?: Partial<PatientListQuery> }>(),
    'Load Patients Success': props<{ patients: Patient[]; pagination: PaginationMeta; query: PatientListQuery }>(),
    'Load Patients Failure': props<{ error: string }>(),

    'Load Patient': props<{ id: string }>(),
    'Load Patient Success': props<{ patient: Patient }>(),
    'Load Patient Failure': props<{ error: string }>(),

    'Load My Profile': emptyProps(),
    'Load My Profile Success': props<{ patient: Patient }>(),
    'Load My Profile Failure': props<{ error: string }>(),

    'Create Patient': props<{ payload: CreatePatientRequest }>(),
    'Create Patient Success': props<{ patient: Patient; message: string }>(),
    'Create Patient Failure': props<{ error: string }>(),

    'Create My Profile': props<{ payload: UpdateMyPatientProfileRequest }>(),
    'Create My Profile Success': props<{ patient: Patient; message: string }>(),
    'Create My Profile Failure': props<{ error: string }>(),

    'Update Patient': props<{ id: string; payload: UpdatePatientRequest }>(),
    'Update Patient Success': props<{ patient: Patient; message: string }>(),
    'Update Patient Failure': props<{ error: string }>(),

    'Update My Profile': props<{ payload: UpdateMyPatientProfileRequest }>(),
    'Update My Profile Success': props<{ patient: Patient; message: string }>(),
    'Update My Profile Failure': props<{ error: string }>(),

    'Delete Patient': props<{ id: string }>(),
    'Delete Patient Success': props<{ message: string }>(),
    'Delete Patient Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
