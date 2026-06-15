import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserListQuery, USER_ROLE_OPTIONS, USER_SORT_FIELDS } from '../../../../core/models/user.model';

/** Dumb component — user list filters and sorting controls */
@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-filters.component.html',
  styleUrl: './user-filters.component.scss'
})
export class UserFiltersComponent {
  readonly query = input.required<UserListQuery>();
  readonly filterChange = output<Partial<UserListQuery>>();

  readonly roleOptions = USER_ROLE_OPTIONS;
  readonly sortFields = USER_SORT_FIELDS;

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  onSearchChange(value: string): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filterChange.emit({ search: value, page: 1 });
    }, 400);
  }
}
