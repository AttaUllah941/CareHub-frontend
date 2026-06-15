import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-role-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './role-table.component.html',
  styleUrl: './role-table.component.scss'
})
export class RoleTableComponent {
  readonly roles = input<Role[]>([]);
  readonly loading = input(false);
  readonly deleteRole = output<string>();
}
