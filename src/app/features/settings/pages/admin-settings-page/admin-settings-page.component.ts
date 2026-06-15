import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import {
  EmailSettings,
  FeatureFlags,
  GeneralSettings,
  PaymentSettings,
  SETTINGS_MASK,
  SmsSettings,
} from '../../../../core/models/settings.model';

type SettingsTab = 'general' | 'email' | 'sms' | 'payment' | 'flags';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold">System Settings</h1>
        <p class="text-sm text-gray-500">Configure platform, email, SMS, payments, and feature flags</p>
      </div>

      @if (settingsService.error()) {
        <app-alert [message]="settingsService.error()!" variant="error" />
      }
      @if (settingsService.successMessage()) {
        <app-alert [message]="settingsService.successMessage()!" variant="success" />
      }

      <div class="flex flex-wrap gap-2 border-b pb-2">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            (click)="activeTab.set(tab.id)"
            class="px-4 py-2 rounded-lg text-sm"
            [class.bg-teal-600]="activeTab() === tab.id"
            [class.text-white]="activeTab() === tab.id"
            [class.bg-gray-100]="activeTab() !== tab.id"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      @if (settingsService.loading()) {
        <p class="text-gray-500 text-sm">Loading settings...</p>
      } @else {
        @switch (activeTab()) {
          @case ('general') {
            <div class="bg-white border rounded-xl p-6 grid md:grid-cols-2 gap-4 max-w-3xl">
              <label class="block text-sm">Platform Name<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="general.platformName" /></label>
              <label class="block text-sm">Support Email<input type="email" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="general.supportEmail" /></label>
              <label class="block text-sm">Support Phone<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="general.supportPhone" /></label>
              <label class="block text-sm">Timezone<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="general.timezone" /></label>
              <label class="block text-sm">Default Currency<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="general.defaultCurrency" /></label>
              <label class="block text-sm">Logo URL<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="general.logoUrl" /></label>
              <label class="flex items-center gap-2 text-sm md:col-span-2">
                <input type="checkbox" [(ngModel)]="general.maintenanceMode" /> Maintenance mode
              </label>
              <button type="button" (click)="saveGeneral()" class="md:col-span-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm w-fit" [disabled]="settingsService.saving()">Save General Settings</button>
            </div>
          }
          @case ('email') {
            <div class="bg-white border rounded-xl p-6 grid md:grid-cols-2 gap-4 max-w-3xl">
              <label class="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" [(ngModel)]="email.enabled" /> Enable email</label>
              <label class="block text-sm">Provider
                <select class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="email.provider">
                  <option value="smtp">SMTP</option><option value="sendgrid">SendGrid</option><option value="ses">AWS SES</option>
                </select>
              </label>
              <label class="block text-sm">SMTP Host<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="email.smtpHost" /></label>
              <label class="block text-sm">SMTP Port<input type="number" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="email.smtpPort" /></label>
              <label class="block text-sm">SMTP User<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="email.smtpUser" /></label>
              <label class="block text-sm">SMTP Password<input type="password" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="email.smtpPassword" placeholder="Leave blank to keep current" /></label>
              <label class="block text-sm">From Email<input type="email" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="email.fromEmail" /></label>
              <label class="block text-sm">From Name<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="email.fromName" /></label>
              <button type="button" (click)="saveEmail()" class="md:col-span-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm w-fit" [disabled]="settingsService.saving()">Save Email Settings</button>
            </div>
          }
          @case ('sms') {
            <div class="bg-white border rounded-xl p-6 grid md:grid-cols-2 gap-4 max-w-3xl">
              <label class="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" [(ngModel)]="sms.enabled" /> Enable SMS</label>
              <label class="block text-sm">Provider
                <select class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="sms.provider">
                  <option value="twilio">Twilio</option><option value="local">Local</option><option value="custom">Custom</option>
                </select>
              </label>
              <label class="block text-sm">Sender ID<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="sms.senderId" /></label>
              <label class="block text-sm">API Key<input type="password" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="sms.apiKey" /></label>
              <label class="block text-sm">API Secret<input type="password" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="sms.apiSecret" /></label>
              <label class="block text-sm md:col-span-2">Base URL<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="sms.baseUrl" /></label>
              <button type="button" (click)="saveSms()" class="md:col-span-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm w-fit" [disabled]="settingsService.saving()">Save SMS Settings</button>
            </div>
          }
          @case ('payment') {
            <div class="bg-white border rounded-xl p-6 space-y-6 max-w-3xl">
              <div class="grid md:grid-cols-2 gap-4">
                <label class="block text-sm">Default Gateway
                  <select class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="payment.defaultGateway">
                    <option value="jazzcash">JazzCash</option><option value="easypaisa">EasyPaisa</option>
                  </select>
                </label>
                <label class="flex items-center gap-2 text-sm mt-6"><input type="checkbox" [(ngModel)]="payment.onlinePaymentsEnabled" /> Online payments enabled</label>
                <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="payment.sandboxMode" /> Sandbox mode</label>
              </div>
              <div class="border-t pt-4">
                <h3 class="font-medium mb-3">JazzCash</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <label class="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" [(ngModel)]="payment.jazzcash.enabled" /> Enabled</label>
                  <label class="block text-sm">Merchant ID<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="payment.jazzcash.merchantId" /></label>
                  <label class="block text-sm">Password<input type="password" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="payment.jazzcash.password" /></label>
                  <label class="block text-sm">Integrity Salt<input type="password" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="payment.jazzcash.integritySalt" /></label>
                  <label class="block text-sm">Return URL<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="payment.jazzcash.returnUrl" /></label>
                </div>
              </div>
              <div class="border-t pt-4">
                <h3 class="font-medium mb-3">EasyPaisa</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <label class="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" [(ngModel)]="payment.easypaisa.enabled" /> Enabled</label>
                  <label class="block text-sm">Store ID<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="payment.easypaisa.storeId" /></label>
                  <label class="block text-sm">Hash Key<input type="password" class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="payment.easypaisa.hashKey" /></label>
                  <label class="block text-sm md:col-span-2">Return URL<input class="mt-1 w-full border rounded-lg px-3 py-2" [(ngModel)]="payment.easypaisa.returnUrl" /></label>
                </div>
              </div>
              <button type="button" (click)="savePayment()" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm" [disabled]="settingsService.saving()">Save Payment Settings</button>
            </div>
          }
          @case ('flags') {
            <div class="bg-white border rounded-xl p-6 grid md:grid-cols-2 gap-3 max-w-2xl">
              @for (flag of flagList; track flag.key) {
                <label class="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" [checked]="flags[flag.key]" (change)="toggleFlag(flag.key, $event)" />
                  {{ flag.label }}
                </label>
              }
              <button type="button" (click)="saveFlags()" class="md:col-span-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm w-fit mt-2" [disabled]="settingsService.saving()">Save Feature Flags</button>
            </div>
          }
        }
      }
    </div>
  `,
})
export class AdminSettingsPageComponent implements OnInit {
  protected readonly settingsService = inject(SettingsService);
  readonly activeTab = signal<SettingsTab>('general');
  readonly tabs: { id: SettingsTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    { id: 'payment', label: 'Payment' },
    { id: 'flags', label: 'Feature Flags' },
  ];

  general: GeneralSettings = this.emptyGeneral();
  email: EmailSettings = this.emptyEmail();
  sms: SmsSettings = this.emptySms();
  payment: PaymentSettings = this.emptyPayment();
  flags: FeatureFlags = this.emptyFlags();

  readonly flagList: { key: keyof FeatureFlags; label: string }[] = [
    { key: 'videoConsultation', label: 'Video Consultation' },
    { key: 'pharmacy', label: 'Pharmacy Module' },
    { key: 'lab', label: 'Lab Module' },
    { key: 'chat', label: 'Real-time Chat' },
    { key: 'onlinePayments', label: 'Online Payments' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'selfRegistration', label: 'Self Registration' },
  ];

  constructor() {
    effect(() => {
      const s = this.settingsService.settings();
      if (!s) return;
      this.general = { ...s.general };
      this.email = { ...s.email };
      this.sms = { ...s.sms };
      this.payment = JSON.parse(JSON.stringify(s.payment));
      this.flags = { ...s.featureFlags };
    });
  }

  ngOnInit(): void {
    this.settingsService.clearMessages();
    this.settingsService.loadSettings();
  }

  saveGeneral(): void {
    this.settingsService.saveGeneral(this.general);
  }

  saveEmail(): void {
    const payload = { ...this.email };
    if (payload.smtpPassword === SETTINGS_MASK) delete (payload as Partial<EmailSettings>).smtpPassword;
    this.settingsService.saveEmail(payload);
  }

  saveSms(): void {
    const payload = { ...this.sms };
    if (payload.apiKey === SETTINGS_MASK) delete (payload as Partial<SmsSettings>).apiKey;
    if (payload.apiSecret === SETTINGS_MASK) delete (payload as Partial<SmsSettings>).apiSecret;
    this.settingsService.saveSms(payload);
  }

  savePayment(): void {
    const payload = JSON.parse(JSON.stringify(this.payment));
    if (payload.jazzcash?.password === SETTINGS_MASK) delete payload.jazzcash.password;
    if (payload.jazzcash?.integritySalt === SETTINGS_MASK) delete payload.jazzcash.integritySalt;
    if (payload.easypaisa?.hashKey === SETTINGS_MASK) delete payload.easypaisa.hashKey;
    this.settingsService.savePayment(payload);
  }

  saveFlags(): void {
    this.settingsService.saveFeatureFlags(this.flags);
  }

  toggleFlag(key: keyof FeatureFlags, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.flags = { ...this.flags, [key]: checked };
  }

  private emptyGeneral(): GeneralSettings {
    return { platformName: '', supportEmail: '', supportPhone: '', timezone: '', defaultCurrency: 'PKR', maintenanceMode: false, logoUrl: '' };
  }
  private emptyEmail(): EmailSettings {
    return { enabled: false, provider: 'smtp', smtpHost: '', smtpPort: 587, smtpSecure: false, smtpUser: '', smtpPassword: '', fromEmail: '', fromName: '' };
  }
  private emptySms(): SmsSettings {
    return { enabled: false, provider: 'twilio', apiKey: '', apiSecret: '', senderId: '', baseUrl: '' };
  }
  private emptyPayment(): PaymentSettings {
    return {
      defaultGateway: 'jazzcash', onlinePaymentsEnabled: true, sandboxMode: true,
      jazzcash: { enabled: true, merchantId: '', password: '', integritySalt: '', returnUrl: '', apiUrl: '' },
      easypaisa: { enabled: true, storeId: '', hashKey: '', returnUrl: '', apiUrl: '' },
    };
  }
  private emptyFlags(): FeatureFlags {
    return { videoConsultation: true, pharmacy: true, lab: true, chat: true, onlinePayments: true, reviews: true, notifications: true, selfRegistration: true };
  }
}
