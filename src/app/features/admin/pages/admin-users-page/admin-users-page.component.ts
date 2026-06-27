import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../../../core/models/auth.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AdminUser } from '../../models/admin.model';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-users-page.component.html',
  styleUrl: './admin-users-page.component.scss',
})
export class AdminUsersPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);

  readonly users = signal<AdminUser[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly roleFilter = signal('');
  readonly actionId = signal<string | null>(null);

  readonly roles = Object.values(UserRole);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.adminApi
      .listUsers({
        page: 1,
        limit: 50,
        search: this.search().trim() || undefined,
        role: (this.roleFilter() as UserRole) || undefined,
      })
      .subscribe({
        next: (res) => {
          this.users.set(res.data.users);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(this.apiErrorService.getMessage(err));
          this.loading.set(false);
        },
      });
  }

  toggleActive(user: AdminUser): void {
    this.actionId.set(user.id);
    this.adminApi.updateUserStatus(user.id, !user.isActive).subscribe({
      next: () => {
        this.notifications.showSuccess(`User ${user.isActive ? 'deactivated' : 'activated'}.`);
        this.actionId.set(null);
        this.loadUsers();
      },
      error: (err) => {
        this.notifications.showError(this.apiErrorService.getMessage(err));
        this.actionId.set(null);
      },
    });
  }
}
