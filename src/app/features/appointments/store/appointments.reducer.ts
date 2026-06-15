import { createReducer, on } from '@ngrx/store';
import { DEFAULT_APPOINTMENT_LIST_QUERY } from '../../../core/models/appointment.model';
import { AppointmentsActions } from './appointments.actions';
import { initialAppointmentsState } from './appointments.state';

const setSaving = (state: typeof initialAppointmentsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialAppointmentsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  slotsLoading: false,
  saving: false,
  error,
});

export const appointmentsReducer = createReducer(
  initialAppointmentsState,

  on(AppointmentsActions.loadAvailableSlots, (state) => ({
    ...state,
    slotsLoading: true,
    error: null,
  })),
  on(AppointmentsActions.loadAvailableSlotsSuccess, (state, { slots }) => ({
    ...state,
    availableSlots: slots,
    slotsLoading: false,
  })),
  on(AppointmentsActions.loadAvailableSlotsFailure, (state, { error }) => ({
    ...state,
    slotsLoading: false,
    error,
  })),
  on(AppointmentsActions.clearAvailableSlots, (state) => ({ ...state, availableSlots: null })),

  on(AppointmentsActions.loadRecurringSlots, (state) => ({
    ...state,
    slotsLoading: true,
    error: null,
  })),
  on(AppointmentsActions.loadRecurringSlotsSuccess, (state, { slots }) => ({
    ...state,
    recurringSlots: slots,
    slotsLoading: false,
  })),
  on(AppointmentsActions.loadRecurringSlotsFailure, (state, { error }) => ({
    ...state,
    slotsLoading: false,
    error,
  })),
  on(AppointmentsActions.clearRecurringSlots, (state) => ({ ...state, recurringSlots: null })),

  on(AppointmentsActions.loadAppointments, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_APPOINTMENT_LIST_QUERY, ...state.query, ...query },
  })),
  on(AppointmentsActions.loadAppointmentsSuccess, (state, { appointments, pagination, query }) => ({
    ...state,
    appointments,
    pagination,
    query,
    loading: false,
  })),
  on(AppointmentsActions.loadAppointmentsFailure, setFailure),

  on(AppointmentsActions.loadMyAppointments, AppointmentsActions.loadDoctorAppointments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AppointmentsActions.loadMyAppointmentsSuccess, (state, { appointments }) => ({
    ...state,
    myAppointments: appointments,
    loading: false,
  })),
  on(AppointmentsActions.loadDoctorAppointmentsSuccess, (state, { appointments }) => ({
    ...state,
    doctorAppointments: appointments,
    loading: false,
  })),
  on(
    AppointmentsActions.loadMyAppointmentsFailure,
    AppointmentsActions.loadDoctorAppointmentsFailure,
    setFailure,
  ),

  on(
    AppointmentsActions.bookAppointment,
    AppointmentsActions.updateAppointment,
    AppointmentsActions.cancelAppointment,
    AppointmentsActions.rescheduleAppointment,
    AppointmentsActions.updateStatus,
    setSaving,
  ),

  on(
    AppointmentsActions.bookAppointmentSuccess,
    AppointmentsActions.updateAppointmentSuccess,
    AppointmentsActions.cancelAppointmentSuccess,
    AppointmentsActions.rescheduleAppointmentSuccess,
    AppointmentsActions.updateStatusSuccess,
    (state, { appointment, message }) => ({
      ...state,
      saving: false,
      successMessage: message,
      myAppointments: upsertAppointment(state.myAppointments, appointment),
      doctorAppointments: upsertAppointment(state.doctorAppointments, appointment),
      appointments: upsertAppointment(state.appointments, appointment),
    }),
  ),

  on(
    AppointmentsActions.bookAppointmentFailure,
    AppointmentsActions.updateAppointmentFailure,
    AppointmentsActions.cancelAppointmentFailure,
    AppointmentsActions.rescheduleAppointmentFailure,
    AppointmentsActions.updateStatusFailure,
    setFailure,
  ),

  on(AppointmentsActions.clearError, (state) => ({ ...state, error: null })),
  on(AppointmentsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);

function upsertAppointment(list: import('../../../core/models/appointment.model').Appointment[], appointment: import('../../../core/models/appointment.model').Appointment) {
  return list.some((a) => a.id === appointment.id)
    ? list.map((a) => (a.id === appointment.id ? appointment : a))
    : [appointment, ...list];
}
