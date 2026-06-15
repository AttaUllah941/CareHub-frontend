import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateUserRequest,
  ManagedUser,
  PaginationMeta,
  UpdateUserRequest,
  UserListQuery,
} from '../../../core/models/user.model';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': props<{ query?: Partial<UserListQuery> }>(),
    'Load Users Success': props<{ users: ManagedUser[]; pagination: PaginationMeta; query: UserListQuery }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Load User': props<{ id: string }>(),
    'Load User Success': props<{ user: ManagedUser }>(),
    'Load User Failure': props<{ error: string }>(),

    'Create User': props<{ payload: CreateUserRequest }>(),
    'Create User Success': props<{ user: ManagedUser; message: string }>(),
    'Create User Failure': props<{ error: string }>(),

    'Update User': props<{ id: string; payload: UpdateUserRequest }>(),
    'Update User Success': props<{ user: ManagedUser; message: string }>(),
    'Update User Failure': props<{ error: string }>(),

    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ message: string }>(),
    'Delete User Failure': props<{ error: string }>(),

    'Set Query': props<{ query: Partial<UserListQuery> }>(),
    'Clear Selected User': emptyProps(),
    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
