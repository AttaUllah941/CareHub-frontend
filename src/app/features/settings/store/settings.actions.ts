import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  EmailSettings,
  FeatureFlags,
  GeneralSettings,
  PaymentSettings,
  SmsSettings,
  SystemSettings,
} from '../../../core/models/settings.model';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Load Settings': emptyProps(),
    'Load Settings Success': props<{ settings: SystemSettings }>(),
    'Load Settings Failure': props<{ error: string }>(),

    'Save General': props<{ payload: Partial<GeneralSettings> }>(),
    'Save Email': props<{ payload: Partial<EmailSettings> }>(),
    'Save Sms': props<{ payload: Partial<SmsSettings> }>(),
    'Save Payment': props<{ payload: Partial<PaymentSettings> }>(),
    'Save Feature Flags': props<{ payload: Partial<FeatureFlags> }>(),
    'Save Section Success': props<{ settings: SystemSettings; message: string }>(),
    'Save Section Failure': props<{ error: string }>(),

    'Clear Messages': emptyProps(),
  },
});
