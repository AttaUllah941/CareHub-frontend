import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderStatus } from '../../models/medicine-cart.model';
import { MedicineCartService } from '../../services/medicine-cart.service';

@Component({
  selector: 'app-medicine-order-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './medicine-order-detail-page.component.html',
  styleUrl: './medicine-order-detail-page.component.scss',
})
export class MedicineOrderDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  readonly cart = inject(MedicineCartService);

  readonly orderId = signal('');
  readonly order = computed(() => this.cart.orderHistory().find((o) => o.id === this.orderId()));

  private trackingTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.orderId.set(params.get('orderId') ?? '');
    });
  }

  ngOnInit(): void {
    this.trackingTimer = setInterval(() => {
      const order = this.cart.getOrder(this.orderId());
      if (!order) return;
      const terminal: OrderStatus[] = ['delivered', 'picked_up', 'cancelled'];
      if (!terminal.includes(order.status)) {
        this.cart.advanceOrderStatus(order.id);
      }
    }, 12000);
  }

  ngOnDestroy(): void {
    if (this.trackingTimer) clearInterval(this.trackingTimer);
  }

  statusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      placed: 'Order placed',
      confirmed: 'Order confirmed',
      preparing: 'Preparing your order',
      out_for_delivery: 'Out for delivery',
      ready_for_pickup: 'Ready for pickup',
      delivered: 'Delivered',
      picked_up: 'Picked up',
      cancelled: 'Cancelled',
    };
    return labels[status];
  }

  isStepComplete(step: OrderStatus, current: OrderStatus): boolean {
    const homeFlow: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const pickupFlow: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up'];
    const o = this.order();
    const flow = o?.checkout.deliveryType === 'home_delivery' ? homeFlow : pickupFlow;
    return flow.indexOf(step) <= flow.indexOf(current);
  }

  reorder(): void {
    const id = this.orderId();
    if (id) this.cart.reorder(id);
  }

  pharmacyPhone(): string {
    return this.order()?.items[0]?.pharmacy.phone ?? '';
  }
}
