import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
import { addAllergyGroup, buildPatientForm, extractPatientPayload } from '../../utils/patient-form.utils';
import { CreatePatientRequest } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PatientFormComponent],
  templateUrl: './patient-create-page.component.html',
  styleUrl: './patient-create-page.component.scss',
})
export class PatientCreatePageComponent implements OnInit {
  protected readonly patientService = inject(PatientService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  form = buildPatientForm(this.fb, true);

  ngOnInit(): void {
    this.patientService.clearError();
  }

  onAddAllergy(): void {
    (this.form.get('allergies') as FormArray).push(addAllergyGroup(this.fb));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.patientService.createPatient(extractPatientPayload(this.form, true) as CreatePatientRequest);
  }

  onCancel(): void {
    this.router.navigate(['/admin/patients']);
  }
}
