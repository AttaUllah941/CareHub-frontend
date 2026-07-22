import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicineOrder, PharmacySummary } from '../../../../core/models/medicine.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { formatMedicinePrice } from '../../../marketplace/utils/marketplace-display.util';
import { PharmacyOrdersApiService } from '../../services/pharmacy-orders-api.service';

@Component({
  selector: 'app-pharmacy-orders-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './pharmacy-orders-page.component.html',
  styleUrl: './pharmacy-orders-page.component.scss',
})
export class PharmacyOrdersPageComponent implements OnInit {
  private readonly ordersApi = inject(PharmacyOrdersApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly pharmacy = signal<PharmacySummary | null>(null);
  readonly orders = signal<MedicineOrder[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal<string>('all');

  readonly filters = [
    'all',
    'placed',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);
    const status = this.filter() === 'all' ? undefined : this.filter();

    this.ordersApi.listOrders({ page: 1, limit: 50, status }).subscribe({
      next: (res) => {
        this.pharmacy.set(res.data.pharmacy);
        this.orders.set(res.data.orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  setFilter(value: string): void {
    this.filter.set(value);
    this.loadOrders();
  }

  formatPrice(amount: number): string {
    return formatMedicinePrice(amount);
  }

  statusLabel(status: string): string {
    return status.replace(/_/g, ' ');
  }

  itemPreview(order: MedicineOrder): string {
    const names = (order.items ?? []).map((i) => i.medicine?.name ?? 'Medicine');
    if (names.length === 0) return 'No items';
    if (names.length === 1) return names[0];
    return `${names[0]} +${names.length - 1} more`;
  }
}
