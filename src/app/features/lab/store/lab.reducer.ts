import { createReducer, on } from '@ngrx/store';
import { LabActions } from './lab.actions';
import { initialState } from './lab.state';

export const labReducer = createReducer(
  initialState,
  on(LabActions.loadLabs, (s) => ({ ...s, loading: true, error: null })),
  on(LabActions.loadLabsSuccess, (s, { labs, pagination, query }) => ({
    ...s, loading: false, labs, labsPagination: pagination, labsQuery: query,
  })),
  on(LabActions.loadLabsFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(LabActions.createLab, (s) => ({ ...s, saving: true, error: null })),
  on(LabActions.createLabSuccess, (s, { lab, message }) => ({
    ...s, saving: false, labs: [lab, ...s.labs], successMessage: message,
  })),
  on(LabActions.createLabFailure, (s, { error }) => ({ ...s, saving: false, error })),

  on(LabActions.loadTests, (s) => ({ ...s, loading: true, error: null })),
  on(LabActions.loadTestsSuccess, (s, { tests, pagination }) => ({
    ...s, loading: false, tests, testsPagination: pagination,
  })),
  on(LabActions.loadTestsFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(LabActions.createTest, (s) => ({ ...s, saving: true, error: null })),
  on(LabActions.createTestSuccess, (s, { message }) => ({ ...s, saving: false, successMessage: message })),
  on(LabActions.createTestFailure, (s, { error }) => ({ ...s, saving: false, error })),

  on(LabActions.loadBookings, (s) => ({ ...s, loading: true, error: null })),
  on(LabActions.loadBookingsSuccess, (s, { bookings, pagination }) => ({
    ...s, loading: false, bookings, bookingsPagination: pagination,
  })),
  on(LabActions.loadBookingsFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(LabActions.loadMyBookings, (s) => ({ ...s, loading: true, error: null })),
  on(LabActions.loadMyBookingsSuccess, (s, { bookings }) => ({ ...s, loading: false, myBookings: bookings })),
  on(LabActions.loadMyBookingsFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(LabActions.createBooking, (s) => ({ ...s, saving: true, error: null })),
  on(LabActions.createBookingSuccess, (s, { booking, message }) => ({
    ...s, saving: false, myBookings: [booking, ...s.myBookings], successMessage: message,
  })),
  on(LabActions.createBookingFailure, (s, { error }) => ({ ...s, saving: false, error })),

  on(LabActions.updateBookingStatus, (s) => ({ ...s, saving: true, error: null })),
  on(LabActions.updateBookingStatusSuccess, (s, { booking, message }) => ({
    ...s, saving: false, bookings: s.bookings.map((b) => (b.id === booking.id ? booking : b)), successMessage: message,
  })),
  on(LabActions.updateBookingStatusFailure, (s, { error }) => ({ ...s, saving: false, error })),

  on(LabActions.loadMyReports, (s) => ({ ...s, loading: true, error: null })),
  on(LabActions.loadMyReportsSuccess, (s, { reports }) => ({ ...s, loading: false, myReports: reports })),
  on(LabActions.loadMyReportsFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(LabActions.loadReports, (s) => ({ ...s, loading: true, error: null })),
  on(LabActions.loadReportsSuccess, (s, { reports, pagination }) => ({
    ...s, loading: false, reports, reportsPagination: pagination,
  })),
  on(LabActions.loadReportsFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(LabActions.uploadReport, (s) => ({ ...s, saving: true, error: null })),
  on(LabActions.uploadReportSuccess, (s, { report, message }) => ({
    ...s, saving: false, reports: [report, ...s.reports], successMessage: message,
  })),
  on(LabActions.uploadReportFailure, (s, { error }) => ({ ...s, saving: false, error })),

  on(LabActions.clearError, (s) => ({ ...s, error: null })),
  on(LabActions.clearSuccessMessage, (s) => ({ ...s, successMessage: null })),
);
