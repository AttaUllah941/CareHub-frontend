import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UploadsApiService } from '../../../../core/services/uploads-api.service';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import {
  AvailabilitySlot,
  DAY_OPTIONS,
  DoctorQualificationEntry,
  TIME_SLOT_OPTIONS,
  UploadedDocument,
} from '../../../doctor-portal/models/doctor-portal.model';
import { DoctorApplicationsApiService } from '../../../doctor-portal/services/doctor-applications-api.service';
import {
  normalizeUploadMimeType,
  splitFullName,
} from '../../../doctor-portal/utils/doctor-portal.util';

type Step = 1 | 2 | 3 | 4 | 5;
type DocumentTarget = 'license' | 'cert' | 'photo' | 'id';

interface StoredDocument extends UploadedDocument {
  file: File;
}

@Component({
  selector: 'app-doctor-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './doctor-register-page.component.html',
  styleUrl: './doctor-register-page.component.scss',
})
export class DoctorRegisterPageComponent implements OnInit {
  private readonly applicationsApi = inject(DoctorApplicationsApiService);
  private readonly uploadsApi = inject(UploadsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  protected readonly referenceData = inject(ReferenceDataService);

  readonly dayOptions = DAY_OPTIONS;
  readonly timeOptions = TIME_SLOT_OPTIONS;

  readonly step = signal<Step>(1);
  readonly submitted = signal(false);
  readonly applicationId = signal('');
  readonly submitError = signal('');
  readonly submitting = signal(false);

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

  readonly licenseFile = signal<StoredDocument | null>(null);
  readonly certFile = signal<StoredDocument | null>(null);
  readonly photoFile = signal<StoredDocument | null>(null);
  readonly idFile = signal<StoredDocument | null>(null);

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
      this.canProceedStep4() &&
      !this.submitting(),
  );

  ngOnInit(): void {
    this.referenceData.loadSpecialties();
    this.referenceData.loadLanguages();
  }

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

  onLicenseFile(event: Event): void {
    this.onFileSelected(event, 'license');
  }
  onCertFile(event: Event): void {
    this.onFileSelected(event, 'cert');
  }
  onPhotoFile(event: Event): void {
    this.onFileSelected(event, 'photo');
  }
  onIdFile(event: Event): void {
    this.onFileSelected(event, 'id');
  }

  onFileSelected(event: Event, target: DocumentTarget): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.submitError.set('File must be under 5 MB.');
      return;
    }

    const doc: StoredDocument = {
      name: file.name,
      type: file.type,
      size: file.size,
      file,
    };

    const setters = {
      license: this.licenseFile,
      cert: this.certFile,
      photo: this.photoFile,
      id: this.idFile,
    };
    setters[target].set(doc);
    this.submitError.set('');
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
    this.submitting.set(true);

    const uploads: { type: string; file: File }[] = [
      { type: 'medical_license', file: this.licenseFile()!.file },
      { type: 'profile_photo', file: this.photoFile()!.file },
      { type: 'identity_proof', file: this.idFile()!.file },
    ];

    const cert = this.certFile();
    if (cert) {
      uploads.push({ type: 'certification', file: cert.file });
    }

    forkJoin(
      uploads.map((item) =>
        this.uploadsApi.uploadApplicationFile(item.file).pipe(
          map((result) => ({
            type: item.type,
            url: result.url,
            mimeType: normalizeUploadMimeType(result.mimeType),
            size: result.size,
          })),
        ),
      ),
    ).subscribe({
      next: (documents) => {
        const { firstName, lastName } = splitFullName(this.fullName().trim());

        this.applicationsApi
          .create({
            firstName,
            lastName,
            email: this.email().trim(),
            phone: this.phone().trim(),
            password: this.password(),
            documents,
            specialtySlug: this.specialization(),
            yearsOfExperience: this.yearsOfExperience() ?? 0,
            qualifications: this.qualifications().map((q) => ({
              degree: q.degree.trim(),
              institution: q.institution.trim(),
              year: q.year ?? undefined,
            })),
            clinicName: this.clinicName().trim(),
            clinicAddress: this.clinicAddress().trim(),
            clinicCity: this.clinicCity().trim(),
            clinicPhone: this.clinicPhone().trim(),
            consultationFee: this.consultationFee() ?? 0,
            videoConsultationFee: this.videoConsultationFee() ?? undefined,
            availability: this.availability().map((slot) => ({
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime,
            })),
          })
          .subscribe({
            next: (application) => {
              this.applicationId.set(application.id);
              this.submitted.set(true);
              this.submitting.set(false);
              this.notifications.showSuccess(
                'Application submitted. An admin will review your documents before activation.',
              );
            },
            error: (err) => {
              this.submitting.set(false);
              this.submitError.set(this.apiErrorService.getMessage(err));
            },
          });
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(this.apiErrorService.getMessage(err));
      },
    });
  }
}
