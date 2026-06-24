import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { formatMedicinePrice, PharmacyMedicine, PublicPharmacy } from '../data/dummy-medicines.data';
import {
  CartPharmacyInfo,
  CheckoutFormData,
  DeliveryType,
  MedicineCartItem,
  MedicineOrder,
  OrderStatus,
  OrderStatusEvent,
  SavedDeliveryAddress,
} from '../models/medicine-cart.model';

const CART_STORAGE_KEY = 'carehub_medicine_cart';
const ORDERS_STORAGE_KEY = 'carehub_medicine_orders';
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
  private readonly orders = signal<MedicineOrder[]>(this.loadOrders());
  private readonly savedAddresses = signal<SavedDeliveryAddress[]>(this.loadAddresses());
  private readonly lastAddedLineId = signal<string | null>(null);

  readonly cartItems = this.items.asReadonly();
  readonly orderHistory = this.orders.asReadonly();
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

  pharmacyFromPublic(pharmacy: PublicPharmacy): CartPharmacyInfo {
    return {
      id: pharmacy.id,
      slug: pharmacy.slug,
      name: pharmacy.name,
      city: pharmacy.city,
      citySlug: pharmacy.citySlug,
      phone: pharmacy.phone,
      address: pharmacy.address,
      isHomeDelivery: pharmacy.isHomeDelivery,
      deliveryFee: pharmacy.deliveryFee ?? 150,
      deliveryTime: pharmacy.deliveryTime ?? '45–90 minutes',
    };
  }

  addToCart(medicine: PharmacyMedicine, pharmacy: PublicPharmacy): { added: boolean; message: string } {
    if (medicine.stockStatus === 'out_of_stock') {
      return { added: false, message: 'This medicine is currently out of stock.' };
    }

    const cartLineId = `${pharmacy.id}:${medicine.id}`;
    const existing = this.items().find((i) => i.cartLineId === cartLineId);

    if (existing) {
      if (existing.quantity >= medicine.stockQuantity) {
        return { added: false, message: `Only ${medicine.stockQuantity} units available.` };
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
        return { ...item, quantity: Math.min(quantity, item.medicine.stockQuantity) };
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

  placeOrder(checkout: CheckoutFormData): MedicineOrder {
    const coupon = this.applyCoupon(checkout.couponCode, checkout.deliveryType);
    const subtotal = this.subtotal();
    const deliveryFee = coupon.deliveryFee;
    const discount = coupon.discount;
    const total = Math.max(0, subtotal + deliveryFee - discount);
    const now = new Date().toISOString();
    const orderRef = `MD-${Date.now().toString(36).toUpperCase()}`;
    const estimatedDelivery = this.buildEstimatedDelivery(checkout);

    const initialStatus: OrderStatus =
      checkout.deliveryType === 'home_delivery' ? 'confirmed' : 'preparing';

    const history: OrderStatusEvent[] = [
      { status: 'placed', label: 'Order placed', timestamp: now, note: 'Your order has been received.' },
      {
        status: initialStatus,
        label: initialStatus === 'confirmed' ? 'Order confirmed' : 'Preparing your order',
        timestamp: now,
        note:
          checkout.deliveryType === 'home_delivery'
            ? 'Pharmacy confirmed your order.'
            : 'Pharmacy is preparing for pickup.',
      },
    ];

    const order: MedicineOrder = {
      id: `order-${Date.now().toString(36)}`,
      orderRef,
      items: structuredClone(this.items()),
      checkout: structuredClone(checkout),
      subtotal,
      deliveryFee,
      discount,
      total,
      status: initialStatus,
      statusHistory: history,
      estimatedDelivery,
      createdAt: now,
      updatedAt: now,
    };

    this.orders.update((list) => [order, ...list]);
    this.persistOrders();
    this.clearCart();

    if (this.isBrowser) {
      console.group('✅ Medicine Order — Placed (frontend payload)');
      console.log('Full order object:', order);
      console.log('JSON (ready for API):', JSON.stringify(order, null, 2));
      console.groupEnd();
    }

    return order;
  }

  getOrder(orderId: string): MedicineOrder | undefined {
    return this.orders().find((o) => o.id === orderId);
  }

  reorder(orderId: string): { success: boolean; message: string } {
    const order = this.getOrder(orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    for (const item of order.items) {
      const stubPharmacy = {
        id: item.pharmacy.id,
        slug: item.pharmacy.slug,
        name: item.pharmacy.name,
        city: item.pharmacy.city,
        citySlug: item.pharmacy.citySlug,
        phone: item.pharmacy.phone,
        address: item.pharmacy.address,
        isHomeDelivery: item.pharmacy.isHomeDelivery,
        deliveryFee: item.pharmacy.deliveryFee,
        deliveryTime: item.pharmacy.deliveryTime,
      } as PublicPharmacy;

      const result = this.addToCart(item.medicine, stubPharmacy);
      if (result.added) {
        this.updateQuantity(`${item.pharmacy.id}:${item.medicine.id}`, item.quantity);
      }
    }

    return { success: true, message: 'Items added to cart. Review before checkout.' };
  }

  advanceOrderStatus(orderId: string): MedicineOrder | undefined {
    const order = this.getOrder(orderId);
    if (!order) return undefined;

    const flow: OrderStatus[] =
      order.checkout.deliveryType === 'home_delivery'
        ? ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']
        : ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up'];

    const currentIndex = flow.indexOf(order.status);
    if (currentIndex < 0 || currentIndex >= flow.length - 1) return order;

    const nextStatus = flow[currentIndex + 1];
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

    const now = new Date().toISOString();
    const updated: MedicineOrder = {
      ...order,
      status: nextStatus,
      statusHistory: [
        ...order.statusHistory,
        { status: nextStatus, label: labels[nextStatus], timestamp: now },
      ],
      updatedAt: now,
    };

    this.orders.update((list) => list.map((o) => (o.id === orderId ? updated : o)));
    this.persistOrders();
    return updated;
  }

  private buildEstimatedDelivery(checkout: CheckoutFormData): string {
    if (checkout.scheduledDate && checkout.scheduledTimeSlot) {
      const date = new Date(checkout.scheduledDate);
      return `${date.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' })} · ${checkout.scheduledTimeSlot}`;
    }

    const times = [...new Set(this.items().map((i) => i.pharmacy.deliveryTime))];
    return checkout.deliveryType === 'home_delivery'
      ? (times[0] ?? '45–90 minutes')
      : 'Ready in 30–60 minutes';
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

  private loadOrders(): MedicineOrder[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MedicineOrder[]) : [];
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

  private persistOrders(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders()));
  }

  private persistAddresses(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(this.savedAddresses()));
  }
}
