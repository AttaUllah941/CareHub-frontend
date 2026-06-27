import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DoctorApplication, DoctorApplicationStatus } from '../../models/admin.model';
import { DoctorApplicationsAdminApiService } from '../../services/doctor-applications-admin-api.service';

@Component({
  selector: 'app-admin-doctor-applications-page',
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe],
  templateUrl: './admin-doctor-applications-page.component.html',
  styleUrl: './admin-doctor-applications-page.component.scss',
})
export class AdminDoctorApplicationsPageComponent implements OnInit {
  private readonly applicationsApi = inject(DoctorApplicationsAdminApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);

  readonly applications = signal<DoctorApplication[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly statusFilter = signal<DoctorApplicationStatus | ''>('pending');
  readonly actionId = signal<string | null>(null);
  readonly rejectReason = signal('');
  readonly rejectingId = signal<string | null>(null);

  readonly statuses: (DoctorApplicationStatus | '')[] = ['', 'pending', 'approved', 'rejected'];

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading.set(true);
    this.error.set(null);

    this.applicationsApi
      .list({
        page: 1,
        limit: 50,
        status: this.statusFilter() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.applications.set(res.data.applications);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(this.apiErrorService.getMessage(err));
          this.loading.set(false);
        },
      });
  }

  approve(id: string): void {
    this.actionId.set(id);
    this.applicationsApi.approve(id).subscribe({
      next: () => {
        this.notifications.showSuccess('Application approved.');
        this.actionId.set(null);
        this.loadApplications();
      },
      error: (err) => {
        this.notifications.showError(this.apiErrorService.getMessage(err));
        this.actionId.set(null);
      },
    });
  }

  startReject(id: string): void {
    this.rejectingId.set(id);
    this.rejectReason.set('');
  }

  cancelReject(): void {
    this.rejectingId.set(null);
    this.rejectReason.set('');
  }

  confirmReject(id: string): void {
    const reason = this.rejectReason().trim();
    if (reason.length < 3) {
      this.notifications.showError('Please provide a rejection reason (min 3 characters).');
      return;
    }

    this.actionId.set(id);
    this.applicationsApi.reject(id, reason).subscribe({
      next: () => {
        this.notifications.showSuccess('Application rejected.');
        this.actionId.set(null);
        this.rejectingId.set(null);
        this.loadApplications();
      },
      error: (err) => {
        this.notifications.showError(this.apiErrorService.getMessage(err));
        this.actionId.set(null);
      },
    });
  }
}
