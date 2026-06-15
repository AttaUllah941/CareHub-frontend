import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateLabBookingRequest,
  CreateLabRequest,
  CreateLabTestRequest,
  DEFAULT_LAB_LIST_QUERY,
  Lab,
  LabBooking,
  LabListQuery,
  LabReport,
  LabTest,
} from '../../../core/models/lab.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const LabActions = createActionGroup({
  source: 'Lab',
  events: {
    'Load Labs': props<{ query?: Partial<LabListQuery> }>(),
    'Load Labs Success': props<{ labs: Lab[]; pagination: PaginationMeta; query: LabListQuery }>(),
    'Load Labs Failure': props<{ error: string }>(),

    'Create Lab': props<{ payload: CreateLabRequest }>(),
    'Create Lab Success': props<{ lab: Lab; message: string }>(),
    'Create Lab Failure': props<{ error: string }>(),

    'Load Tests': props<{ query?: Record<string, string | number | boolean> }>(),
    'Load Tests Success': props<{ tests: LabTest[]; pagination: PaginationMeta }>(),
    'Load Tests Failure': props<{ error: string }>(),

    'Create Test': props<{ payload: CreateLabTestRequest }>(),
    'Create Test Success': props<{ test: LabTest; message: string }>(),
    'Create Test Failure': props<{ error: string }>(),

    'Load Bookings': props<{ query?: Record<string, string | number> }>(),
    'Load Bookings Success': props<{ bookings: LabBooking[]; pagination: PaginationMeta }>(),
    'Load Bookings Failure': props<{ error: string }>(),

    'Load My Bookings': emptyProps(),
    'Load My Bookings Success': props<{ bookings: LabBooking[] }>(),
    'Load My Bookings Failure': props<{ error: string }>(),

    'Create Booking': props<{ payload: CreateLabBookingRequest }>(),
    'Create Booking Success': props<{ booking: LabBooking; message: string }>(),
    'Create Booking Failure': props<{ error: string }>(),

    'Update Booking Status': props<{ id: string; status: string; notes?: string }>(),
    'Update Booking Status Success': props<{ booking: LabBooking; message: string }>(),
    'Update Booking Status Failure': props<{ error: string }>(),

    'Load My Reports': emptyProps(),
    'Load My Reports Success': props<{ reports: LabReport[] }>(),
    'Load My Reports Failure': props<{ error: string }>(),

    'Load Reports': props<{ query?: Record<string, string | number> }>(),
    'Load Reports Success': props<{ reports: LabReport[]; pagination: PaginationMeta }>(),
    'Load Reports Failure': props<{ error: string }>(),

    'Upload Report': props<{ formData: FormData }>(),
    'Upload Report Success': props<{ report: LabReport; message: string }>(),
    'Upload Report Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});

export { DEFAULT_LAB_LIST_QUERY };
