import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordFormComponent } from '../../components/change-password-form/change-password-form.component';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, ChangePasswordFormComponent],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.scss'
})
export class ChangePasswordPageComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  changeForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  ngOnInit(): void {
    this.authService.clearError();
    this.authService.clearSuccessMessage();
  }

  onSubmit(): void {
    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }
    this.authService.changePassword(this.changeForm.getRawValue());
  }
}
