import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorFormComponent } from '../../components/doctor-form/doctor-form.component';
import { DoctorProfileCardComponent } from '../../components/doctor-profile-card/doctor-profile-card.component';
import { MedicalSpecialtyService } from '../../../medical-specialties/services/medical-specialty.service';
import { LanguageService } from '../../../languages/services/language.service';
import {
  addQualificationGroup,
  addWorkHistoryGroup,
  buildDoctorForm,
  extractProfilePayload,
  patchDoctorForm,
} from '../../utils/doctor-form.utils';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-doctor-my-profile-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DoctorFormComponent,
    DoctorProfileCardComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './doctor-my-profile-page.component.html',
  styleUrl: './doctor-my-profile-page.component.scss',
})
export class DoctorMyProfilePageComponent implements OnInit {
  protected readonly doctorService = inject(DoctorService);
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  protected readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);

  readonly editing = signal(false);
  readonly isNewProfile = signal(false);
  form = buildDoctorForm(this.fb, false);

  constructor() {
    effect(() => {
      const profile = this.doctorService.myProfile();
      if (profile) {
        this.isNewProfile.set(false);
        patchDoctorForm(this.form, profile, this.fb);
      }
    });
  }

  ngOnInit(): void {
    this.doctorService.clearError();
    this.specialtyService.loadAllSpecialties();
    this.languageService.loadAllLanguages();
    this.doctorService.loadMyProfile();
  }

  startCreate(): void {
    this.isNewProfile.set(true);
    this.editing.set(true);
    (this.form.get('qualifications') as FormArray).clear();
    (this.form.get('workHistory') as FormArray).clear();
    (this.form.get('qualifications') as FormArray).push(addQualificationGroup(this.fb));
    (this.form.get('workHistory') as FormArray).push(addWorkHistoryGroup(this.fb));
  }

  startEdit(): void {
    this.editing.set(true);
  }

  addQualification(): void {
    (this.form.get('qualifications') as FormArray).push(addQualificationGroup(this.fb));
  }

  addWorkEntry(): void {
    (this.form.get('workHistory') as FormArray).push(addWorkHistoryGroup(this.fb));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const payload = extractProfilePayload(this.form, false);
    if (this.isNewProfile()) {
      this.doctorService.createMyProfile(payload as never);
    } else {
      this.doctorService.updateMyProfile(payload as never);
    }
    this.editing.set(false);
  }
}
