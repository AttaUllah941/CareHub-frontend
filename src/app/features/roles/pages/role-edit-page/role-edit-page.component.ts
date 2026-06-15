import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { PermissionPickerComponent } from '../../components/permission-picker/permission-picker.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-role-edit-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RoleFormComponent,
    PermissionPickerComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './role-edit-page.component.html',
  styleUrl: './role-edit-page.component.scss'
})
export class RoleEditPageComponent implements OnInit {
  protected readonly roleService = inject(RoleService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  roleId = '';
  readonly selectedPermissionIds = signal<string[]>([]);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  constructor() {
    effect(() => {
      const role = this.roleService.selectedRole();
      if (role && role.id === this.roleId) {
        this.form.patchValue({
          name: role.name,
          description: role.description ?? '',
          isActive: role.isActive,
        });
        this.selectedPermissionIds.set(role.permissions.map((p) => p.id));
      }
    });
  }

  ngOnInit(): void {
    this.roleService.clearError();
    this.roleService.loadAllPermissions();
    this.route.paramMap.subscribe((p) => {
      this.roleId = p.get('id') ?? '';
      if (this.roleId) this.roleService.loadRole(this.roleId);
    });
  }

  onUpdate(): void {
    if (this.form.invalid) return;
    this.roleService.updateRole(this.roleId, this.form.getRawValue());
  }

  onSavePermissions(): void {
    this.roleService.assignPermissions(this.roleId, {
      permissionIds: this.selectedPermissionIds(),
    });
  }
}
