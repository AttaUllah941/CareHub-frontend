import { SystemSettings } from '../../../core/models/settings.model';

export const SETTINGS_FEATURE_KEY = 'settings';

export interface SettingsState {
  settings: SystemSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const initialState: SettingsState = {
  settings: null,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
