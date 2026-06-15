import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Appointment,
  AppointmentListQuery,
  AvailableSlotsResponse,
  BookAppointmentRequest,
  CancelAppointmentRequest,
  PaginationMeta,
  RecurringSlotsResponse,
  RescheduleAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentStatusRequest,
} from '../../../core/models/appointment.model';

export const AppointmentsActions = createActionGroup({
  source: 'Appointments',
  events: {
    'Load Available Slots': props<{ doctorProfileId: string; date: string; clinicId?: string }>(),
    'Load Available Slots Success': props<{ slots: AvailableSlotsResponse }>(),
    'Load Available Slots Failure': props<{ error: string }>(),

    'Load Recurring Slots': props<{
      doctorProfileId: string;
      fromDate: string;
      toDate: string;
      clinicId?: string;
      maxDays?: number;
    }>(),
    'Load Recurring Slots Success': props<{ slots: RecurringSlotsResponse }>(),
    'Load Recurring Slots Failure': props<{ error: string }>(),

    'Load Appointments': props<{ query?: Partial<AppointmentListQuery> }>(),
    'Load Appointments Success': props<{
      appointments: Appointment[];
      pagination: PaginationMeta;
      query: AppointmentListQuery;
    }>(),
    'Load Appointments Failure': props<{ error: string }>(),

    'Load My Appointments': props<{ status?: string }>(),
    'Load My Appointments Success': props<{ appointments: Appointment[] }>(),
    'Load My Appointments Failure': props<{ error: string }>(),

    'Load Doctor Appointments': props<{ status?: string }>(),
    'Load Doctor Appointments Success': props<{ appointments: Appointment[] }>(),
    'Load Doctor Appointments Failure': props<{ error: string }>(),

    'Book Appointment': props<{ payload: BookAppointmentRequest }>(),
    'Book Appointment Success': props<{ appointment: Appointment; message: string }>(),
    'Book Appointment Failure': props<{ error: string }>(),

    'Update Appointment': props<{ id: string; payload: UpdateAppointmentRequest; patientMode?: boolean }>(),
    'Update Appointment Success': props<{ appointment: Appointment; message: string }>(),
    'Update Appointment Failure': props<{ error: string }>(),

    'Cancel Appointment': props<{ id: string; payload: CancelAppointmentRequest; patientMode?: boolean }>(),
    'Cancel Appointment Success': props<{ appointment: Appointment; message: string }>(),
    'Cancel Appointment Failure': props<{ error: string }>(),

    'Reschedule Appointment': props<{
      id: string;
      payload: RescheduleAppointmentRequest;
      patientMode?: boolean;
    }>(),
    'Reschedule Appointment Success': props<{ appointment: Appointment; message: string }>(),
    'Reschedule Appointment Failure': props<{ error: string }>(),

    'Update Status': props<{
      id: string;
      payload: UpdateAppointmentStatusRequest;
      doctorMode?: boolean;
    }>(),
    'Update Status Success': props<{ appointment: Appointment; message: string }>(),
    'Update Status Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
    'Clear Available Slots': emptyProps(),
    'Clear Recurring Slots': emptyProps(),
  },
});
