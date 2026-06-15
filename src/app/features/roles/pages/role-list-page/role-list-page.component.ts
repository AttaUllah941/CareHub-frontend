import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { RoleTableComponent } from '../../components/role-table/role-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { RoleListQuery } from '../../../../core/models/role.model';

@Component({
  selector: 'app-role-list-page',
  standalone: true,
  imports: [FormsModule, RouterLink, RoleTableComponent, PaginationComponent, ButtonComponent, AlertComponent],
  templateUrl: './role-list-page.component.html',
  styleUrl: './role-list-page.component.scss'
})
export class RoleListPageComponent implements OnInit {
  protected readonly roleService = inject(RoleService);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.roleService.clearError();
    this.roleService.clearSuccessMessage();
    this.roleService.loadRoles({});
  }

  onSearch(value: string): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.roleService.loadRoles({ search: value, page: 1 }), 400);
  }

  onFilter(query: Partial<RoleListQuery>): void {
    this.roleService.loadRoles(query);
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this role?')) this.roleService.deleteRole(id);
  }
}
