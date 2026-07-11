import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  SurgeryConsultationRequest,
  SurgeryConsultationStatus,
} from '../../../../core/models/surgery.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { formatSurgeryPriceRange } from '../../../marketplace/utils/marketplace-display.util';
import { SurgeriesApiService } from '../../services/surgeries-api.service';
import {
  surgeryConsultationStatusBadge,
  surgeryConsultationStatusLabel,
} from '../../../appointments/utils/booking-status.util';

@Component({
  selector: 'app-my-surgery-requests-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-surgery-requests-page.component.html',
  styleUrl: './my-surgery-requests-page.component.scss',
})
export class MySurgeryRequestsPageComponent implements OnInit {
  private readonly surgeriesApi = inject(SurgeriesApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly requests = signal<SurgeryConsultationRequest[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal<'all' | SurgeryConsultationStatus>('all');

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadRequests();
    }
  }

  loadRequests(): void {
    this.loading.set(true);
    this.error.set(null);

    const filter = this.filter();
    const status = filter === 'all' ? undefined : filter;

    this.surgeriesApi.listMine({ page: 1, limit: 50, status }).subscribe({
      next: (res) => {
        this.requests.set(res.data.consultationRequests);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  setFilter(value: string): void {
    this.filter.set(value as 'all' | SurgeryConsultationStatus);
    this.loadRequests();
  }

  formatCost(request: SurgeryConsultationRequest): string {
    const range = request.procedure?.estimatedCostRange;
    if (!range) return '—';
    return formatSurgeryPriceRange(range.min, range.max);
  }

  statusBadge(status: SurgeryConsultationStatus): string {
    return surgeryConsultationStatusBadge(status);
  }

  statusLabel(status: SurgeryConsultationStatus | string): string {
    return surgeryConsultationStatusLabel(status);
  }
}
