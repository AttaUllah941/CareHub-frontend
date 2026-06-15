import { Component, input, output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss',
})
export class PrescriptionFormComponent {
  readonly form = input.required<FormGroup>();
  readonly loading = input(false);
  readonly isEdit = input(false);
  readonly submitted = output<void>();
  readonly cancelled = output<void>();
  readonly addMedicine = output<void>();
  readonly removeMedicine = output<number>();

  medicinesArray(): FormArray {
    return this.form().get('medicines') as FormArray;
  }

  medicineGroup(index: number): FormGroup {
    return this.medicinesArray().at(index) as FormGroup;
  }
}
