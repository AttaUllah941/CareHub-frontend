import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicineCartItem } from '../../models/medicine-cart.model';
import { MedicineCartService } from '../../services/medicine-cart.service';

@Component({
  selector: 'app-medicine-cart-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './medicine-cart-page.component.html',
  styleUrl: './medicine-cart-page.component.scss',
})
export class MedicineCartPageComponent {
  readonly cart = inject(MedicineCartService);

  readonly groupedItems = computed(() => {
    const groups = new Map<string, MedicineCartItem[]>();
    for (const item of this.cart.cartItems()) {
      const list = groups.get(item.pharmacy.id) ?? [];
      list.push(item);
      groups.set(item.pharmacy.id, list);
    }
    return [...groups.entries()].map(([pharmacyId, items]) => ({
      pharmacyId,
      pharmacy: items[0].pharmacy,
      items,
      subtotal: items.reduce((s, i) => s + i.medicine.price * i.quantity, 0),
    }));
  });

  lineTotal(price: number, qty: number): string {
    return this.cart.formatPrice(price * qty);
  }
}
