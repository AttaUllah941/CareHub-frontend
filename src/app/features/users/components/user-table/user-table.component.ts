import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ManagedUser } from '../../../../core/models/user.model';

/** Dumb component — user data table */
@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {
  readonly users = input<ManagedUser[]>([]);
  readonly loading = input(false);
  readonly deleteUser = output<string>();
}
