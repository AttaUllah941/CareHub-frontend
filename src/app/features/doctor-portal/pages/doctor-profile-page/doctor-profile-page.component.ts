import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FIND_DOCTOR_SPECIALTIES } from '../../../home/data/home-content';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-profile-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './doctor-profile-page.component.html',
  styleUrl: './doctor-profile-page.component.scss',
})
export class DoctorProfilePageComponent {
  readonly portal = inject(DoctorPortalService);
  readonly specialties = FIND_DOCTOR_SPECIALTIES;
  readonly saved = signal(false);

  save(): void {
    const p = this.portal.currentProfile();
    if (!p) return;
    this.portal.updateProfile({
      fullName: p.fullName,
      phone: p.phone,
      specialization: p.specialization,
      qualifications: p.qualifications,
      yearsOfExperience: p.yearsOfExperience,
      clinic: p.clinic,
      consultationFee: p.consultationFee,
      videoConsultationFee: p.videoConsultationFee,
      bio: p.bio,
    });
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  updateField(field: string, value: string | number): void {
    const p = this.portal.currentProfile();
    if (!p) return;
    if (field === 'fullName') this.portal.updateProfile({ fullName: String(value) });
    else if (field === 'phone') this.portal.updateProfile({ phone: String(value) });
    else if (field === 'specialization') this.portal.updateProfile({ specialization: String(value) });
    else if (field === 'yearsOfExperience') this.portal.updateProfile({ yearsOfExperience: Number(value) });
    else if (field === 'bio') this.portal.updateProfile({ bio: String(value) });
    else if (field === 'consultationFee') this.portal.updateProfile({ consultationFee: Number(value) });
    else if (field === 'videoConsultationFee') this.portal.updateProfile({ videoConsultationFee: Number(value) });
    else if (field.startsWith('clinic.')) {
      const key = field.split('.')[1] as keyof typeof p.clinic;
      this.portal.updateProfile({ clinic: { ...p.clinic, [key]: value } });
    }
  }
}
