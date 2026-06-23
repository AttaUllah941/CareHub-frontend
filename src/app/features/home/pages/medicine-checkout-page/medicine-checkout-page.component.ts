import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CheckoutFormData,
  DeliveryType,
  PaymentMethod,
  PrescriptionUpload,
} from '../../models/medicine-cart.model';
import { MedicineCartService } from '../../services/medicine-cart.service';

const DELIVERY_SLOTS = ['10:00 AM – 12:00 PM', '12:00 PM – 02:00 PM', '02:00 PM – 05:00 PM', '05:00 PM – 08:00 PM'];

@Component({
  selector: 'app-medicine-checkout-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './medicine-checkout-page.component.html',
  styleUrl: './medicine-checkout-page.component.scss',
})
export class MedicineCheckoutPageComponent {
  private readonly router = inject(Router);
  readonly cart = inject(MedicineCartService);

  readonly deliverySlots = DELIVERY_SLOTS;
  readonly deliveryType = signal<DeliveryType>('home_delivery');
  readonly addressId = signal('addr-home');
  readonly useCustomAddress = signal(false);
  readonly customAddress = signal('');
  readonly customPhone = signal('');
  readonly scheduledDate = signal('');
  readonly scheduledTimeSlot = signal('');
  readonly paymentMethod = signal<PaymentMethod>('cod');
  readonly couponCode = signal('');
  readonly couponMessage = signal('');
  readonly patientName = signal('');
  readonly patientPhone = signal('');
  readonly notes = signal('');
  readonly prescriptions = signal<PrescriptionUpload[]>([]);
  readonly showValidation = signal(false);

  readonly pricing = computed(() => this.cart.applyCoupon(this.couponCode(), this.deliveryType()));

  readonly total = computed(() => {
    const p = this.pricing();
    return Math.max(0, this.cart.subtotal() + p.deliveryFee - p.discount);
  });

  readonly estimatedDelivery = computed(() => {
    if (this.scheduledDate() && this.scheduledTimeSlot()) {
      const date = new Date(this.scheduledDate());
      return `${date.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' })} · ${this.scheduledTimeSlot()}`;
    }
    return this.deliveryType() === 'home_delivery' ? '45–90 minutes after confirmation' : 'Ready in 30–60 minutes';
  });

  constructor() {
    const defaultAddr = this.cart.addresses().find((a) => a.isDefault) ?? this.cart.addresses()[0];
    if (defaultAddr) this.addressId.set(defaultAddr.id);
  }

  selectDelivery(type: DeliveryType): void {
    if (type === 'home_delivery' && !this.cart.canHomeDelivery()) return;
    this.deliveryType.set(type);
    this.applyCouponPreview();
  }

  applyCouponPreview(): void {
    const result = this.cart.applyCoupon(this.couponCode(), this.deliveryType());
    this.couponMessage.set(result.message);
  }

  onPrescriptionSelected(medicineId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const upload: PrescriptionUpload = {
      medicineId,
      fileName: file.name,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    };

    this.prescriptions.update((list) => [...list.filter((p) => p.medicineId !== medicineId), upload]);
  }

  hasPrescription(medicineId: string): boolean {
    return this.prescriptions().some((p) => p.medicineId === medicineId);
  }

  canSubmit(): boolean {
    const nameOk = this.patientName().trim().length >= 2;
    const phoneOk = /^[0-9]{10,11}$/.test(this.patientPhone().replace(/\D/g, ''));
    const addressOk =
      this.deliveryType() === 'store_pickup' ||
      this.useCustomAddress()
        ? this.customAddress().trim().length >= 10
        : Boolean(this.addressId());
    const rxOk =
      !this.cart.requiresPrescription() ||
      this.cart.prescriptionMedicines().every((i) => this.hasPrescription(i.medicine.id));
    return nameOk && phoneOk && addressOk && rxOk && this.cart.cartItems().length > 0;
  }

  placeOrder(): void {
    this.showValidation.set(true);
    this.applyCouponPreview();
    if (!this.canSubmit()) return;

    const checkout: CheckoutFormData = {
      deliveryType: this.deliveryType(),
      addressId: this.useCustomAddress() ? '' : this.addressId(),
      customAddress: this.useCustomAddress() ? this.customAddress().trim() : '',
      customPhone: this.useCustomAddress() ? this.customPhone().trim() : '',
      scheduledDate: this.scheduledDate(),
      scheduledTimeSlot: this.scheduledTimeSlot(),
      paymentMethod: this.paymentMethod(),
      couponCode: this.couponCode().trim().toUpperCase(),
      patientName: this.patientName().trim(),
      patientPhone: this.patientPhone().trim(),
      notes: this.notes().trim(),
      prescriptions: this.prescriptions(),
    };

    const order = this.cart.placeOrder(checkout);
    this.router.navigate(['/medicines/orders', order.id]);
  }
}
