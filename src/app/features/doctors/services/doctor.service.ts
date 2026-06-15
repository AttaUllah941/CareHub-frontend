import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateDoctorRequest,
  DoctorListQuery,
  DoctorSearchQuery,
  UpdateDoctorRequest,
  UpdateMyDoctorProfileRequest,
  VerifyDoctorRequest,
} from '../../../core/models/doctor.model';
import { DoctorsActions } from '../store/doctors.actions';
import {
  selectDoctors,
  selectDoctorsError,
  selectDoctorsLoading,
  selectDoctorsPagination,
  selectDoctorsQuery,
  selectDoctorsSaving,
  selectDoctorsSuccessMessage,
  selectMyDoctorProfile,
  selectSearchLoading,
  selectSearchPagination,
  selectSearchQuery,
  selectSearchResults,
  selectSelectedDoctor,
} from '../store/doctors.selectors';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly store = inject(Store);

  readonly doctors = this.store.selectSignal(selectDoctors);
  readonly selectedDoctor = this.store.selectSignal(selectSelectedDoctor);
  readonly myProfile = this.store.selectSignal(selectMyDoctorProfile);
  readonly pagination = this.store.selectSignal(selectDoctorsPagination);
  readonly query = this.store.selectSignal(selectDoctorsQuery);
  readonly loading = this.store.selectSignal(selectDoctorsLoading);
  readonly saving = this.store.selectSignal(selectDoctorsSaving);
  readonly error = this.store.selectSignal(selectDoctorsError);
  readonly successMessage = this.store.selectSignal(selectDoctorsSuccessMessage);

  readonly searchResults = this.store.selectSignal(selectSearchResults);
  readonly searchPagination = this.store.selectSignal(selectSearchPagination);
  readonly searchQuery = this.store.selectSignal(selectSearchQuery);
  readonly searchLoading = this.store.selectSignal(selectSearchLoading);

  loadDoctors(query?: Partial<DoctorListQuery>): void {
    this.store.dispatch(DoctorsActions.loadDoctors({ query }));
  }

  searchDoctors(query?: Partial<DoctorSearchQuery>): void {
    this.store.dispatch(DoctorsActions.searchDoctors({ query }));
  }

  loadDoctor(id: string): void {
    this.store.dispatch(DoctorsActions.loadDoctor({ id }));
  }

  loadMyProfile(): void {
    this.store.dispatch(DoctorsActions.loadMyProfile());
  }

  createDoctor(payload: CreateDoctorRequest): void {
    this.store.dispatch(DoctorsActions.createDoctor({ payload }));
  }

  createMyProfile(payload: UpdateMyDoctorProfileRequest): void {
    this.store.dispatch(DoctorsActions.createMyProfile({ payload }));
  }

  updateDoctor(id: string, payload: UpdateDoctorRequest): void {
    this.store.dispatch(DoctorsActions.updateDoctor({ id, payload }));
  }

  updateMyProfile(payload: UpdateMyDoctorProfileRequest): void {
    this.store.dispatch(DoctorsActions.updateMyProfile({ payload }));
  }

  verifyDoctor(id: string, payload: VerifyDoctorRequest): void {
    this.store.dispatch(DoctorsActions.verifyDoctor({ id, payload }));
  }

  deleteDoctor(id: string): void {
    this.store.dispatch(DoctorsActions.deleteDoctor({ id }));
  }

  clearError(): void {
    this.store.dispatch(DoctorsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(DoctorsActions.clearSuccessMessage());
  }

  clearSelectedDoctor(): void {
    this.store.dispatch(DoctorsActions.clearSelectedDoctor());
  }
}
