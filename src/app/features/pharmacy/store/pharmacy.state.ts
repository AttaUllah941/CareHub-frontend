import { Medicine, MedicineListQuery, PharmacyInventory, PharmacyOrder, PrescriptionUpload } from '../../../core/models/pharmacy.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import { DEFAULT_MEDICINE_LIST_QUERY } from './pharmacy.actions';

export const PHARMACY_FEATURE_KEY = 'pharmacy';

export interface PharmacyState {
  medicines: Medicine[];
  medicinesPagination: PaginationMeta | null;
  medicinesQuery: MedicineListQuery;
  inventory: PharmacyInventory[];
  inventoryPagination: PaginationMeta | null;
  orders: PharmacyOrder[];
  ordersPagination: PaginationMeta | null;
  myOrders: PharmacyOrder[];
  uploads: PrescriptionUpload[];
  uploadsPagination: PaginationMeta | null;
  myUploads: PrescriptionUpload[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const initialState: PharmacyState = {
  medicines: [],
  medicinesPagination: null,
  medicinesQuery: DEFAULT_MEDICINE_LIST_QUERY,
  inventory: [],
  inventoryPagination: null,
  orders: [],
  ordersPagination: null,
  myOrders: [],
  uploads: [],
  uploadsPagination: null,
  myUploads: [],
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
