import { DoctorAvailability, AvailabilitySlot, SlotsResponse } from '../../../core/models/doctor-availability.model';

export interface DoctorAvailabilityState {
  availability: DoctorAvailability | null;
  previewSlots: AvailabilitySlot[];
  previewDate: string;
  previewSlotDuration: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const DOCTOR_AVAILABILITY_FEATURE_KEY = 'doctorAvailability';

export const initialDoctorAvailabilityState: DoctorAvailabilityState = {
  availability: null,
  previewSlots: [],
  previewDate: '',
  previewSlotDuration: 30,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
