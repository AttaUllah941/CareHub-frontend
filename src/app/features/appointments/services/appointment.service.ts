import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppointmentListQuery,
  BookAppointmentRequest,
  CancelAppointmentRequest,
  RescheduleAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentStatusRequest,
} from '../../../core/models/appointment.model';
import { AppointmentsActions } from '../store/appointments.actions';
import {
  selectAppointments,
  selectAppointmentsError,
  selectAppointmentsLoading,
  selectAppointmentsPagination,
  selectAppointmentsQuery,
  selectAppointmentsSaving,
  selectAppointmentsSuccessMessage,
  selectAvailableSlots,
  selectRecurringSlots,
  selectDoctorAppointments,
  selectMyAppointments,
  selectSlotsLoading,
} from '../store/appointments.selectors';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly store = inject(Store);

  readonly appointments = this.store.selectSignal(selectAppointments);
  readonly myAppointments = this.store.selectSignal(selectMyAppointments);
  readonly doctorAppointments = this.store.selectSignal(selectDoctorAppointments);
  readonly availableSlots = this.store.selectSignal(selectAvailableSlots);
  readonly recurringSlots = this.store.selectSignal(selectRecurringSlots);
  readonly pagination = this.store.selectSignal(selectAppointmentsPagination);
  readonly query = this.store.selectSignal(selectAppointmentsQuery);
  readonly loading = this.store.selectSignal(selectAppointmentsLoading);
  readonly slotsLoading = this.store.selectSignal(selectSlotsLoading);
  readonly saving = this.store.selectSignal(selectAppointmentsSaving);
  readonly error = this.store.selectSignal(selectAppointmentsError);
  readonly successMessage = this.store.selectSignal(selectAppointmentsSuccessMessage);

  loadAvailableSlots(doctorProfileId: string, date: string, clinicId?: string): void {
    this.store.dispatch(AppointmentsActions.loadAvailableSlots({ doctorProfileId, date, clinicId }));
  }

  loadRecurringSlots(
    doctorProfileId: string,
    fromDate: string,
    toDate: string,
    options?: { clinicId?: string; maxDays?: number },
  ): void {
    this.store.dispatch(
      AppointmentsActions.loadRecurringSlots({
        doctorProfileId,
        fromDate,
        toDate,
        clinicId: options?.clinicId,
        maxDays: options?.maxDays,
      }),
    );
  }

  loadAppointments(query?: Partial<AppointmentListQuery>): void {
    this.store.dispatch(AppointmentsActions.loadAppointments({ query }));
  }

  loadMyAppointments(status?: string): void {
    this.store.dispatch(AppointmentsActions.loadMyAppointments({ status }));
  }

  loadDoctorAppointments(status?: string): void {
    this.store.dispatch(AppointmentsActions.loadDoctorAppointments({ status }));
  }

  bookAppointment(payload: BookAppointmentRequest): void {
    this.store.dispatch(AppointmentsActions.bookAppointment({ payload }));
  }

  updateAppointment(id: string, payload: UpdateAppointmentRequest, patientMode = false): void {
    this.store.dispatch(AppointmentsActions.updateAppointment({ id, payload, patientMode }));
  }

  cancelAppointment(id: string, payload: CancelAppointmentRequest, patientMode = false): void {
    this.store.dispatch(AppointmentsActions.cancelAppointment({ id, payload, patientMode }));
  }

  rescheduleAppointment(id: string, payload: RescheduleAppointmentRequest, patientMode = false): void {
    this.store.dispatch(AppointmentsActions.rescheduleAppointment({ id, payload, patientMode }));
  }

  updateStatus(id: string, payload: UpdateAppointmentStatusRequest, doctorMode = false): void {
    this.store.dispatch(AppointmentsActions.updateStatus({ id, payload, doctorMode }));
  }

  clearRecurringSlots(): void {
    this.store.dispatch(AppointmentsActions.clearRecurringSlots());
  }

  clearAvailableSlots(): void {
    this.store.dispatch(AppointmentsActions.clearAvailableSlots());
  }

  clearError(): void {
    this.store.dispatch(AppointmentsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(AppointmentsActions.clearSuccessMessage());
  }
}
