import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Doctor } from '../../../core/models/doctor.model';

export function buildDoctorForm(fb: FormBuilder, includeAccount = true): FormGroup {
  const group: Record<string, unknown> = {
    gender: [''],
    dateOfBirth: [''],
    address: [''],
    city: [''],
    country: [''],
    bio: [''],
    title: [''],
    licenseNumber: [''],
    licenseAuthority: [''],
    medicalRegistrationNumber: [''],
    about: [''],
    yearsOfExperience: [null as number | null],
    experienceSummary: [''],
    workHistory: fb.array([]),
    specialtyIds: [[] as string[]],
    qualifications: fb.array([]),
    languageIds: [[] as string[]],
    consultationFee: [null as number | null],
    currency: ['USD'],
    profileImageUrl: [''],
  };

  if (includeAccount) {
    Object.assign(group, {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      isActive: [true],
    });
  }

  return fb.group(group);
}

export function addQualificationGroup(fb: FormBuilder): FormGroup {
  return fb.group({
    degree: ['', Validators.required],
    institution: ['', Validators.required],
    year: [null as number | null],
    certificateUrl: [''],
  });
}

export function addWorkHistoryGroup(fb: FormBuilder): FormGroup {
  return fb.group({
    organization: ['', Validators.required],
    position: ['', Validators.required],
    startYear: [null as number | null],
    endYear: [null as number | null],
    isCurrent: [false],
  });
}

export function patchDoctorForm(form: FormGroup, doctor: Doctor, fb: FormBuilder): void {
  form.patchValue({
    firstName: doctor.user?.firstName ?? '',
    lastName: doctor.user?.lastName ?? '',
    email: doctor.user?.email ?? '',
    phone: doctor.user?.phone ?? '',
    isActive: doctor.user?.isActive ?? true,
    gender: doctor.gender ?? '',
    dateOfBirth: doctor.dateOfBirth ? doctor.dateOfBirth.split('T')[0] : '',
    address: doctor.address ?? '',
    city: doctor.city ?? '',
    country: doctor.country ?? '',
    bio: doctor.bio ?? '',
    title: doctor.title ?? '',
    licenseNumber: doctor.licenseNumber ?? '',
    licenseAuthority: doctor.licenseAuthority ?? '',
    medicalRegistrationNumber: doctor.medicalRegistrationNumber ?? '',
    about: doctor.about ?? '',
    yearsOfExperience: doctor.yearsOfExperience ?? null,
    experienceSummary: doctor.experienceSummary ?? '',
    specialtyIds: doctor.specialtyIds ?? [],
    languageIds: doctor.languageIds ?? [],
    consultationFee: doctor.consultationFee ?? null,
    currency: doctor.currency ?? 'USD',
    profileImageUrl: doctor.profileImageUrl ?? '',
  });

  const qualifications = form.get('qualifications') as FormArray;
  qualifications.clear();
  (doctor.qualifications ?? []).forEach((q) => {
    qualifications.push(
      fb.group({
        degree: [q.degree, Validators.required],
        institution: [q.institution, Validators.required],
        year: [q.year ?? null],
        certificateUrl: [q.certificateUrl ?? ''],
      }),
    );
  });

  const workHistory = form.get('workHistory') as FormArray;
  workHistory.clear();
  (doctor.workHistory ?? []).forEach((w) => {
    workHistory.push(
      fb.group({
        organization: [w.organization, Validators.required],
        position: [w.position, Validators.required],
        startYear: [w.startYear ?? null],
        endYear: [w.endYear ?? null],
        isCurrent: [w.isCurrent ?? false],
      }),
    );
  });
}

export function extractProfilePayload(form: FormGroup, includeAccount = true): Record<string, unknown> {
  const raw = form.getRawValue();
  const payload: Record<string, unknown> = {
    gender: raw.gender || undefined,
    dateOfBirth: raw.dateOfBirth || undefined,
    address: raw.address || undefined,
    city: raw.city || undefined,
    country: raw.country || undefined,
    bio: raw.bio || undefined,
    title: raw.title || undefined,
    licenseNumber: raw.licenseNumber || undefined,
    licenseAuthority: raw.licenseAuthority || undefined,
    medicalRegistrationNumber: raw.medicalRegistrationNumber || undefined,
    about: raw.about || undefined,
    yearsOfExperience: raw.yearsOfExperience ?? undefined,
    experienceSummary: raw.experienceSummary || undefined,
    specialtyIds: raw.specialtyIds ?? [],
    languageIds: raw.languageIds ?? [],
    qualifications: raw.qualifications ?? [],
    workHistory: raw.workHistory ?? [],
    consultationFee: raw.consultationFee ?? undefined,
    currency: raw.currency || undefined,
    profileImageUrl: raw.profileImageUrl || undefined,
  };

  if (includeAccount) {
    Object.assign(payload, {
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      isActive: raw.isActive,
    });
    if (raw.password) payload['password'] = raw.password;
  }

  return payload;
}
