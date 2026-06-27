import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicineOrder } from '../../../../core/models/medicine.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { formatMedicinePrice } from '../../../marketplace/utils/marketplace-display.util';
import { MedicinesApiService } from '../../services/medicines-api.service';

@Component({
  selector: 'app-medicine-orders-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './medicine-orders-page.component.html',
  styleUrl: './medicine-orders-page.component.scss',
})
export class MedicineOrdersPageComponent implements OnInit {
  private readonly medicinesApi = inject(MedicinesApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly orders = signal<MedicineOrder[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.medicinesApi.listMyOrders().subscribe({
      next: (res) => {
        this.orders.set(res.data.orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  formatPrice(amount: number): string {
    return formatMedicinePrice(amount);
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      placed: 'Placed',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      out_for_delivery: 'Out for delivery',
      ready_for_pickup: 'Ready for pickup',
      delivered: 'Delivered',
      picked_up: 'Picked up',
      cancelled: 'Cancelled',
    };
    return labels[status] ?? status;
  }

  statusClasses(status: string): string {
    if (status === 'delivered' || status === 'picked_up') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'cancelled') return 'bg-gray-100 text-gray-600 border-gray-200';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }

  itemCount(order: MedicineOrder): number {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }

  itemPreview(order: MedicineOrder): string {
    const names = (order.items ?? [])
      .slice(0, 3)
      .map((item) => item.medicine?.name ?? 'Medicine')
      .join(', ');
    const extra = (order.items?.length ?? 0) - 3;
    return extra > 0 ? `${names} +${extra} more` : names;
  }
}
