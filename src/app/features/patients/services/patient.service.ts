import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreatePatientRequest,
  PatientListQuery,
  UpdateMyPatientProfileRequest,
  UpdatePatientRequest,
} from '../../../core/models/patient.model';
import { PatientsActions } from '../store/patients.actions';
import {
  selectMyPatientProfile,
  selectPatients,
  selectPatientsError,
  selectPatientsLoading,
  selectPatientsPagination,
  selectPatientsQuery,
  selectPatientsSaving,
  selectPatientsSuccessMessage,
  selectSelectedPatient,
} from '../store/patients.selectors';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly store = inject(Store);

  readonly patients = this.store.selectSignal(selectPatients);
  readonly selectedPatient = this.store.selectSignal(selectSelectedPatient);
  readonly myProfile = this.store.selectSignal(selectMyPatientProfile);
  readonly pagination = this.store.selectSignal(selectPatientsPagination);
  readonly query = this.store.selectSignal(selectPatientsQuery);
  readonly loading = this.store.selectSignal(selectPatientsLoading);
  readonly saving = this.store.selectSignal(selectPatientsSaving);
  readonly error = this.store.selectSignal(selectPatientsError);
  readonly successMessage = this.store.selectSignal(selectPatientsSuccessMessage);

  loadPatients(query?: Partial<PatientListQuery>): void {
    this.store.dispatch(PatientsActions.loadPatients({ query }));
  }

  loadPatient(id: string): void {
    this.store.dispatch(PatientsActions.loadPatient({ id }));
  }

  loadMyProfile(): void {
    this.store.dispatch(PatientsActions.loadMyProfile());
  }

  createPatient(payload: CreatePatientRequest): void {
    this.store.dispatch(PatientsActions.createPatient({ payload }));
  }

  createMyProfile(payload: UpdateMyPatientProfileRequest): void {
    this.store.dispatch(PatientsActions.createMyProfile({ payload }));
  }

  updatePatient(id: string, payload: UpdatePatientRequest): void {
    this.store.dispatch(PatientsActions.updatePatient({ id, payload }));
  }

  updateMyProfile(payload: UpdateMyPatientProfileRequest): void {
    this.store.dispatch(PatientsActions.updateMyProfile({ payload }));
  }

  deletePatient(id: string): void {
    this.store.dispatch(PatientsActions.deletePatient({ id }));
  }

  clearError(): void {
    this.store.dispatch(PatientsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(PatientsActions.clearSuccessMessage());
  }
}
