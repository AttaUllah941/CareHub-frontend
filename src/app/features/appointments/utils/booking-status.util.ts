import { LabBookingStatus } from '../../../core/models/lab.model';
import { SurgeryConsultationStatus } from '../../../core/models/surgery.model';

export const labBookingStatusLabel = (status: LabBookingStatus | string): string => {
  const map: Record<LabBookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    sample_collected: 'Sample collected',
    report_ready: 'Completed',
    cancelled: 'Cancelled',
  };
  return map[status as LabBookingStatus] ?? status;
};

export const labBookingStatusBadge = (status: LabBookingStatus): string => {
  const map: Record<LabBookingStatus, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-sky-100 text-sky-800',
    sample_collected: 'bg-violet-100 text-violet-800',
    report_ready: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };
  return map[status];
};

export const surgeryConsultationStatusLabel = (status: SurgeryConsultationStatus | string): string => {
  const map: Record<SurgeryConsultationStatus, string> = {
    pending: 'Pending',
    contacted: 'Confirmed',
    scheduled: 'Scheduled',
    closed: 'Completed',
  };
  return map[status as SurgeryConsultationStatus] ?? status;
};

export const surgeryConsultationStatusBadge = (status: SurgeryConsultationStatus): string => {
  const map: Record<SurgeryConsultationStatus, string> = {
    pending: 'bg-amber-100 text-amber-800',
    contacted: 'bg-sky-100 text-sky-800',
    scheduled: 'bg-emerald-100 text-emerald-800',
    closed: 'bg-gray-100 text-gray-600',
  };
  return map[status];
};
