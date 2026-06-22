import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  formatMedicinePrice,
  getStockClasses,
  getStockLabel,
  PharmacyMedicine,
} from '../../data/dummy-medicines.data';

@Component({
  selector: 'app-public-medicine-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-medicine-card.component.html',
  styleUrl: './public-medicine-card.component.scss',
})
export class PublicMedicineCardComponent {
  readonly medicine = input.required<PharmacyMedicine>();

  formatPrice(price: number): string {
    return formatMedicinePrice(price);
  }

  stockLabel(status: PharmacyMedicine['stockStatus']): string {
    return getStockLabel(status);
  }

  stockClasses(status: PharmacyMedicine['stockStatus']): string {
    return getStockClasses(status);
  }
}
