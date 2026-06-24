import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderStatus } from '../../models/medicine-cart.model';
import { MedicineCartService } from '../../services/medicine-cart.service';

@Component({
  selector: 'app-medicine-orders-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './medicine-orders-page.component.html',
  styleUrl: './medicine-orders-page.component.scss',
})
export class MedicineOrdersPageComponent {
  readonly cart = inject(MedicineCartService);

  statusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      placed: 'Placed',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      out_for_delivery: 'Out for delivery',
      ready_for_pickup: 'Ready for pickup',
      delivered: 'Delivered',
      picked_up: 'Picked up',
      cancelled: 'Cancelled',
    };
    return labels[status];
  }

  statusClasses(status: OrderStatus): string {
    if (status === 'delivered' || status === 'picked_up') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'cancelled') return 'bg-gray-100 text-gray-600 border-gray-200';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }

  reorder(orderId: string): void {
    this.cart.reorder(orderId);
  }
}
