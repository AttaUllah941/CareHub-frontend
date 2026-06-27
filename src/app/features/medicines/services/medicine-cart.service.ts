import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PharmacyMedicine, PublicPharmacyView } from '../../../core/models/medicine.model';
import { formatMedicinePrice } from '../../marketplace/utils/marketplace-display.util';
import {
  CartPharmacyInfo,
  DeliveryType,
  MedicineCartItem,
  SavedDeliveryAddress,
} from '../models/medicine-cart.model';

const CART_STORAGE_KEY = 'carehub_medicine_cart';
const ADDRESSES_STORAGE_KEY = 'carehub_saved_addresses';

const COUPONS: Record<string, { type: 'percent' | 'free_delivery'; value: number; label: string }> = {
  CARE10: { type: 'percent', value: 10, label: '10% off medicines' },
  FREESHIP: { type: 'free_delivery', value: 0, label: 'Free delivery' },
};

const DEFAULT_ADDRESSES: SavedDeliveryAddress[] = [
  {
    id: 'addr-home',
    label: 'Home',
    fullAddress: 'House 42, Block C, Johar Town',
    city: 'Lahore',
    phone: '03001234567',
    isDefault: true,
  },
  {
    id: 'addr-office',
    label: 'Office',
    fullAddress: 'Office 5, Gulberg III, Main Boulevard',
    city: 'Lahore',
    phone: '03007654321',
    isDefault: false,
  },
];

@Injectable({ providedIn: 'root' })
export class MedicineCartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly items = signal<MedicineCartItem[]>(this.loadCart());
  private readonly savedAddresses = signal<SavedDeliveryAddress[]>(this.loadAddresses());
  private readonly lastAddedLineId = signal<string | null>(null);

  readonly cartItems = this.items.asReadonly();
  readonly addresses = this.savedAddresses.asReadonly();
  readonly recentlyAddedLineId = this.lastAddedLineId.asReadonly();

  readonly itemCount = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));

  readonly subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.medicine.price * i.quantity, 0),
  );

  readonly requiresPrescription = computed(() =>
    this.items().some((i) => i.medicine.requiresPrescription),
  );

  readonly prescriptionMedicines = computed(() =>
    this.items().filter((i) => i.medicine.requiresPrescription),
  );

  readonly canHomeDelivery = computed(() => this.items().every((i) => i.pharmacy.isHomeDelivery));

  readonly baseDeliveryFee = computed(() => {
    const pharmacyIds = new Set<string>();
    let fee = 0;
    for (const item of this.items()) {
      if (!pharmacyIds.has(item.pharmacy.id) && item.pharmacy.isHomeDelivery) {
        pharmacyIds.add(item.pharmacy.id);
        fee += item.pharmacy.deliveryFee;
      }
    }
    return fee;
  });

  applyCoupon(code: string, deliveryType: DeliveryType): { discount: number; deliveryFee: number; message: string } {
    const normalized = code.trim().toUpperCase();
    const coupon = COUPONS[normalized];
    const subtotal = this.subtotal();
    let deliveryFee = deliveryType === 'home_delivery' ? this.baseDeliveryFee() : 0;

    if (!coupon) {
      return { discount: 0, deliveryFee, message: 'Invalid coupon code' };
    }

    if (coupon.type === 'percent') {
      return {
        discount: Math.round(subtotal * (coupon.value / 100)),
        deliveryFee,
        message: `${coupon.label} applied`,
      };
    }

    return { discount: 0, deliveryFee: 0, message: coupon.label };
  }

  validateCoupon(code: string): string | null {
    const normalized = code.trim().toUpperCase();
    return COUPONS[normalized]?.label ?? null;
  }

  formatPrice(amount: number): string {
    return formatMedicinePrice(amount);
  }

  pharmacyFromPublic(pharmacy: PublicPharmacyView): CartPharmacyInfo {
    return {
      id: pharmacy.id,
      slug: pharmacy.slug,
      name: pharmacy.name,
      city: pharmacy.city,
      citySlug: pharmacy.citySlug,
      phone: pharmacy.phone,
      address: pharmacy.address ?? '',
      isHomeDelivery: pharmacy.isHomeDelivery,
      deliveryFee: pharmacy.deliveryFee ?? 150,
      deliveryTime: pharmacy.deliveryTime ?? '45–90 minutes',
    };
  }

  addToCart(medicine: PharmacyMedicine, pharmacy: PublicPharmacyView): { added: boolean; message: string } {
    if (medicine.stockStatus === 'out_of_stock') {
      return { added: false, message: 'This medicine is currently out of stock.' };
    }

    const cartLineId = `${pharmacy.id}:${medicine.id}`;
    const existing = this.items().find((i) => i.cartLineId === cartLineId);
    const maxStock = medicine.stockQuantity ?? 99;

    if (existing) {
      if (existing.quantity >= maxStock) {
        return { added: false, message: `Only ${maxStock} units available.` };
      }
      this.updateQuantity(cartLineId, existing.quantity + 1);
      this.lastAddedLineId.set(cartLineId);
      return { added: true, message: `${medicine.name} quantity updated in cart.` };
    }

    const next: MedicineCartItem = {
      cartLineId,
      medicine,
      pharmacy: this.pharmacyFromPublic(pharmacy),
      quantity: 1,
    };

    this.items.update((items) => [...items, next]);
    this.persistCart();
    this.lastAddedLineId.set(cartLineId);
    return { added: true, message: `${medicine.name} added to cart.` };
  }

  updateQuantity(cartLineId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(cartLineId);
      return;
    }

    this.items.update((items) =>
      items.map((item) => {
        if (item.cartLineId !== cartLineId) return item;
        return { ...item, quantity: Math.min(quantity, item.medicine.stockQuantity ?? 99) };
      }),
    );
    this.persistCart();
  }

  removeItem(cartLineId: string): void {
    this.items.update((items) => items.filter((i) => i.cartLineId !== cartLineId));
    this.persistCart();
  }

  clearCart(): void {
    this.items.set([]);
    this.persistCart();
  }

  clearRecentlyAdded(): void {
    this.lastAddedLineId.set(null);
  }

  addAddress(address: Omit<SavedDeliveryAddress, 'id'>): SavedDeliveryAddress {
    const entry: SavedDeliveryAddress = { ...address, id: `addr-${Date.now().toString(36)}` };
    this.savedAddresses.update((list) => [...list, entry]);
    this.persistAddresses();
    return entry;
  }

  private loadCart(): MedicineCartItem[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MedicineCartItem[]) : [];
    } catch {
      return [];
    }
  }

  private loadAddresses(): SavedDeliveryAddress[] {
    if (!this.isBrowser) return DEFAULT_ADDRESSES;
    try {
      const raw = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedDeliveryAddress[]) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  }

  private persistCart(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items()));
  }

  private persistAddresses(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(this.savedAddresses()));
  }
}
