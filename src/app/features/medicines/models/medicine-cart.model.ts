import { PharmacyMedicine } from '../../../core/models/medicine.model';

export interface CartPharmacyInfo {
  id: string;
  slug: string;
  name: string;
  city: string;
  citySlug: string;
  phone: string;
  address: string;
  isHomeDelivery: boolean;
  deliveryFee: number;
  deliveryTime: string;
}

export interface MedicineCartItem {
  cartLineId: string;
  medicine: PharmacyMedicine;
  pharmacy: CartPharmacyInfo;
  quantity: number;
}

export interface SavedDeliveryAddress {
  id: string;
  label: string;
  fullAddress: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

export type DeliveryType = 'home_delivery' | 'store_pickup';
export type PaymentMethod = 'cod' | 'card' | 'jazzcash' | 'easypaisa';

export interface PrescriptionUpload {
  medicineId: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

export interface CheckoutFormData {
  deliveryType: DeliveryType;
  addressId: string;
  customAddress: string;
  customPhone: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  paymentMethod: PaymentMethod;
  couponCode: string;
  patientName: string;
  patientPhone: string;
  notes: string;
  prescriptions: PrescriptionUpload[];
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'ready_for_pickup'
  | 'delivered'
  | 'picked_up'
  | 'cancelled';

export interface OrderStatusEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface MedicineOrder {
  id: string;
  orderRef: string;
  items: MedicineCartItem[];
  checkout: CheckoutFormData;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}
