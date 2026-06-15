import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserFiltersComponent } from '../../components/user-filters/user-filters.component';
import { UserTableComponent } from '../../components/user-table/user-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { UserListQuery } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [
    RouterLink,
    UserFiltersComponent,
    UserTableComponent,
    PaginationComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './user-list-page.component.html',
  styleUrl: './user-list-page.component.scss'
})
export class UserListPageComponent implements OnInit {
  protected readonly userService = inject(UserService);

  ngOnInit(): void {
    this.userService.clearError();
    this.userService.clearSuccessMessage();
    this.userService.loadUsers({});
  }

  onFilterChange(query: Partial<UserListQuery>): void {
    this.userService.loadUsers(query);
  }

  onPageChange(page: number): void {
    this.userService.loadUsers({ page });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.userService.deleteUser(id);
    }
  }
}
