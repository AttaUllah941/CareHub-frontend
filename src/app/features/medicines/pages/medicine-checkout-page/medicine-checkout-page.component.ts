import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UploadsApiService } from '../../../../core/services/uploads-api.service';
import {
  DeliveryType,
  PaymentMethod,
  PrescriptionUpload,
} from '../../models/medicine-cart.model';
import { MedicinesApiService } from '../../services/medicines-api.service';
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
  private readonly medicinesApi = inject(MedicinesApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly uploadsApi = inject(UploadsApiService);
  private readonly notifications = inject(NotificationService);
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
  private readonly prescriptionFiles = new Map<string, File>();
  readonly showValidation = signal(false);
  readonly submitting = signal(false);

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

    this.prescriptionFiles.set(medicineId, file);
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
    if (!this.canSubmit() || this.submitting()) return;

    const address = this.resolveDeliveryAddress();
    if (!address) {
      this.notifications.showError('Please provide a valid delivery address.');
      return;
    }

    this.submitting.set(true);

    const rxItems = this.cart.prescriptionMedicines();
    const uploadRequests =
      rxItems.length === 0
        ? of([] as string[])
        : forkJoin(
            rxItems.map((item) => {
              const file = this.prescriptionFiles.get(item.medicine.id);
              if (!file) {
                throw new Error(`Missing prescription file for ${item.medicine.name}`);
              }
              return this.uploadsApi.uploadFile(file);
            }),
          ).pipe(switchMap((results) => of(results.map((r) => r.url))));

    uploadRequests
      .pipe(
        switchMap((prescriptionUrls) =>
          this.medicinesApi.createOrder({
            items: this.cart.cartItems().map((item) => ({
              medicineId: item.medicine.id,
              pharmacyId: item.pharmacy.id,
              quantity: item.quantity,
              unitPrice: item.medicine.price,
            })),
            deliveryType: this.deliveryType(),
            address,
            paymentMethod: this.paymentMethod(),
            couponCode: this.couponCode().trim().toUpperCase() || undefined,
            prescriptionUrls: prescriptionUrls.length ? prescriptionUrls : undefined,
          }),
        ),
      )
      .subscribe({
        next: (res) => {
          const order = res.data.order;
          this.cart.clearCart();
          this.prescriptionFiles.clear();
          this.notifications.showSuccess(`Order placed. Reference: ${order.orderRef}`);
          this.submitting.set(false);
          this.router.navigate(['/medicines/orders', order.id]);
        },
        error: (err) => {
          const message =
            err instanceof Error ? err.message : this.apiErrorService.getMessage(err);
          this.notifications.showError(message);
          this.submitting.set(false);
        },
      });
  }

  private resolveDeliveryAddress(): string {
    if (this.deliveryType() === 'store_pickup') {
      const pharmacy = this.cart.cartItems()[0]?.pharmacy;
      return pharmacy ? `Store pickup — ${pharmacy.name}, ${pharmacy.address}, ${pharmacy.city}` : 'Store pickup';
    }

    if (this.useCustomAddress()) {
      const addr = this.customAddress().trim();
      const phone = this.customPhone().trim();
      return phone ? `${addr} (Phone: ${phone})` : addr;
    }

    const saved = this.cart.addresses().find((a) => a.id === this.addressId());
    return saved ? `${saved.fullAddress}, ${saved.city} (Phone: ${saved.phone})` : '';
  }
}
