import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

/** Dumb component — reset password form */
@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, AlertComponent],
  templateUrl: './reset-password-form.component.html',
  styleUrl: './reset-password-form.component.scss'
})
export class ResetPasswordFormComponent {
  readonly form = input.required<FormGroup>();
  readonly loading = input(false);
  readonly error = input('');
  readonly successMessage = input('');
  readonly submitted = output<void>();
}
