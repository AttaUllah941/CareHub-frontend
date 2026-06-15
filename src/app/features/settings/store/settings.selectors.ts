import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SETTINGS_FEATURE_KEY, SettingsState } from './settings.state';

export const selectSettingsState = createFeatureSelector<SettingsState>(SETTINGS_FEATURE_KEY);

export const selectSystemSettings = createSelector(selectSettingsState, (s) => s.settings);
export const selectSettingsLoading = createSelector(selectSettingsState, (s) => s.loading);
export const selectSettingsSaving = createSelector(selectSettingsState, (s) => s.saving);
export const selectSettingsError = createSelector(selectSettingsState, (s) => s.error);
export const selectSettingsSuccess = createSelector(selectSettingsState, (s) => s.successMessage);

export const selectGeneralSettings = createSelector(selectSystemSettings, (s) => s?.general ?? null);
export const selectEmailSettings = createSelector(selectSystemSettings, (s) => s?.email ?? null);
export const selectSmsSettings = createSelector(selectSystemSettings, (s) => s?.sms ?? null);
export const selectPaymentSettings = createSelector(selectSystemSettings, (s) => s?.payment ?? null);
export const selectFeatureFlags = createSelector(selectSystemSettings, (s) => s?.featureFlags ?? null);
