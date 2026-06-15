import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient, UpdateMyPatientProfileRequest } from '../../../core/models/patient.model';

export function buildPatientForm(fb: FormBuilder, includeAccount: boolean): FormGroup {
  const group: Record<string, unknown> = {
    gender: [''],
    dateOfBirth: [''],
    address: [''],
    city: [''],
    country: [''],
    bloodGroup: [''],
    profileImageUrl: [''],
    emergencyContactName: [''],
    emergencyContactRelationship: [''],
    emergencyContactPhone: [''],
    emergencyContactEmail: ['', Validators.email],
    emergencyContactAddress: [''],
    chronicConditions: [''],
    currentMedications: [''],
    pastSurgeries: [''],
    medicalNotes: [''],
    allergies: fb.array([]),
  };

  if (includeAccount) {
    group['firstName'] = ['', Validators.required];
    group['lastName'] = ['', Validators.required];
    group['email'] = ['', [Validators.required, Validators.email]];
    group['phone'] = ['', Validators.required];
    group['password'] = ['', [Validators.required, Validators.minLength(8)]];
  }

  return fb.nonNullable.group(group);
}

export function addAllergyGroup(fb: FormBuilder): FormGroup {
  return fb.nonNullable.group({
    name: ['', Validators.required],
    severity: ['MILD', Validators.required],
    reaction: [''],
  });
}

export function patchPatientForm(form: FormGroup, patient: Patient, fb: FormBuilder): void {
  const allergies = form.get('allergies') as FormArray;
  allergies.clear();

  (patient.allergies ?? []).forEach((a) => {
    allergies.push(
      fb.nonNullable.group({
        name: [a.name, Validators.required],
        severity: [a.severity ?? 'MILD', Validators.required],
        reaction: [a.reaction ?? ''],
      }),
    );
  });

  const med = patient.medicalInformation ?? { chronicConditions: [], currentMedications: [], pastSurgeries: [], notes: '' };
  const ec = patient.emergencyContact ?? {};

  form.patchValue({
    gender: patient.gender ?? '',
    dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.slice(0, 10) : '',
    address: patient.address ?? '',
    city: patient.city ?? '',
    country: patient.country ?? '',
    bloodGroup: patient.bloodGroup ?? '',
    profileImageUrl: patient.profileImageUrl ?? '',
    emergencyContactName: ec.name ?? '',
    emergencyContactRelationship: ec.relationship ?? '',
    emergencyContactPhone: ec.phone ?? '',
    emergencyContactEmail: ec.email ?? '',
    emergencyContactAddress: ec.address ?? '',
    chronicConditions: (med.chronicConditions ?? []).join(', '),
    currentMedications: (med.currentMedications ?? []).join(', '),
    pastSurgeries: (med.pastSurgeries ?? []).join(', '),
    medicalNotes: med.notes ?? '',
  });

  if (patient.user) {
    form.patchValue({
      firstName: patient.user.firstName,
      lastName: patient.user.lastName,
      email: patient.user.email,
      phone: patient.user.phone,
    });
  }
}

function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function extractPatientPayload(form: FormGroup, includeAccount: boolean): UpdateMyPatientProfileRequest & Partial<CreatePatientFields> {
  const v = form.getRawValue();
  const allergies = (v.allergies ?? []).map((a: { name: string; severity: string; reaction?: string }) => ({
    name: a.name,
    severity: a.severity,
    reaction: a.reaction || undefined,
  }));

  const payload: UpdateMyPatientProfileRequest & Partial<CreatePatientFields> = {
    gender: v.gender || undefined,
    dateOfBirth: v.dateOfBirth || undefined,
    address: v.address || undefined,
    city: v.city || undefined,
    country: v.country || undefined,
    bloodGroup: v.bloodGroup || undefined,
    profileImageUrl: v.profileImageUrl || undefined,
    allergies,
    medicalInformation: {
      chronicConditions: splitCsv(v.chronicConditions),
      currentMedications: splitCsv(v.currentMedications),
      pastSurgeries: splitCsv(v.pastSurgeries),
      notes: v.medicalNotes || undefined,
    },
    emergencyContact: {
      name: v.emergencyContactName || undefined,
      relationship: v.emergencyContactRelationship || undefined,
      phone: v.emergencyContactPhone || undefined,
      email: v.emergencyContactEmail || undefined,
      address: v.emergencyContactAddress || undefined,
    },
  };

  if (includeAccount) {
    payload.firstName = v.firstName;
    payload.lastName = v.lastName;
    payload.email = v.email;
    payload.phone = v.phone;
    if (v.password) payload.password = v.password;
  }

  return payload;
}

interface CreatePatientFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}
