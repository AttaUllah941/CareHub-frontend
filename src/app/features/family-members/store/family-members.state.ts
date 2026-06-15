import { FamilyMember, FamilyMemberListQuery } from '../../../core/models/family-member.model';

export interface FamilyMembersState {
  familyMembers: FamilyMember[];
  selectedFamilyMember: FamilyMember | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: FamilyMemberListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const FAMILY_MEMBERS_FEATURE_KEY = 'familyMembers';

export const initialFamilyMembersState: FamilyMembersState = {
  familyMembers: [],
  selectedFamilyMember: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  query: {
    page: 1,
    limit: 10,
    search: '',
    patientProfileId: '',
    relationship: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
