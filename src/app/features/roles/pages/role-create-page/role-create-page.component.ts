import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { RoleFormComponent } from '../../components/role-form/role-form.component';

@Component({
  selector: 'app-role-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RoleFormComponent],
  templateUrl: './role-create-page.component.html',
  styleUrl: './role-create-page.component.scss'
})
export class RoleCreatePageComponent implements OnInit {
  protected readonly roleService = inject(RoleService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Z0-9_]*$/)]],
    description: [''],
  });

  ngOnInit(): void {
    this.roleService.clearError();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.roleService.createRole(this.form.getRawValue());
  }
}
