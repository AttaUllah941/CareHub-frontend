import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MedicineOrder } from '../../../../core/models/medicine.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { formatMedicinePrice } from '../../../marketplace/utils/marketplace-display.util';
import { MedicinesApiService } from '../../services/medicines-api.service';

@Component({
  selector: 'app-medicine-order-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './medicine-order-detail-page.component.html',
  styleUrl: './medicine-order-detail-page.component.scss',
})
export class MedicineOrderDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly medicinesApi = inject(MedicinesApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly orderId = signal('');
  readonly order = signal<MedicineOrder | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('orderId') ?? '';
      this.orderId.set(id);
      if (id && this.isBrowser) {
        this.loadOrder(id);
      } else if (!id) {
        this.order.set(null);
      }
    });
  }

  loadOrder(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.medicinesApi.getOrderById(id).subscribe({
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

  formatPrice(amount: number): string {
    return formatMedicinePrice(amount);
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      placed: 'Order placed',
      confirmed: 'Order confirmed',
      preparing: 'Preparing your order',
      out_for_delivery: 'Out for delivery',
      ready_for_pickup: 'Ready for pickup',
      delivered: 'Delivered',
      picked_up: 'Picked up',
      cancelled: 'Cancelled',
    };
    return labels[status] ?? status;
  }

  lineTotal(unitPrice: number, quantity: number): number {
    return unitPrice * quantity;
  }
}
