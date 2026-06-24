import { User } from '../../../core/models/auth.model';

export interface PatientFormDefaults {
  name: string;
  phone: string;
  email: string;
}

export function patientDefaultsFromUser(user: User | null | undefined): PatientFormDefaults {
  if (!user) {
    return { name: '', phone: '', email: '' };
  }

  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    phone: user.phone ?? '',
    email: user.email ?? '',
  };
}
