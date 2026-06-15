import { createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';
import { initialState } from './settings.state';

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.loadSettings, (state) => ({ ...state, loading: true, error: null })),
  on(SettingsActions.loadSettingsSuccess, (state, { settings }) => ({
    ...state,
    loading: false,
    settings,
  })),
  on(SettingsActions.loadSettingsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(
    SettingsActions.saveGeneral,
    SettingsActions.saveEmail,
    SettingsActions.saveSms,
    SettingsActions.savePayment,
    SettingsActions.saveFeatureFlags,
    (state) => ({ ...state, saving: true, error: null, successMessage: null }),
  ),
  on(SettingsActions.saveSectionSuccess, (state, { settings, message }) => ({
    ...state,
    saving: false,
    settings,
    successMessage: message,
  })),
  on(SettingsActions.saveSectionFailure, (state, { error }) => ({ ...state, saving: false, error })),
  on(SettingsActions.clearMessages, (state) => ({ ...state, error: null, successMessage: null })),
);
