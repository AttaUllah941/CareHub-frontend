import { PaginationMeta } from './appointment.model';

export type MedicineForm =
  | 'TABLET'
  | 'CAPSULE'
  | 'SYRUP'
  | 'INJECTION'
  | 'CREAM'
  | 'DROPS'
  | 'INHALER'
  | 'OTHER';

export type PharmacyOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PrescriptionUploadStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type DeliveryType = 'PICKUP' | 'DELIVERY';

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  strength?: string;
  form: MedicineForm;
  unit?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  requiresPrescription: boolean;
  description?: string;
  manufacturer?: string;
  sellingPrice: number;
  currency: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PharmacyInventory {
  id: string;
  medicineId: string;
  quantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  batchNumber?: string;
  expiryDate?: string | null;
  unitCost?: number;
  sellingPrice?: number;
  availableQuantity?: number;
  isLowStock?: boolean;
  medicine?: Medicine;
  isActive: boolean;
}

export interface PharmacyOrderItem {
  id?: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  dosage?: string;
  instructions?: string;
}

export interface PharmacyOrder {
  id: string;
  orderNumber: string;
  patientProfileId: string;
  prescriptionId?: string | null;
  prescriptionUploadId?: string | null;
  status: PharmacyOrderStatus;
  items: PharmacyOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  notes?: string;
  patient?: { id: string; user?: { firstName: string; lastName: string; email?: string } };
  createdAt?: string;
  updatedAt?: string;
}

export interface PrescriptionUpload {
  id: string;
  patientProfileId: string;
  prescriptionId?: string | null;
  title: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: PrescriptionUploadStatus;
  reviewNotes?: string;
  reviewedAt?: string | null;
  patient?: { id: string; user?: { firstName: string; lastName: string } };
  createdAt?: string;
}

export interface MedicineListQuery {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  requiresPrescription?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateMedicineRequest {
  name: string;
  genericName?: string;
  brandName?: string;
  strength?: string;
  form?: MedicineForm;
  unit?: string;
  sku?: string;
  category?: string;
  requiresPrescription?: boolean;
  description?: string;
  manufacturer?: string;
  sellingPrice?: number;
  currency?: string;
}

export interface UpsertInventoryRequest {
  medicineId: string;
  quantity?: number;
  reorderLevel?: number;
  batchNumber?: string;
  expiryDate?: string;
  unitCost?: number;
  sellingPrice?: number;
}

export interface CreatePharmacyOrderRequest {
  items: { medicineId: string; quantity: number; unitPrice?: number; dosage?: string; instructions?: string }[];
  prescriptionId?: string;
  prescriptionUploadId?: string;
  deliveryType?: DeliveryType;
  deliveryAddress?: string;
  notes?: string;
}

export const DEFAULT_MEDICINE_LIST_QUERY: MedicineListQuery = {
  page: 1,
  limit: 10,
  sortBy: 'name',
  sortOrder: 'asc',
};

export const PHARMACY_ORDER_STATUS_OPTIONS: { value: PharmacyOrderStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY', label: 'Ready' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function pharmacyOrderStatusLabel(status: PharmacyOrderStatus): string {
  return PHARMACY_ORDER_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function pharmacyOrderStatusClass(status: PharmacyOrderStatus): string {
  const map: Record<PharmacyOrderStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-indigo-100 text-indigo-800',
    READY: 'bg-teal-100 text-teal-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-800';
}

export function prescriptionUploadStatusClass(status: PrescriptionUploadStatus): string {
  const map: Record<PrescriptionUploadStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return map[status];
}
