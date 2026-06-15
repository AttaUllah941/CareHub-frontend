import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-role-detail-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent, AlertComponent],
  templateUrl: './role-detail-page.component.html',
  styleUrl: './role-detail-page.component.scss'
})
export class RoleDetailPageComponent implements OnInit {
  protected readonly roleService = inject(RoleService);
  private readonly route = inject(ActivatedRoute);
  userId = '';

  ngOnInit(): void {
    this.roleService.clearError();
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      if (id) this.roleService.loadRole(id);
    });
  }

  onAssign(): void {
    const role = this.roleService.selectedRole();
    if (!role || !this.userId.trim()) return;
    this.roleService.assignRoleToUser(role.id, { userId: this.userId.trim() });
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this role?')) this.roleService.deleteRole(id);
  }
}
