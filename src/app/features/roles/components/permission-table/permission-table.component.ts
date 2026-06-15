import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Permission } from '../../../../core/models/role.model';

@Component({
  selector: 'app-permission-table',
  standalone: true,
  imports: [],
  templateUrl: './permission-table.component.html',
  styleUrl: './permission-table.component.scss'
})
export class PermissionTableComponent {
  readonly permissions = input<Permission[]>([]);
  readonly loading = input(false);
  readonly deletePermission = output<string>();
}
