import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-medical-specialty-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, AlertComponent],
  templateUrl: './medical-specialty-form.component.html',
  styleUrl: './medical-specialty-form.component.scss',
})
export class MedicalSpecialtyFormComponent {
  readonly form = input.required<FormGroup>();
  readonly loading = input(false);
  readonly error = input('');
  readonly isEdit = input(false);
  readonly submitted = output<void>();
  readonly cancelled = output<void>();
}
