export interface GeneralSettings {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  logoUrl: string;
}

export interface EmailSettings {
  enabled: boolean;
  provider: 'smtp' | 'sendgrid' | 'ses';
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

export interface SmsSettings {
  enabled: boolean;
  provider: 'twilio' | 'local' | 'custom';
  apiKey: string;
  apiSecret: string;
  senderId: string;
  baseUrl: string;
}

export interface GatewaySettings {
  enabled: boolean;
  merchantId?: string;
  password?: string;
  integritySalt?: string;
  returnUrl?: string;
  apiUrl?: string;
  storeId?: string;
  hashKey?: string;
}

export interface PaymentSettings {
  defaultGateway: 'jazzcash' | 'easypaisa';
  onlinePaymentsEnabled: boolean;
  sandboxMode: boolean;
  jazzcash: GatewaySettings;
  easypaisa: GatewaySettings;
}

export interface FeatureFlags {
  videoConsultation: boolean;
  pharmacy: boolean;
  lab: boolean;
  chat: boolean;
  onlinePayments: boolean;
  reviews: boolean;
  notifications: boolean;
  selfRegistration: boolean;
}

export interface SystemSettings {
  id: string;
  general: GeneralSettings;
  email: EmailSettings;
  sms: SmsSettings;
  payment: PaymentSettings;
  featureFlags: FeatureFlags;
  updatedAt?: string;
}

export interface PublicSettings {
  platformName: string;
  maintenanceMode: boolean;
  defaultCurrency: string;
  featureFlags: FeatureFlags;
  onlinePaymentsEnabled: boolean;
}

export const SETTINGS_MASK = '********';
