import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminDashboardStats } from '../../models/admin.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly stats = signal<AdminDashboardStats | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.adminApi.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  objectEntries(record: Record<string, number> | undefined): [string, number][] {
    return record ? Object.entries(record) : [];
  }
}
