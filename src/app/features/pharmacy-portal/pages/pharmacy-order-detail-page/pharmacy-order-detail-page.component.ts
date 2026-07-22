import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MedicineOrder } from '../../../../core/models/medicine.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { formatMedicinePrice } from '../../../marketplace/utils/marketplace-display.util';
import { PharmacyOrdersApiService } from '../../services/pharmacy-orders-api.service';

const NEXT_STATUS: Record<string, string[]> = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

@Component({
  selector: 'app-pharmacy-order-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './pharmacy-order-detail-page.component.html',
  styleUrl: './pharmacy-order-detail-page.component.scss',
})
export class PharmacyOrderDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersApi = inject(PharmacyOrdersApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly order = signal<MedicineOrder | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly actionStatus = signal<string | null>(null);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('orderId') ?? '';
      if (id && this.isBrowser) {
        this.loadOrder(id);
      }
    });
  }

  loadOrder(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.ordersApi.getOrder(id).subscribe({
      next: (res) => {
        this.order.set(res.data.order);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.order.set(null);
        this.loading.set(false);
      },
    });
  }

  nextStatuses(status: string): string[] {
    return NEXT_STATUS[status] ?? [];
  }

  updateStatus(status: string): void {
    const current = this.order();
    if (!current) return;

    this.actionStatus.set(status);
    this.ordersApi.updateStatus(current.id, status).subscribe({
      next: (res) => {
        this.order.set(res.data.order);
        this.notifications.showSuccess(`Order marked as ${this.statusLabel(status)}.`);
        this.actionStatus.set(null);
      },
      error: (err) => {
        this.notifications.showError(this.apiErrorService.getMessage(err));
        this.actionStatus.set(null);
      },
    });
  }

  formatPrice(amount: number): string {
    return formatMedicinePrice(amount);
  }

  statusLabel(status: string): string {
    return status.replace(/_/g, ' ');
  }

  lineTotal(unitPrice: number, quantity: number): number {
    return unitPrice * quantity;
  }
}
