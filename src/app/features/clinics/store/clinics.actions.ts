import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Clinic,
  ClinicListQuery,
  CreateClinicRequest,
  PaginationMeta,
  UpdateClinicRequest,
} from '../../../core/models/clinic.model';

export const ClinicsActions = createActionGroup({
  source: 'Clinics',
  events: {
    'Load Clinics': props<{ query?: Partial<ClinicListQuery> }>(),
    'Load Clinics Success': props<{ clinics: Clinic[]; pagination: PaginationMeta; query: ClinicListQuery }>(),
    'Load Clinics Failure': props<{ error: string }>(),

    'Load All Clinics': emptyProps(),
    'Load All Clinics Success': props<{ clinics: Clinic[] }>(),
    'Load All Clinics Failure': props<{ error: string }>(),

    'Load Clinic': props<{ id: string }>(),
    'Load Clinic Success': props<{ clinic: Clinic }>(),
    'Load Clinic Failure': props<{ error: string }>(),

    'Load My Clinic': emptyProps(),
    'Load My Clinic Success': props<{ clinic: Clinic }>(),
    'Load My Clinic Failure': props<{ error: string }>(),

    'Create Clinic': props<{ payload: CreateClinicRequest }>(),
    'Create Clinic Success': props<{ clinic: Clinic; message: string }>(),
    'Create Clinic Failure': props<{ error: string }>(),

    'Update Clinic': props<{ id: string; payload: UpdateClinicRequest }>(),
    'Update Clinic Success': props<{ clinic: Clinic; message: string }>(),
    'Update Clinic Failure': props<{ error: string }>(),

    'Update My Clinic': props<{ payload: UpdateClinicRequest }>(),
    'Update My Clinic Success': props<{ clinic: Clinic; message: string }>(),
    'Update My Clinic Failure': props<{ error: string }>(),

    'Assign Doctors': props<{ id: string; doctorProfileIds: string[] }>(),
    'Assign Doctors Success': props<{ clinic: Clinic; message: string }>(),
    'Assign Doctors Failure': props<{ error: string }>(),

    'Delete Clinic': props<{ id: string }>(),
    'Delete Clinic Success': props<{ message: string }>(),
    'Delete Clinic Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
