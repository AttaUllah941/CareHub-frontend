import { DatePipe, TitleCasePipe } from '@angular/common';
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

@Component({
  selector: 'app-my-surgery-requests-page',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, DatePipe],
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
    const map: Record<SurgeryConsultationStatus, string> = {
      pending: 'bg-amber-100 text-amber-800',
      contacted: 'bg-sky-100 text-sky-800',
      scheduled: 'bg-emerald-100 text-emerald-800',
      closed: 'bg-gray-100 text-gray-600',
    };
    return map[status];
  }

  statusLabel(status: SurgeryConsultationStatus): string {
    const map: Record<SurgeryConsultationStatus, string> = {
      pending: 'Pending review',
      contacted: 'Hospital contacted you',
      scheduled: 'Consultation scheduled',
      closed: 'Closed',
    };
    return map[status];
  }
}
