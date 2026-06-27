import { Component, inject, OnInit, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { isSafeInternalReturnUrl } from '../../../../core/utils/auth-navigation.util';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly returnUrl = computed(() => {
    const value = this.route.snapshot.queryParamMap.get('returnUrl');
    return isSafeInternalReturnUrl(value) ? value : null;
  });

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.authService.clearError();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authService.login(this.loginForm.getRawValue());
  }
}
