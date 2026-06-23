export interface ClinicAppointmentPayload {
  bookingRef: string;
  consultationType: 'clinic';
  doctor: {
    id: string;
    name: string;
    specialty: string;
  };
  clinic: {
    id: string;
    name: string;
    location: string;
    hours: string;
    fee: number;
    feeFormatted: string;
    status: string;
  };
  appointment: {
    date: string;
    dateFormatted: string;
    timeSlot: string;
    city: string;
  };
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    notes: string;
  };
  meta: {
    createdAt: string;
    status: 'confirmed';
  };
}
