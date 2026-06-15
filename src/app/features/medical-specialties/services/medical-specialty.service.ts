import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateMedicalSpecialtyRequest,
  MedicalSpecialtyListQuery,
  UpdateMedicalSpecialtyRequest,
} from '../../../core/models/medical-specialty.model';
import { MedicalSpecialtiesActions } from '../store/medical-specialties.actions';
import {
  selectAllSpecialties,
  selectSelectedSpecialty,
  selectSpecialties,
  selectSpecialtiesError,
  selectSpecialtiesLoading,
  selectSpecialtiesPagination,
  selectSpecialtiesQuery,
  selectSpecialtiesSaving,
  selectSpecialtiesSuccessMessage,
} from '../store/medical-specialties.selectors';

@Injectable({ providedIn: 'root' })
export class MedicalSpecialtyService {
  private readonly store = inject(Store);

  readonly specialties = this.store.selectSignal(selectSpecialties);
  readonly allSpecialties = this.store.selectSignal(selectAllSpecialties);
  readonly selectedSpecialty = this.store.selectSignal(selectSelectedSpecialty);
  readonly pagination = this.store.selectSignal(selectSpecialtiesPagination);
  readonly query = this.store.selectSignal(selectSpecialtiesQuery);
  readonly loading = this.store.selectSignal(selectSpecialtiesLoading);
  readonly saving = this.store.selectSignal(selectSpecialtiesSaving);
  readonly error = this.store.selectSignal(selectSpecialtiesError);
  readonly successMessage = this.store.selectSignal(selectSpecialtiesSuccessMessage);

  loadSpecialties(query?: Partial<MedicalSpecialtyListQuery>): void {
    this.store.dispatch(MedicalSpecialtiesActions.loadSpecialties({ query }));
  }

  loadAllSpecialties(): void {
    this.store.dispatch(MedicalSpecialtiesActions.loadAllSpecialties());
  }

  loadSpecialty(id: string): void {
    this.store.dispatch(MedicalSpecialtiesActions.loadSpecialty({ id }));
  }

  createSpecialty(payload: CreateMedicalSpecialtyRequest): void {
    this.store.dispatch(MedicalSpecialtiesActions.createSpecialty({ payload }));
  }

  updateSpecialty(id: string, payload: UpdateMedicalSpecialtyRequest): void {
    this.store.dispatch(MedicalSpecialtiesActions.updateSpecialty({ id, payload }));
  }

  deleteSpecialty(id: string): void {
    this.store.dispatch(MedicalSpecialtiesActions.deleteSpecialty({ id }));
  }

  clearError(): void {
    this.store.dispatch(MedicalSpecialtiesActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(MedicalSpecialtiesActions.clearSuccessMessage());
  }
}
