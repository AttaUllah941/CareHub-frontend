import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss',
})
export class ConsultationFormComponent {
  readonly form = input.required<FormGroup>();
  readonly loading = input(false);
  readonly isEdit = input(false);
  readonly submitted = output<void>();
  readonly cancelled = output<void>();
}
