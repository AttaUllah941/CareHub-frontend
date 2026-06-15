import { createReducer, on } from '@ngrx/store';
import { DEFAULT_FAMILY_MEMBER_LIST_QUERY } from '../../../core/models/family-member.model';
import { FamilyMembersActions } from './family-members.actions';
import { initialFamilyMembersState } from './family-members.state';

const setSaving = (state: typeof initialFamilyMembersState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialFamilyMembersState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const familyMembersReducer = createReducer(
  initialFamilyMembersState,

  on(FamilyMembersActions.loadFamilyMembers, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_FAMILY_MEMBER_LIST_QUERY, ...state.query, ...query },
  })),
  on(FamilyMembersActions.loadFamilyMembersSuccess, (state, { familyMembers, pagination, query }) => ({
    ...state,
    familyMembers,
    pagination,
    query,
    loading: false,
  })),
  on(FamilyMembersActions.loadFamilyMembersFailure, setFailure),

  on(FamilyMembersActions.loadMyFamilyMembers, FamilyMembersActions.loadByPatient, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    FamilyMembersActions.loadMyFamilyMembersSuccess,
    FamilyMembersActions.loadByPatientSuccess,
    (state, { familyMembers }) => ({
      ...state,
      familyMembers,
      loading: false,
    }),
  ),
  on(
    FamilyMembersActions.loadMyFamilyMembersFailure,
    FamilyMembersActions.loadByPatientFailure,
    setFailure,
  ),

  on(
    FamilyMembersActions.createFamilyMember,
    FamilyMembersActions.updateFamilyMember,
    FamilyMembersActions.deleteFamilyMember,
    setSaving,
  ),

  on(
    FamilyMembersActions.createFamilyMemberSuccess,
    FamilyMembersActions.updateFamilyMemberSuccess,
    (state, { familyMember, message }) => ({
      ...state,
      saving: false,
      successMessage: message,
      familyMembers: state.familyMembers.some((m) => m.id === familyMember.id)
        ? state.familyMembers.map((m) => (m.id === familyMember.id ? familyMember : m))
        : [...state.familyMembers, familyMember],
    }),
  ),

  on(FamilyMembersActions.deleteFamilyMemberSuccess, (state, { message, id }) => ({
    ...state,
    saving: false,
    successMessage: message,
    familyMembers: state.familyMembers.filter((m) => m.id !== id),
  })),

  on(
    FamilyMembersActions.createFamilyMemberFailure,
    FamilyMembersActions.updateFamilyMemberFailure,
    FamilyMembersActions.deleteFamilyMemberFailure,
    setFailure,
  ),

  on(FamilyMembersActions.clearError, (state) => ({ ...state, error: null })),
  on(FamilyMembersActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
