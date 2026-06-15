import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateMedicalSpecialtyRequest,
  MedicalSpecialty,
  MedicalSpecialtyListQuery,
  PaginationMeta,
  UpdateMedicalSpecialtyRequest,
} from '../../../core/models/medical-specialty.model';

export const MedicalSpecialtiesActions = createActionGroup({
  source: 'MedicalSpecialties',
  events: {
    'Load Specialties': props<{ query?: Partial<MedicalSpecialtyListQuery> }>(),
    'Load Specialties Success': props<{
      specialties: MedicalSpecialty[];
      pagination: PaginationMeta;
      query: MedicalSpecialtyListQuery;
    }>(),
    'Load Specialties Failure': props<{ error: string }>(),

    'Load All Specialties': emptyProps(),
    'Load All Specialties Success': props<{ specialties: MedicalSpecialty[] }>(),
    'Load All Specialties Failure': props<{ error: string }>(),

    'Load Specialty': props<{ id: string }>(),
    'Load Specialty Success': props<{ specialty: MedicalSpecialty }>(),
    'Load Specialty Failure': props<{ error: string }>(),

    'Create Specialty': props<{ payload: CreateMedicalSpecialtyRequest }>(),
    'Create Specialty Success': props<{ specialty: MedicalSpecialty; message: string }>(),
    'Create Specialty Failure': props<{ error: string }>(),

    'Update Specialty': props<{ id: string; payload: UpdateMedicalSpecialtyRequest }>(),
    'Update Specialty Success': props<{ specialty: MedicalSpecialty; message: string }>(),
    'Update Specialty Failure': props<{ error: string }>(),

    'Delete Specialty': props<{ id: string }>(),
    'Delete Specialty Success': props<{ message: string }>(),
    'Delete Specialty Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
