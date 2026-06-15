import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConsultationListQuery,
  CreateConsultationRequest,
  UpdateConsultationRequest,
} from '../../../core/models/consultation.model';
import { ConsultationsActions } from '../store/consultations.actions';
import {
  selectConsultations,
  selectConsultationsError,
  selectConsultationsLoading,
  selectConsultationsPagination,
  selectConsultationsQuery,
  selectConsultationsSaving,
  selectConsultationsSuccessMessage,
  selectDoctorConsultations,
  selectMyConsultations,
  selectSelectedConsultation,
} from '../store/consultations.selectors';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private readonly store = inject(Store);

  readonly consultations = this.store.selectSignal(selectConsultations);
  readonly myConsultations = this.store.selectSignal(selectMyConsultations);
  readonly doctorConsultations = this.store.selectSignal(selectDoctorConsultations);
  readonly selectedConsultation = this.store.selectSignal(selectSelectedConsultation);
  readonly pagination = this.store.selectSignal(selectConsultationsPagination);
  readonly query = this.store.selectSignal(selectConsultationsQuery);
  readonly loading = this.store.selectSignal(selectConsultationsLoading);
  readonly saving = this.store.selectSignal(selectConsultationsSaving);
  readonly error = this.store.selectSignal(selectConsultationsError);
  readonly successMessage = this.store.selectSignal(selectConsultationsSuccessMessage);

  loadConsultations(query?: Partial<ConsultationListQuery>): void {
    this.store.dispatch(ConsultationsActions.loadConsultations({ query }));
  }

  loadMyConsultations(): void {
    this.store.dispatch(ConsultationsActions.loadMyConsultations());
  }

  loadDoctorConsultations(): void {
    this.store.dispatch(ConsultationsActions.loadDoctorConsultations());
  }

  loadByAppointment(appointmentId: string): void {
    this.store.dispatch(ConsultationsActions.loadByAppointment({ appointmentId }));
  }

  loadConsultationById(id: string): void {
    this.store.dispatch(ConsultationsActions.loadConsultationById({ id }));
  }

  createConsultation(appointmentId: string, payload: CreateConsultationRequest): void {
    this.store.dispatch(ConsultationsActions.createConsultation({ appointmentId, payload }));
  }

  updateConsultation(id: string, payload: UpdateConsultationRequest): void {
    this.store.dispatch(ConsultationsActions.updateConsultation({ id, payload }));
  }

  deleteConsultation(id: string): void {
    this.store.dispatch(ConsultationsActions.deleteConsultation({ id }));
  }

  clearSelectedConsultation(): void {
    this.store.dispatch(ConsultationsActions.clearSelectedConsultation());
  }

  clearError(): void {
    this.store.dispatch(ConsultationsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(ConsultationsActions.clearSuccessMessage());
  }
}
