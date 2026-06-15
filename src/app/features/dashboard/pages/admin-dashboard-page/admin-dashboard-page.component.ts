import { Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStatWidgetComponent } from '../../components/dashboard-stat-widget/dashboard-stat-widget.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { formatDashboardAmount, revenueChangePercent } from '../../../../core/models/dashboard.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [DatePipe, RouterLink, DashboardStatWidgetComponent, AlertComponent],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
})
export class AdminDashboardPageComponent implements OnInit {
  protected readonly dashboardService = inject(DashboardService);
  protected readonly authService = inject(AuthService);

  readonly stats = this.dashboardService.adminStats;
  readonly loading = this.dashboardService.loading;
  readonly error = this.dashboardService.error;

  readonly revenueTrend = computed(() => {
    const r = this.stats()?.revenue;
    if (!r) return null;
    return revenueChangePercent(r.thisMonth, r.lastMonth);
  });

  readonly formatAmount = formatDashboardAmount;

  ngOnInit(): void {
    this.dashboardService.clearError();
    this.dashboardService.loadAdminStats();
  }

  refresh(): void {
    this.dashboardService.loadAdminStats();
  }
}
