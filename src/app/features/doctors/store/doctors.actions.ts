import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateDoctorRequest,
  Doctor,
  DoctorListQuery,
  DoctorSearchQuery,
  DoctorSearchResult,
  PaginationMeta,
  UpdateDoctorRequest,
  UpdateMyDoctorProfileRequest,
  VerifyDoctorRequest,
} from '../../../core/models/doctor.model';

export const DoctorsActions = createActionGroup({
  source: 'Doctors',
  events: {
    'Load Doctors': props<{ query?: Partial<DoctorListQuery> }>(),
    'Load Doctors Success': props<{ doctors: Doctor[]; pagination: PaginationMeta; query: DoctorListQuery }>(),
    'Load Doctors Failure': props<{ error: string }>(),

    'Search Doctors': props<{ query?: Partial<DoctorSearchQuery> }>(),
    'Search Doctors Success': props<{
      doctors: DoctorSearchResult[];
      pagination: PaginationMeta;
      query: DoctorSearchQuery;
    }>(),
    'Search Doctors Failure': props<{ error: string }>(),

    'Load Doctor': props<{ id: string }>(),
    'Load Doctor Success': props<{ doctor: Doctor }>(),
    'Load Doctor Failure': props<{ error: string }>(),

    'Load My Profile': emptyProps(),
    'Load My Profile Success': props<{ doctor: Doctor }>(),
    'Load My Profile Failure': props<{ error: string }>(),

    'Create Doctor': props<{ payload: CreateDoctorRequest }>(),
    'Create Doctor Success': props<{ doctor: Doctor; message: string }>(),
    'Create Doctor Failure': props<{ error: string }>(),

    'Create My Profile': props<{ payload: UpdateMyDoctorProfileRequest }>(),
    'Create My Profile Success': props<{ doctor: Doctor; message: string }>(),
    'Create My Profile Failure': props<{ error: string }>(),

    'Update Doctor': props<{ id: string; payload: UpdateDoctorRequest }>(),
    'Update Doctor Success': props<{ doctor: Doctor; message: string }>(),
    'Update Doctor Failure': props<{ error: string }>(),

    'Update My Profile': props<{ payload: UpdateMyDoctorProfileRequest }>(),
    'Update My Profile Success': props<{ doctor: Doctor; message: string }>(),
    'Update My Profile Failure': props<{ error: string }>(),

    'Verify Doctor': props<{ id: string; payload: VerifyDoctorRequest }>(),
    'Verify Doctor Success': props<{ doctor: Doctor; message: string }>(),
    'Verify Doctor Failure': props<{ error: string }>(),

    'Delete Doctor': props<{ id: string }>(),
    'Delete Doctor Success': props<{ message: string }>(),
    'Delete Doctor Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
    'Clear Selected Doctor': emptyProps(),
  },
});
