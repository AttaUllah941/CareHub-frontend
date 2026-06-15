import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateFamilyMemberRequest,
  FamilyMember,
  FamilyMemberListQuery,
  PaginationMeta,
  UpdateFamilyMemberRequest,
} from '../../../core/models/family-member.model';

export const FamilyMembersActions = createActionGroup({
  source: 'FamilyMembers',
  events: {
    'Load Family Members': props<{ query?: Partial<FamilyMemberListQuery> }>(),
    'Load Family Members Success': props<{
      familyMembers: FamilyMember[];
      pagination: PaginationMeta;
      query: FamilyMemberListQuery;
    }>(),
    'Load Family Members Failure': props<{ error: string }>(),

    'Load My Family Members': emptyProps(),
    'Load My Family Members Success': props<{ familyMembers: FamilyMember[] }>(),
    'Load My Family Members Failure': props<{ error: string }>(),

    'Load By Patient': props<{ patientProfileId: string }>(),
    'Load By Patient Success': props<{ familyMembers: FamilyMember[] }>(),
    'Load By Patient Failure': props<{ error: string }>(),

    'Create Family Member': props<{ payload: CreateFamilyMemberRequest; patientMode?: boolean }>(),
    'Create Family Member Success': props<{ familyMember: FamilyMember; message: string }>(),
    'Create Family Member Failure': props<{ error: string }>(),

    'Update Family Member': props<{
      id: string;
      payload: UpdateFamilyMemberRequest;
      patientMode?: boolean;
    }>(),
    'Update Family Member Success': props<{ familyMember: FamilyMember; message: string }>(),
    'Update Family Member Failure': props<{ error: string }>(),

    'Delete Family Member': props<{ id: string; patientMode?: boolean }>(),
    'Delete Family Member Success': props<{ message: string; id: string }>(),
    'Delete Family Member Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
