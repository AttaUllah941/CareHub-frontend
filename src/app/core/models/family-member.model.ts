export type FamilyRelationship = 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD';

export interface FamilyMember {
  id: string;
  patientProfileId: string;
  relationship: FamilyRelationship;
  firstName: string;
  lastName: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  patient?: {
    id: string;
    user?: { firstName: string; lastName: string; email: string };
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FamilyMemberListQuery {
  page: number;
  limit: number;
  search: string;
  patientProfileId: string;
  relationship: '' | FamilyRelationship;
  isActive: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreateFamilyMemberRequest {
  patientProfileId?: string;
  relationship: FamilyRelationship;
  firstName: string;
  lastName: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface UpdateFamilyMemberRequest extends Partial<CreateFamilyMemberRequest> {
  isActive?: boolean;
}

export const FAMILY_RELATIONSHIP_OPTIONS: { value: FamilyRelationship; label: string }[] = [
  { value: 'FATHER', label: 'Father' },
  { value: 'MOTHER', label: 'Mother' },
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'CHILD', label: 'Child' },
];

export const DEFAULT_FAMILY_MEMBER_LIST_QUERY: FamilyMemberListQuery = {
  page: 1,
  limit: 10,
  search: '',
  patientProfileId: '',
  relationship: '',
  isActive: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function relationshipLabel(relationship: FamilyRelationship): string {
  return FAMILY_RELATIONSHIP_OPTIONS.find((o) => o.value === relationship)?.label ?? relationship;
}
