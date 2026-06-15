import { Lab, LabBooking, LabListQuery, LabReport, LabTest } from '../../../core/models/lab.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import { DEFAULT_LAB_LIST_QUERY } from './lab.actions';

export const LAB_FEATURE_KEY = 'lab';

export interface LabState {
  labs: Lab[];
  labsPagination: PaginationMeta | null;
  labsQuery: LabListQuery;
  tests: LabTest[];
  testsPagination: PaginationMeta | null;
  bookings: LabBooking[];
  bookingsPagination: PaginationMeta | null;
  myBookings: LabBooking[];
  reports: LabReport[];
  reportsPagination: PaginationMeta | null;
  myReports: LabReport[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const initialState: LabState = {
  labs: [],
  labsPagination: null,
  labsQuery: DEFAULT_LAB_LIST_QUERY,
  tests: [],
  testsPagination: null,
  bookings: [],
  bookingsPagination: null,
  myBookings: [],
  reports: [],
  reportsPagination: null,
  myReports: [],
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
