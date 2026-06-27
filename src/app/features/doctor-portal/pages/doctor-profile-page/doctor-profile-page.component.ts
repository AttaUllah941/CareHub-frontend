import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import { DoctorPortalProfile } from '../../models/doctor-portal.model';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-profile-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './doctor-profile-page.component.html',
  styleUrl: './doctor-profile-page.component.scss',
})
export class DoctorProfilePageComponent implements OnInit {
  readonly portal = inject(DoctorPortalService);
  protected readonly referenceData = inject(ReferenceDataService);
  readonly draft = signal<DoctorPortalProfile | null>(null);
  readonly saved = signal(false);

  constructor() {
    effect(() => {
      if (this.portal.loading()) return;
      const profile = this.portal.currentProfile();
      if (profile) {
        this.draft.set({
          ...profile,
          clinic: { ...profile.clinic },
          qualifications: profile.qualifications.map((q) => ({ ...q })),
        });
      }
    });
  }

  ngOnInit(): void {
    this.referenceData.loadSpecialties();
  }

  save(): void {
    const draft = this.draft();
    if (!draft) return;

    this.portal.updateProfile({
      specialization: draft.specialization,
      qualifications: draft.qualifications,
      yearsOfExperience: draft.yearsOfExperience,
      clinic: draft.clinic,
      consultationFee: draft.consultationFee,
      videoConsultationFee: draft.videoConsultationFee,
      bio: draft.bio,
    });
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  updateField(field: string, value: string | number): void {
    const current = this.draft();
    if (!current) return;

    if (field === 'specialization') {
      this.draft.set({ ...current, specialization: String(value) });
    } else if (field === 'yearsOfExperience') {
      this.draft.set({ ...current, yearsOfExperience: Number(value) });
    } else if (field === 'bio') {
      this.draft.set({ ...current, bio: String(value) });
    } else if (field === 'consultationFee') {
      this.draft.set({ ...current, consultationFee: Number(value) });
    } else if (field === 'videoConsultationFee') {
      this.draft.set({ ...current, videoConsultationFee: Number(value) });
    } else if (field.startsWith('clinic.')) {
      const key = field.split('.')[1] as keyof typeof current.clinic;
      this.draft.set({
        ...current,
        clinic: { ...current.clinic, [key]: value },
      });
    }
  }
}
