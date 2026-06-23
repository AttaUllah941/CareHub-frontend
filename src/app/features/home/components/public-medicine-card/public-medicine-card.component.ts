import { Component, inject, input, signal } from '@angular/core';
import {
  formatMedicinePrice,
  getStockClasses,
  getStockLabel,
  PharmacyMedicine,
  PublicPharmacy,
} from '../../data/dummy-medicines.data';
import { MedicineCartService } from '../../services/medicine-cart.service';

@Component({
  selector: 'app-public-medicine-card',
  standalone: true,
  imports: [],
  templateUrl: './public-medicine-card.component.html',
  styleUrl: './public-medicine-card.component.scss',
})
export class PublicMedicineCardComponent {
  private readonly cart = inject(MedicineCartService);

  readonly medicine = input.required<PharmacyMedicine>();
  readonly pharmacy = input.required<PublicPharmacy>();

  readonly toastMessage = signal('');

  formatPrice(price: number): string {
    return formatMedicinePrice(price);
  }

  stockLabel(status: PharmacyMedicine['stockStatus']): string {
    return getStockLabel(status);
  }

  stockClasses(status: PharmacyMedicine['stockStatus']): string {
    return getStockClasses(status);
  }

  addToCart(): void {
    const result = this.cart.addToCart(this.medicine(), this.pharmacy());
    this.toastMessage.set(result.message);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
