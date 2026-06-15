import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserRole } from '../../../../core/models/auth.model';
import { UserService } from '../../services/user.service';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-user-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UserFormComponent, AlertComponent],
  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.scss'
})
export class UserEditPageComponent implements OnInit {
  protected readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  userId = '';

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]],
    password: [''],
    role: [UserRole.PATIENT, Validators.required],
    isActive: [true],
    isEmailVerified: [false],
  });

  constructor() {
    effect(() => {
      const user = this.userService.selectedUser();
      if (user && user.id === this.userId) {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
        });
      }
    });
  }

  ngOnInit(): void {
    this.userService.clearError();
    this.userService.clearSuccessMessage();

    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id') ?? '';
      if (this.userId) this.userService.loadUser(this.userId);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, ...rest } = this.form.getRawValue();
    const payload = password ? { ...rest, password } : rest;
    this.userService.updateUser(this.userId, payload);
  }

  onCancel(): void {
    this.router.navigate(['/admin/users', this.userId]);
  }
}
