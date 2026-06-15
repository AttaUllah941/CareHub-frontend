import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  DoctorAvailability,
  SlotsResponse,
  UpdateAvailabilityRequest,
} from '../../../core/models/doctor-availability.model';

export const DoctorAvailabilityActions = createActionGroup({
  source: 'DoctorAvailability',
  events: {
    'Load Availability': emptyProps(),
    'Load Availability Success': props<{ availability: DoctorAvailability }>(),
    'Load Availability Failure': props<{ error: string }>(),

    'Update Availability': props<{ payload: UpdateAvailabilityRequest }>(),
    'Update Availability Success': props<{ availability: DoctorAvailability; message: string }>(),
    'Update Availability Failure': props<{ error: string }>(),

    'Load Slots Preview': props<{ date: string }>(),
    'Load Slots Preview Success': props<SlotsResponse>(),
    'Load Slots Preview Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
