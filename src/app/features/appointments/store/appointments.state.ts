import {
  Appointment,
  AppointmentListQuery,
  AvailableSlotsResponse,
  DEFAULT_APPOINTMENT_LIST_QUERY,
  RecurringSlotsResponse,
} from '../../../core/models/appointment.model';

export interface AppointmentsState {
  appointments: Appointment[];
  myAppointments: Appointment[];
  doctorAppointments: Appointment[];
  selectedAppointment: Appointment | null;
  availableSlots: AvailableSlotsResponse | null;
  recurringSlots: RecurringSlotsResponse | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: AppointmentListQuery;
  loading: boolean;
  slotsLoading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const APPOINTMENTS_FEATURE_KEY = 'appointments';

export const initialAppointmentsState: AppointmentsState = {
  appointments: [],
  myAppointments: [],
  doctorAppointments: [],
  selectedAppointment: null,
  availableSlots: null,
  recurringSlots: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_APPOINTMENT_LIST_QUERY },
  loading: false,
  slotsLoading: false,
  saving: false,
  error: null,
  successMessage: null,
};
