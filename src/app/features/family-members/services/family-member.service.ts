import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateFamilyMemberRequest,
  FamilyMemberListQuery,
  UpdateFamilyMemberRequest,
} from '../../../core/models/family-member.model';
import { FamilyMembersActions } from '../store/family-members.actions';
import {
  selectFamilyMembers,
  selectFamilyMembersError,
  selectFamilyMembersLoading,
  selectFamilyMembersPagination,
  selectFamilyMembersQuery,
  selectFamilyMembersSaving,
  selectFamilyMembersSuccessMessage,
} from '../store/family-members.selectors';

@Injectable({ providedIn: 'root' })
export class FamilyMemberService {
  private readonly store = inject(Store);

  readonly familyMembers = this.store.selectSignal(selectFamilyMembers);
  readonly pagination = this.store.selectSignal(selectFamilyMembersPagination);
  readonly query = this.store.selectSignal(selectFamilyMembersQuery);
  readonly loading = this.store.selectSignal(selectFamilyMembersLoading);
  readonly saving = this.store.selectSignal(selectFamilyMembersSaving);
  readonly error = this.store.selectSignal(selectFamilyMembersError);
  readonly successMessage = this.store.selectSignal(selectFamilyMembersSuccessMessage);

  loadFamilyMembers(query?: Partial<FamilyMemberListQuery>): void {
    this.store.dispatch(FamilyMembersActions.loadFamilyMembers({ query }));
  }

  loadMyFamilyMembers(): void {
    this.store.dispatch(FamilyMembersActions.loadMyFamilyMembers());
  }

  loadByPatient(patientProfileId: string): void {
    this.store.dispatch(FamilyMembersActions.loadByPatient({ patientProfileId }));
  }

  createFamilyMember(payload: CreateFamilyMemberRequest, patientMode = false): void {
    this.store.dispatch(FamilyMembersActions.createFamilyMember({ payload, patientMode }));
  }

  updateFamilyMember(id: string, payload: UpdateFamilyMemberRequest, patientMode = false): void {
    this.store.dispatch(FamilyMembersActions.updateFamilyMember({ id, payload, patientMode }));
  }

  deleteFamilyMember(id: string, patientMode = false): void {
    this.store.dispatch(FamilyMembersActions.deleteFamilyMember({ id, patientMode }));
  }

  clearError(): void {
    this.store.dispatch(FamilyMembersActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(FamilyMembersActions.clearSuccessMessage());
  }
}
