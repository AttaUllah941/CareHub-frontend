import { DoctorConsultationOption, DoctorDetailProfile } from '../../../core/models/doctor-profile.model';
import { DoctorSearchResult } from '../../../core/models/doctor.model';

const DEFAULT_TIME_SLOTS = ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

const buildConsultationOptions = (
  doctor: DoctorSearchResult,
  city: string,
): DoctorConsultationOption[] => {
  const fee = doctor.consultationFee ?? 1500;
  const currency = doctor.currency ?? 'PKR';

  const options: DoctorConsultationOption[] = [
    {
      id: `${doctor.id}-video`,
      type: 'video',
      name: 'Video Consultation',
      fee,
      currency,
      hours: '04:30 PM - 09:30 PM',
      status: 'Online',
    },
  ];

  const clinics = doctor.clinics ?? [];
  if (clinics.length) {
    clinics.forEach((clinic) => {
      options.push({
        id: clinic.id,
        type: 'clinic',
        name: clinic.name,
        address: clinic.address,
        location: clinic.city || city,
        facilityType: clinic.facilityType ?? 'clinic',
        fee,
        currency,
        hours: '10:00 AM - 07:00 PM',
        status: 'In Clinic',
      });
    });
  } else if (doctor.city || city) {
    options.push({
      id: `${doctor.id}-clinic-fallback`,
      type: 'clinic',
      name: `${doctor.city || city} Clinic`,
      location: doctor.city || city,
      facilityType: 'clinic',
      fee,
      currency,
      hours: '10:00 AM - 07:00 PM',
      status: 'In Clinic',
    });
  }

  return options;
};

/** Builds a bookable profile from listing data when the detail API is unavailable. */
export const buildBookingProfileFromListing = (
  doctor: DoctorSearchResult,
  city = 'Lahore',
): DoctorDetailProfile => {
  const consultationOptions = buildConsultationOptions(doctor, city);

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

export const formatConsultationAddress = (option: {
  address?: string;
  location?: string;
  city?: string;
}): string => {
  const parts = [option.address?.trim(), (option.location ?? option.city)?.trim()].filter(Boolean);
  return parts.join(', ');
};

export const facilityTypeLabel = (type?: string): string => {
  switch (type) {
    case 'hospital':
      return 'Hospital';
    case 'lab':
      return 'Lab';
    default:
      return 'Clinic';
  }
};
