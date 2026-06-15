import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  EmailSettings,
  FeatureFlags,
  GeneralSettings,
  PaymentSettings,
  SmsSettings,
} from '../../../core/models/settings.model';
import { SettingsActions } from '../store/settings.actions';
import {
  selectEmailSettings,
  selectFeatureFlags,
  selectGeneralSettings,
  selectPaymentSettings,
  selectSettingsError,
  selectSettingsLoading,
  selectSettingsSaving,
  selectSettingsSuccess,
  selectSmsSettings,
  selectSystemSettings,
} from '../store/settings.selectors';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly store = inject(Store);

  readonly settings = this.store.selectSignal(selectSystemSettings);
  readonly general = this.store.selectSignal(selectGeneralSettings);
  readonly email = this.store.selectSignal(selectEmailSettings);
  readonly sms = this.store.selectSignal(selectSmsSettings);
  readonly payment = this.store.selectSignal(selectPaymentSettings);
  readonly featureFlags = this.store.selectSignal(selectFeatureFlags);
  readonly loading = this.store.selectSignal(selectSettingsLoading);
  readonly saving = this.store.selectSignal(selectSettingsSaving);
  readonly error = this.store.selectSignal(selectSettingsError);
  readonly successMessage = this.store.selectSignal(selectSettingsSuccess);

  loadSettings(): void {
    this.store.dispatch(SettingsActions.loadSettings());
  }

  saveGeneral(payload: Partial<GeneralSettings>): void {
    this.store.dispatch(SettingsActions.saveGeneral({ payload }));
  }

  saveEmail(payload: Partial<EmailSettings>): void {
    this.store.dispatch(SettingsActions.saveEmail({ payload }));
  }

  saveSms(payload: Partial<SmsSettings>): void {
    this.store.dispatch(SettingsActions.saveSms({ payload }));
  }

  savePayment(payload: Partial<PaymentSettings>): void {
    this.store.dispatch(SettingsActions.savePayment({ payload }));
  }

  saveFeatureFlags(payload: Partial<FeatureFlags>): void {
    this.store.dispatch(SettingsActions.saveFeatureFlags({ payload }));
  }

  clearMessages(): void {
    this.store.dispatch(SettingsActions.clearMessages());
  }
}
