import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardStatsSkeletonComponent } from '../../../../shared/components/skeleton';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-dashboard-page',
  standalone: true,
  imports: [RouterLink, DashboardStatsSkeletonComponent],
  templateUrl: './doctor-dashboard-page.component.html',
  styleUrl: './doctor-dashboard-page.component.scss',
})
export class DoctorDashboardPageComponent {
  readonly portal = inject(DoctorPortalService);
}
