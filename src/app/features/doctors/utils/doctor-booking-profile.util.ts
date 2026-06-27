import { DoctorConsultationOption, DoctorDetailProfile } from '../../../core/models/doctor-profile.model';
import { DoctorSearchResult } from '../../../core/models/doctor.model';

const DEFAULT_TIME_SLOTS = ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

/** Builds a bookable profile from listing data when the detail API is unavailable. */
export const buildBookingProfileFromListing = (
  doctor: DoctorSearchResult,
  city = 'Lahore',
): DoctorDetailProfile => {
  const fee = doctor.consultationFee ?? 1500;
  const currency = doctor.currency ?? 'PKR';
  const consultationOptions: DoctorConsultationOption[] = [
    {
      id: `${doctor.id}-video`,
      type: 'video',
      name: 'Video Consultation',
      fee,
      currency,
      hours: '04:30 PM - 09:30 PM',
      status: 'Online',
    },
    {
      id: `${doctor.id}-clinic`,
      type: 'clinic',
      name: `${doctor.city || city} Clinic`,
      location: doctor.city || city,
      fee,
      currency,
      hours: '10:00 AM - 07:00 PM',
      status: 'In Clinic',
    },
  ];

  return {
    ...doctor,
    specialtyIds: doctor.specialtyIds ?? [],
    role: doctor.title || 'Consultant',
    averageRating: doctor.averageRating ?? 0,
    reviewCount: doctor.reviewCount ?? 0,
    waitTimeMins: 10,
    avgTimeToPatientMins: 25,
    ratingBreakdown: {
      patientSatisfaction: doctor.averageRating ?? 4.5,
      diagnosis: doctor.averageRating ?? 4.5,
      staffBehaviour: doctor.averageRating ?? 4.5,
      clinicEnvironment: doctor.averageRating ?? 4.5,
    },
    reviews: [],
    consultationOptions,
    timeSlots: DEFAULT_TIME_SLOTS,
  };
};
