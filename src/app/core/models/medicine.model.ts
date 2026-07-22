import { PaginationMeta } from './doctor.model';

export type MedicineStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface PharmacySummary {
  id: string;
  name: string;
  slug: string;
  city: string;
  citySlug: string;
  address?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  rating?: number;
  timings?: string;
  isHomeDelivery?: boolean;
  deliveryFee?: number;
  deliveryTime?: string;
}

export interface Medicine {
  id: string;
  pharmacyId: string;
  name: string;
  description?: string;
  manufacturer?: string;
  price: number;
  currency: string;
  requiresPrescription: boolean;
  stock: number;
  pharmacy?: PharmacySummary;
}

export interface PharmacyMedicine {
  id: string;
  name: string;
  manufacturer: string;
  description?: string;
  category?: string;
  dosage?: string;
  price: number;
  requiresPrescription: boolean;
  stockStatus: MedicineStockStatus;
  stockQuantity?: number;
}

export interface PublicPharmacyView extends PharmacySummary {
  phone: string;
  email?: string;
  website?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  medicineCount?: number;
  timings?: string;
  isHomeDelivery: boolean;
  deliveryFee: number;
  deliveryTime: string;
  medicines: PharmacyMedicine[];
}

export interface MedicineListQuery {
  page?: number;
  limit?: number;
  search?: string;
  pharmacyId?: string;
  requiresPrescription?: 'true' | 'false';
}

export interface MedicineOrderItemRequest {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateMedicineOrderRequest {
  items: MedicineOrderItemRequest[];
  deliveryType: 'home_delivery' | 'store_pickup';
  address: string;
  paymentMethod: 'cod' | 'card' | 'jazzcash' | 'easypaisa';
  patientName?: string;
  patientPhone?: string;
  notes?: string;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  couponCode?: string;
  prescriptionUrls?: string[];
}

export interface MedicineOrderItem {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
  unitPrice: number;
  medicine?: {
    id: string;
    name: string;
    manufacturer?: string;
    requiresPrescription: boolean;
  };
  pharmacy?: {
    id: string;
    name: string;
    slug?: string;
    city?: string;
  };
}

export interface MedicineOrder {
  id: string;
  orderRef: string;
  status: string;
  totalAmount: number;
  currency: string;
  deliveryType: string;
  address: string;
  paymentMethod: string;
  patientName?: string;
  patientPhone?: string;
  notes?: string;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  couponCode?: string;
  prescriptionUrls?: string[];
  items?: MedicineOrderItem[];
  createdAt?: string;
  updatedAt?: string;
}
