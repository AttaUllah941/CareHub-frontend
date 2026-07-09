import { User } from '../../../core/models/auth.model';

export interface PatientFormDefaults {
  name: string;
  phone: string;
  email: string;
}

/** Strips +92 / 92 / leading 0 so the input shows local digits only (UI already shows +92). */
export function toLocalPhoneDigits(phone: string | null | undefined): string {
  if (!phone) return '';

  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length > 10) {
    digits = digits.slice(2);
  }
  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }
  return digits;
}

export function patientDefaultsFromUser(user: User | null | undefined): PatientFormDefaults {
  if (!user) {
    return { name: '', phone: '', email: '' };
  }

  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    phone: toLocalPhoneDigits(user.phone),
    email: user.email ?? '',
  };
}
