import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
import { PatientProfileCardComponent } from '../../components/patient-profile-card/patient-profile-card.component';
import {
  addAllergyGroup,
  buildPatientForm,
  extractPatientPayload,
  patchPatientForm,
} from '../../utils/patient-form.utils';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-patient-my-profile-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PatientFormComponent,
    PatientProfileCardComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './patient-my-profile-page.component.html',
  styleUrl: './patient-my-profile-page.component.scss',
})
export class PatientMyProfilePageComponent implements OnInit {
  protected readonly patientService = inject(PatientService);
  private readonly fb = inject(FormBuilder);

  readonly editing = signal(false);
  readonly isNewProfile = signal(false);
  form = buildPatientForm(this.fb, false);

  constructor() {
    effect(() => {
      const profile = this.patientService.myProfile();
      if (profile) {
        this.isNewProfile.set(false);
        patchPatientForm(this.form, profile, this.fb);
      }
    });
  }

  ngOnInit(): void {
    this.patientService.clearError();
    this.patientService.clearSuccessMessage();
    this.patientService.loadMyProfile();
  }

  startCreate(): void {
    this.isNewProfile.set(true);
    this.editing.set(true);
    (this.form.get('allergies') as FormArray).clear();
  }

  startEdit(): void {
    this.editing.set(true);
  }

  onAddAllergy(): void {
    (this.form.get('allergies') as FormArray).push(addAllergyGroup(this.fb));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const payload = extractPatientPayload(this.form, false);
    if (this.isNewProfile()) {
      this.patientService.createMyProfile(payload);
    } else {
      this.patientService.updateMyProfile(payload);
    }
    this.editing.set(false);
  }
}
