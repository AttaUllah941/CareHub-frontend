import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FIND_DOCTOR_SPECIALTIES } from '../../../home/data/home-content';
import {
  AvailabilitySlot,
  DAY_OPTIONS,
  DoctorQualificationEntry,
  TIME_SLOT_OPTIONS,
  UploadedDocument,
} from '../../../doctor-portal/models/doctor-portal.model';
import { DoctorPortalService } from '../../../doctor-portal/services/doctor-portal.service';

type Step = 1 | 2 | 3 | 4 | 5;

@Component({
  selector: 'app-doctor-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './doctor-register-page.component.html',
  styleUrl: './doctor-register-page.component.scss',
})
export class DoctorRegisterPageComponent {
  private readonly portal = inject(DoctorPortalService);

  readonly specialties = FIND_DOCTOR_SPECIALTIES;
  readonly dayOptions = DAY_OPTIONS;
  readonly timeOptions = TIME_SLOT_OPTIONS;

  readonly step = signal<Step>(1);
  readonly submitted = signal(false);
  readonly applicationId = signal('');
  readonly submitError = signal('');

  readonly fullName = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly password = signal('');
  readonly confirmPassword = signal('');
  readonly specialization = signal('');
  readonly yearsOfExperience = signal<number | null>(null);
  readonly qualifications = signal<DoctorQualificationEntry[]>([
    { degree: '', institution: '', year: null },
  ]);

  readonly clinicName = signal('');
  readonly clinicAddress = signal('');
  readonly clinicCity = signal('Lahore');
  readonly clinicPhone = signal('');
  readonly consultationFee = signal<number | null>(null);
  readonly videoConsultationFee = signal<number | null>(null);

  readonly availability = signal<AvailabilitySlot[]>([]);
  readonly selectedDay = signal(1);
  readonly slotStart = signal('10:00 AM');
  readonly slotEnd = signal('02:00 PM');

  readonly licenseFile = signal<UploadedDocument | null>(null);
  readonly certFile = signal<UploadedDocument | null>(null);
  readonly photoFile = signal<UploadedDocument | null>(null);
  readonly idFile = signal<UploadedDocument | null>(null);

  readonly stepLabels = ['Professional', 'Clinic & Fees', 'Availability', 'Documents', 'Review'];

  readonly canProceedStep1 = computed(() => {
    const pw = this.password();
    return (
      this.fullName().trim().length >= 3 &&
      this.email().includes('@') &&
      this.phone().trim().length >= 10 &&
      pw.length >= 8 &&
      pw === this.confirmPassword() &&
      this.specialization() !== '' &&
      this.yearsOfExperience() !== null &&
      this.yearsOfExperience()! >= 0 &&
      this.qualifications().every((q) => q.degree.trim() && q.institution.trim())
    );
  });

  readonly canProceedStep2 = computed(
    () =>
      this.clinicName().trim() &&
      this.clinicAddress().trim() &&
      this.clinicCity().trim() &&
      this.clinicPhone().trim().length >= 10 &&
      this.consultationFee() !== null &&
      this.consultationFee()! > 0,
  );

  readonly canProceedStep3 = computed(() => this.availability().length > 0);

  readonly canProceedStep4 = computed(
    () => !!this.licenseFile() && !!this.photoFile() && !!this.idFile(),
  );

  readonly canSubmit = computed(
    () =>
      this.canProceedStep1() &&
      this.canProceedStep2() &&
      this.canProceedStep3() &&
      this.canProceedStep4(),
  );

  addQualification(): void {
    this.qualifications.update((list) => [...list, { degree: '', institution: '', year: null }]);
  }

  removeQualification(index: number): void {
    this.qualifications.update((list) => list.filter((_, i) => i !== index));
  }

  updateQualification(index: number, field: keyof DoctorQualificationEntry, value: string): void {
    this.qualifications.update((list) =>
      list.map((q, i) =>
        i === index
          ? {
              ...q,
              [field]: field === 'year' ? (value ? Number(value) : null) : value,
            }
          : q,
      ),
    );
  }

  addAvailabilitySlot(): void {
    const day = this.dayOptions.find((d) => d.value === this.selectedDay());
    if (!day) return;
    const slot: AvailabilitySlot = {
      day: day.value,
      dayLabel: day.label,
      startTime: this.slotStart(),
      endTime: this.slotEnd(),
    };
    this.availability.update((list) => {
      const filtered = list.filter((s) => s.day !== slot.day);
      return [...filtered, slot].sort((a, b) => a.day - b.day);
    });
  }

  removeSlot(day: number): void {
    this.availability.update((list) => list.filter((s) => s.day !== day));
  }

  onLicenseFile(event: Event): void { this.onFileSelected(event, 'license'); }
  onCertFile(event: Event): void { this.onFileSelected(event, 'cert'); }
  onPhotoFile(event: Event): void { this.onFileSelected(event, 'photo'); }
  onIdFile(event: Event): void { this.onFileSelected(event, 'id'); }

  onFileSelected(event: Event, target: 'license' | 'cert' | 'photo' | 'id'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.submitError.set('File must be under 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const doc: UploadedDocument = {
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: typeof reader.result === 'string' ? reader.result : undefined,
      };
      const setters = {
        license: this.licenseFile,
        cert: this.certFile,
        photo: this.photoFile,
        id: this.idFile,
      };
      setters[target].set(doc);
      this.submitError.set('');
    };
    reader.readAsDataURL(file);
  }

  nextStep(): void {
    const s = this.step();
    if (s < 5) this.step.set((s + 1) as Step);
  }

  prevStep(): void {
    const s = this.step();
    if (s > 1) this.step.set((s - 1) as Step);
  }

  goToStep(target: Step): void {
    this.step.set(target);
  }

  goToStepNumber(n: number): void {
    this.step.set(n as Step);
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.submitError.set('');

    const app = this.portal.submitApplication({
      fullName: this.fullName().trim(),
      email: this.email().trim(),
      phone: this.phone().trim(),
      password: this.password(),
      specialization: this.specialization(),
      qualifications: this.qualifications(),
      yearsOfExperience: this.yearsOfExperience()!,
      clinic: {
        name: this.clinicName().trim(),
        address: this.clinicAddress().trim(),
        city: this.clinicCity().trim(),
        phone: this.clinicPhone().trim(),
      },
      consultationFee: this.consultationFee()!,
      videoConsultationFee: this.videoConsultationFee() ?? this.consultationFee()!,
      availability: this.availability(),
      documents: {
        medicalLicense: this.licenseFile() ?? undefined,
        certifications: this.certFile() ?? undefined,
        profilePhoto: this.photoFile() ?? undefined,
        identityProof: this.idFile() ?? undefined,
      },
    });

    this.applicationId.set(app.id);
    this.submitted.set(true);
  }
}
