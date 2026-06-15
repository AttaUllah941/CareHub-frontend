import { Component, input, output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BLOOD_GROUP_OPTIONS, ALLERGY_SEVERITY_OPTIONS } from '../../../../core/models/patient.model';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, AlertComponent],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
})
export class PatientFormComponent {
  readonly form = input.required<FormGroup>();
  readonly mode = input<'admin' | 'profile'>('profile');
  readonly loading = input(false);
  readonly error = input('');
  readonly isEdit = input(false);
  readonly submitted = output<void>();
  readonly cancelled = output<void>();
  readonly addAllergy = output<void>();

  readonly bloodGroups = BLOOD_GROUP_OPTIONS;
  readonly severityOptions = ALLERGY_SEVERITY_OPTIONS;

  allergiesArray(): FormArray {
    return this.form().get('allergies') as FormArray;
  }

  removeAllergy(index: number): void {
    this.allergiesArray().removeAt(index);
  }
}
