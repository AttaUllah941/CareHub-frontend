import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from '../../../core/models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: string }>(),

    'Register': props<{ payload: RegisterRequest }>(),
    'Register Success': props<{ response: AuthResponse }>(),
    'Register Failure': props<{ error: string }>(),

    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: string }>(),

    'Forgot Password': props<{ payload: ForgotPasswordRequest }>(),
    'Forgot Password Success': props<{ message: string; devResetToken?: string }>(),
    'Forgot Password Failure': props<{ error: string }>(),

    'Reset Password': props<{ payload: ResetPasswordRequest }>(),
    'Reset Password Success': props<{ message: string }>(),
    'Reset Password Failure': props<{ error: string }>(),

    'Change Password': props<{ payload: ChangePasswordRequest }>(),
    'Change Password Success': props<{ message: string }>(),
    'Change Password Failure': props<{ error: string }>(),

    'Load Profile': emptyProps(),
    'Load Profile Success': props<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>(),
    'Load Profile Failure': props<{ error: string }>(),

    'Init Session': emptyProps(),
    'Session Tokens Refreshed': props<{ accessToken: string; refreshToken: string }>(),
    'Session Expired': emptyProps(),
    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
