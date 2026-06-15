import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResetPasswordFormComponent } from '../../components/reset-password-form/reset-password-form.component';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, ResetPasswordFormComponent],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  private readonly token = signal('');

  resetForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.authService.clearError();
    this.authService.clearSuccessMessage();

    this.route.queryParamMap.subscribe((params) => {
      this.token.set(params.get('token') ?? '');
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    if (!this.token()) {
      return;
    }

    const { password, confirmPassword } = this.resetForm.getRawValue();
    this.authService.resetPassword({ token: this.token(), password, confirmPassword });
  }
}
