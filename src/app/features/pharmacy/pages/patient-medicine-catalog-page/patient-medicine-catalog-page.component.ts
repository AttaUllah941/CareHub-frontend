import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-patient-medicine-catalog-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './patient-medicine-catalog-page.component.html',
})
export class PatientMedicineCatalogPageComponent implements OnInit {
  protected readonly pharmacyService = inject(PharmacyService);
  readonly search = signal('');
  readonly cart = signal<{ medicineId: string; name: string; quantity: number }[]>([]);

  ngOnInit(): void {
    this.pharmacyService.loadMedicines({ limit: 50 });
  }

  onSearch(): void {
    this.pharmacyService.loadMedicines({ search: this.search(), page: 1, limit: 50 });
  }

  addToCart(medicineId: string, name: string): void {
    const existing = this.cart().find((c) => c.medicineId === medicineId);
    if (existing) {
      this.cart.update((items) =>
        items.map((i) => (i.medicineId === medicineId ? { ...i, quantity: i.quantity + 1 } : i)),
      );
    } else {
      this.cart.update((items) => [...items, { medicineId, name, quantity: 1 }]);
    }
  }

  placeOrder(): void {
    const items = this.cart().map((c) => ({ medicineId: c.medicineId, quantity: c.quantity }));
    if (!items.length) return;
    this.pharmacyService.createOrder({ items, deliveryType: 'PICKUP' });
    this.cart.set([]);
  }
}
