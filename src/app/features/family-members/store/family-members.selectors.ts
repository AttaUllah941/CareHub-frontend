import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FAMILY_MEMBERS_FEATURE_KEY, FamilyMembersState } from './family-members.state';

export const selectFamilyMembersState = createFeatureSelector<FamilyMembersState>(
  FAMILY_MEMBERS_FEATURE_KEY,
);

export const selectFamilyMembers = createSelector(selectFamilyMembersState, (s) => s.familyMembers);
export const selectSelectedFamilyMember = createSelector(
  selectFamilyMembersState,
  (s) => s.selectedFamilyMember,
);
export const selectFamilyMembersPagination = createSelector(
  selectFamilyMembersState,
  (s) => s.pagination,
);
export const selectFamilyMembersQuery = createSelector(selectFamilyMembersState, (s) => s.query);
export const selectFamilyMembersLoading = createSelector(selectFamilyMembersState, (s) => s.loading);
export const selectFamilyMembersSaving = createSelector(selectFamilyMembersState, (s) => s.saving);
export const selectFamilyMembersError = createSelector(selectFamilyMembersState, (s) => s.error);
export const selectFamilyMembersSuccessMessage = createSelector(
  selectFamilyMembersState,
  (s) => s.successMessage,
);
