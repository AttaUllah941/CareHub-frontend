import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateMedicineRequest,
  CreatePharmacyOrderRequest,
  DEFAULT_MEDICINE_LIST_QUERY,
  Medicine,
  MedicineListQuery,
  PharmacyInventory,
  PharmacyOrder,
  PrescriptionUpload,
  UpsertInventoryRequest,
} from '../../../core/models/pharmacy.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const PharmacyActions = createActionGroup({
  source: 'Pharmacy',
  events: {
    'Load Medicines': props<{ query?: Partial<MedicineListQuery> }>(),
    'Load Medicines Success': props<{ medicines: Medicine[]; pagination: PaginationMeta; query: MedicineListQuery }>(),
    'Load Medicines Failure': props<{ error: string }>(),

    'Create Medicine': props<{ payload: CreateMedicineRequest }>(),
    'Create Medicine Success': props<{ medicine: Medicine; message: string }>(),
    'Create Medicine Failure': props<{ error: string }>(),

    'Load Inventory': props<{ query?: Record<string, string | number | boolean> }>(),
    'Load Inventory Success': props<{ inventory: PharmacyInventory[]; pagination: PaginationMeta }>(),
    'Load Inventory Failure': props<{ error: string }>(),

    'Upsert Inventory': props<{ payload: UpsertInventoryRequest }>(),
    'Upsert Inventory Success': props<{ inventory: PharmacyInventory; message: string }>(),
    'Upsert Inventory Failure': props<{ error: string }>(),

    'Load Orders': props<{ query?: Record<string, string | number> }>(),
    'Load Orders Success': props<{ orders: PharmacyOrder[]; pagination: PaginationMeta }>(),
    'Load Orders Failure': props<{ error: string }>(),

    'Load My Orders': emptyProps(),
    'Load My Orders Success': props<{ orders: PharmacyOrder[] }>(),
    'Load My Orders Failure': props<{ error: string }>(),

    'Create Order': props<{ payload: CreatePharmacyOrderRequest }>(),
    'Create Order Success': props<{ order: PharmacyOrder; message: string }>(),
    'Create Order Failure': props<{ error: string }>(),

    'Create Order From Prescription': props<{ prescriptionId: string; payload?: Partial<CreatePharmacyOrderRequest> }>(),
    'Create Order From Prescription Success': props<{ order: PharmacyOrder; message: string }>(),
    'Create Order From Prescription Failure': props<{ error: string }>(),

    'Update Order Status': props<{ id: string; status: string; notes?: string }>(),
    'Update Order Status Success': props<{ order: PharmacyOrder; message: string }>(),
    'Update Order Status Failure': props<{ error: string }>(),

    'Load My Uploads': emptyProps(),
    'Load My Uploads Success': props<{ uploads: PrescriptionUpload[] }>(),
    'Load My Uploads Failure': props<{ error: string }>(),

    'Load Uploads': props<{ query?: Record<string, string | number> }>(),
    'Load Uploads Success': props<{ uploads: PrescriptionUpload[]; pagination: PaginationMeta }>(),
    'Load Uploads Failure': props<{ error: string }>(),

    'Upload Prescription': props<{ file: File; title?: string }>(),
    'Upload Prescription Success': props<{ upload: PrescriptionUpload; message: string }>(),
    'Upload Prescription Failure': props<{ error: string }>(),

    'Review Upload': props<{ id: string; status: 'APPROVED' | 'REJECTED'; reviewNotes?: string }>(),
    'Review Upload Success': props<{ upload: PrescriptionUpload; message: string }>(),
    'Review Upload Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});

export { DEFAULT_MEDICINE_LIST_QUERY };
