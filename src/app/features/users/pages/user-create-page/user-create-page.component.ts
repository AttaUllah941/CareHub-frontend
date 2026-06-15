import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserRole } from '../../../../core/models/auth.model';
import { UserService } from '../../services/user.service';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-user-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UserFormComponent],
  templateUrl: './user-create-page.component.html',
  styleUrl: './user-create-page.component.scss'
})
export class UserCreatePageComponent implements OnInit {
  protected readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: [UserRole.PATIENT, Validators.required],
    isActive: [true],
    isEmailVerified: [false],
  });

  ngOnInit(): void {
    this.userService.clearError();
    this.userService.clearSelectedUser();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.userService.createUser(this.form.getRawValue());
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
