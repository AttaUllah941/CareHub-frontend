export type LabSampleCollectionType = 'home_sample' | 'lab_visit';

export interface LabTestBookingPayload {
  bookingRef: string;
  collectionType: LabSampleCollectionType;
  collectionLabel: string;
  test: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    price: number;
    priceFormatted: string;
    sampleType: string;
    turnaroundTime: string;
    preparation?: string;
  };
  lab: {
    id: string;
    slug: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    timings: string;
    isHomeCollection: boolean;
  };
  appointment: {
    date: string;
    dateFormatted: string;
    timeSlot: string;
  };
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
  };
  meta: {
    createdAt: string;
    status: 'confirmed';
  };
}
