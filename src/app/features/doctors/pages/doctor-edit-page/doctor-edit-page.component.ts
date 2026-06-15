import { Component, effect, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorFormComponent } from '../../components/doctor-form/doctor-form.component';
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

@Component({
  selector: 'app-doctor-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DoctorFormComponent, ButtonComponent],
  templateUrl: './doctor-edit-page.component.html',
  styleUrl: './doctor-edit-page.component.scss',
})
export class DoctorEditPageComponent implements OnInit {
  protected readonly doctorService = inject(DoctorService);
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  protected readonly languageService = inject(LanguageService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  doctorId = '';
  form = buildDoctorForm(this.fb, true);

  constructor() {
    effect(() => {
      const doctor = this.doctorService.selectedDoctor();
      if (doctor && doctor.id === this.doctorId) {
        patchDoctorForm(this.form, doctor, this.fb);
        if (this.form.contains('password')) {
          this.form.removeControl('password');
        }
      }
    });
  }

  ngOnInit(): void {
    this.doctorService.clearError();
    this.specialtyService.loadAllSpecialties();
    this.languageService.loadAllLanguages();
    this.route.paramMap.subscribe((p) => {
      this.doctorId = p.get('id') ?? '';
      if (this.doctorId) this.doctorService.loadDoctor(this.doctorId);
    });
  }

  addQualification(): void {
    (this.form.get('qualifications') as FormArray).push(addQualificationGroup(this.fb));
  }

  addWorkEntry(): void {
    (this.form.get('workHistory') as FormArray).push(addWorkHistoryGroup(this.fb));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { password, ...payload } = extractProfilePayload(this.form, true);
    this.doctorService.updateDoctor(this.doctorId, payload as never);
  }
}
