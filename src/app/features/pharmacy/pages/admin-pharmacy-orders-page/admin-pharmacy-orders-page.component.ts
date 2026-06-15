import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { pharmacyOrderStatusClass, pharmacyOrderStatusLabel, PHARMACY_ORDER_STATUS_OPTIONS } from '../../../../core/models/pharmacy.model';

@Component({
  selector: 'app-admin-pharmacy-orders-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './admin-pharmacy-orders-page.component.html',
})
export class AdminPharmacyOrdersPageComponent implements OnInit {
  protected readonly pharmacyService = inject(PharmacyService);
  readonly statusFilter = signal('');
  readonly statusOptions = PHARMACY_ORDER_STATUS_OPTIONS;
  readonly statusLabel = pharmacyOrderStatusLabel;
  readonly statusClass = pharmacyOrderStatusClass;

  ngOnInit(): void {
    this.pharmacyService.loadOrders();
  }

  onFilter(status: string): void {
    this.statusFilter.set(status);
    this.pharmacyService.loadOrders(status ? { status } : {});
  }

  advanceStatus(orderId: string, current: string): void {
    const next: Record<string, string> = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'PREPARING',
      PREPARING: 'READY',
      READY: 'DELIVERED',
    };
    const status = next[current];
    if (status) this.pharmacyService.updateOrderStatus(orderId, status);
  }
}
