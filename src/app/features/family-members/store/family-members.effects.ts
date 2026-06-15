import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { DEFAULT_FAMILY_MEMBER_LIST_QUERY } from '../../../core/models/family-member.model';
import { FamilyMemberApiService } from '../services/family-member-api.service';
import { FamilyMembersActions } from './family-members.actions';
import { selectFamilyMembersQuery } from './family-members.selectors';

@Injectable()
export class FamilyMembersEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(FamilyMemberApiService);
  private readonly store = inject(Store);

  loadFamilyMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersActions.loadFamilyMembers),
      withLatestFrom(this.store.select(selectFamilyMembersQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_FAMILY_MEMBER_LIST_QUERY, ...current, ...query };
        return this.api.getFamilyMembers(merged).pipe(
          map((res) =>
            FamilyMembersActions.loadFamilyMembersSuccess({
              familyMembers: res.data.familyMembers,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(
              FamilyMembersActions.loadFamilyMembersFailure({
                error: err.error?.message ?? 'Failed to load family members',
              }),
            ),
          ),
        );
      }),
    ),
  );

  loadMyFamilyMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersActions.loadMyFamilyMembers),
      exhaustMap(() =>
        this.api.getMyFamilyMembers().pipe(
          map((res) =>
            FamilyMembersActions.loadMyFamilyMembersSuccess({ familyMembers: res.data.familyMembers }),
          ),
          catchError((err) =>
            of(
              FamilyMembersActions.loadMyFamilyMembersFailure({
                error: err.error?.message ?? 'Failed to load family members',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadByPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersActions.loadByPatient),
      exhaustMap(({ patientProfileId }) =>
        this.api.getByPatientId(patientProfileId).pipe(
          map((res) =>
            FamilyMembersActions.loadByPatientSuccess({ familyMembers: res.data.familyMembers }),
          ),
          catchError((err) =>
            of(
              FamilyMembersActions.loadByPatientFailure({
                error: err.error?.message ?? 'Failed to load family members',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createFamilyMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersActions.createFamilyMember),
      exhaustMap(({ payload, patientMode }) => {
        const request$ = patientMode
          ? this.api.createMyFamilyMember(payload)
          : this.api.createFamilyMember(payload);
        return request$.pipe(
          map((res) =>
            FamilyMembersActions.createFamilyMemberSuccess({
              familyMember: res.data.familyMember,
              message: res.message ?? 'Family member added',
            }),
          ),
          catchError((err) =>
            of(
              FamilyMembersActions.createFamilyMemberFailure({
                error: err.error?.message ?? 'Failed to create family member',
              }),
            ),
          ),
        );
      }),
    ),
  );

  updateFamilyMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersActions.updateFamilyMember),
      exhaustMap(({ id, payload, patientMode }) => {
        const request$ = patientMode
          ? this.api.updateMyFamilyMember(id, payload)
          : this.api.updateFamilyMember(id, payload);
        return request$.pipe(
          map((res) =>
            FamilyMembersActions.updateFamilyMemberSuccess({
              familyMember: res.data.familyMember,
              message: res.message ?? 'Family member updated',
            }),
          ),
          catchError((err) =>
            of(
              FamilyMembersActions.updateFamilyMemberFailure({
                error: err.error?.message ?? 'Failed to update family member',
              }),
            ),
          ),
        );
      }),
    ),
  );

  deleteFamilyMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersActions.deleteFamilyMember),
      exhaustMap(({ id, patientMode }) => {
        const request$ = patientMode
          ? this.api.deleteMyFamilyMember(id)
          : this.api.deleteFamilyMember(id);
        return request$.pipe(
          map((res) =>
            FamilyMembersActions.deleteFamilyMemberSuccess({
              message: res.message ?? 'Family member removed',
              id,
            }),
          ),
          catchError((err) =>
            of(
              FamilyMembersActions.deleteFamilyMemberFailure({
                error: err.error?.message ?? 'Failed to delete family member',
              }),
            ),
          ),
        );
      }),
    ),
  );
}
