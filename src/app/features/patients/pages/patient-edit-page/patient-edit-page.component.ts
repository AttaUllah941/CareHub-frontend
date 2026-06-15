import { Component, effect, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
import {
  addAllergyGroup,
  buildPatientForm,
  extractPatientPayload,
  patchPatientForm,
} from '../../utils/patient-form.utils';

@Component({
  selector: 'app-patient-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PatientFormComponent],
  templateUrl: './patient-edit-page.component.html',
  styleUrl: './patient-edit-page.component.scss',
})
export class PatientEditPageComponent implements OnInit {
  protected readonly patientService = inject(PatientService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private patientId = '';

  form = buildPatientForm(this.fb, true);

  constructor() {
    effect(() => {
      const patient = this.patientService.selectedPatient();
      if (!patient || patient.id !== this.patientId) return;
      patchPatientForm(this.form, patient, this.fb);
      this.form.removeControl('password');
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ?? '';
    this.patientService.clearError();
    this.patientService.loadPatient(this.patientId);
  }

  onAddAllergy(): void {
    (this.form.get('allergies') as FormArray).push(addAllergyGroup(this.fb));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.patientService.updatePatient(this.patientId, extractPatientPayload(this.form, true));
  }

  onCancel(): void {
    this.router.navigate(['/admin/patients', this.patientId]);
  }

  get patientIdForLink(): string {
    return this.patientId;
  }
}
