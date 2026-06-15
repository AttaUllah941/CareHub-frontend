import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorFormComponent } from '../../components/doctor-form/doctor-form.component';
import { MedicalSpecialtyService } from '../../../medical-specialties/services/medical-specialty.service';
import { LanguageService } from '../../../languages/services/language.service';
import {
  addQualificationGroup,
  addWorkHistoryGroup,
  buildDoctorForm,
  extractProfilePayload,
} from '../../utils/doctor-form.utils';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-doctor-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DoctorFormComponent, ButtonComponent],
  templateUrl: './doctor-create-page.component.html',
  styleUrl: './doctor-create-page.component.scss',
})
export class DoctorCreatePageComponent implements OnInit {
  protected readonly doctorService = inject(DoctorService);
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  protected readonly languageService = inject(LanguageService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  form = buildDoctorForm(this.fb, true);

  ngOnInit(): void {
    this.doctorService.clearError();
    this.specialtyService.loadAllSpecialties();
    this.languageService.loadAllLanguages();
    (this.form.get('qualifications') as FormArray).push(addQualificationGroup(this.fb));
    (this.form.get('workHistory') as FormArray).push(addWorkHistoryGroup(this.fb));
  }

  addQualification(): void {
    (this.form.get('qualifications') as FormArray).push(addQualificationGroup(this.fb));
  }

  addWorkEntry(): void {
    (this.form.get('workHistory') as FormArray).push(addWorkHistoryGroup(this.fb));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.doctorService.createDoctor(extractProfilePayload(this.form, true) as never);
  }
}
