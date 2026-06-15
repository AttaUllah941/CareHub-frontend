import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PERMISSION_MODULES } from '../../../../core/models/role.model';
import { RoleService } from '../../services/role.service';
import { PermissionTableComponent } from '../../components/permission-table/permission-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-permission-list-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PermissionTableComponent,
    PaginationComponent,
    ButtonComponent,
    AlertComponent,
    InputComponent,
  ],
  templateUrl: './permission-list-page.component.html',
  styleUrl: './permission-list-page.component.scss'
})
export class PermissionListPageComponent implements OnInit {
  protected readonly roleService = inject(RoleService);
  private readonly fb = inject(FormBuilder);
  readonly modules = PERMISSION_MODULES;

  createForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z]+:[a-z]+$/)]],
    module: ['users', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.roleService.clearError();
    this.roleService.loadPermissions({});
  }

  onCreate(): void {
    if (this.createForm.invalid) return;
    this.roleService.createPermission(this.createForm.getRawValue());
    this.createForm.reset({ module: 'users' });
    this.roleService.loadPermissions({});
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this permission?')) {
      this.roleService.deletePermission(id);
    }
  }
}
