import { DoctorSearchResult } from '../../../core/models/doctor.model';
import { Hospital, HospitalDoctorSummary, PublicHospitalView } from '../../../core/models/hospital.model';
import { LabTest, PublicLab } from '../../../core/models/lab.model';
import {
  Medicine,
  MedicineStockStatus,
  PharmacyMedicine,
  PharmacySummary,
  PublicPharmacyView,
} from '../../../core/models/medicine.model';
import { SurgeryHospitalView, SurgeryProcedure } from '../../../core/models/surgery.model';

const DEFAULT_HOSPITAL_IMAGE =
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop';

const CITY_NAMES: Record<string, string> = {
  lahore: 'Lahore',
  karachi: 'Karachi',
  islamabad: 'Islamabad',
  multan: 'Multan',
  peshawar: 'Peshawar',
  faisalabad: 'Faisalabad',
};

export const cityNameFromSlug = (slug: string): string =>
  CITY_NAMES[slug.toLowerCase()] ?? slug.charAt(0).toUpperCase() + slug.slice(1);

export const formatLabPrice = (price: number, currency = 'PKR'): string => {
  const symbol = currency === 'PKR' ? 'Rs.' : currency;
  return `${symbol} ${price.toLocaleString('en-PK')}`;
};

export const formatMedicinePrice = (price: number): string => `Rs. ${price.toLocaleString('en-PK')}`;

export const formatSurgeryPriceRange = (priceFrom: number, priceTo?: number): string => {
  if (priceTo && priceTo > priceFrom) {
    return `Rs. ${priceFrom.toLocaleString('en-PK')} – ${priceTo.toLocaleString('en-PK')}`;
  }
  return `From Rs. ${priceFrom.toLocaleString('en-PK')}`;
};

export const stockStatusFromStock = (stock: number): MedicineStockStatus => {
  if (stock <= 0) return 'out_of_stock';
  if (stock < 10) return 'low_stock';
  return 'in_stock';
};

export const getStockLabel = (status: MedicineStockStatus): string => {
  if (status === 'in_stock') return 'In stock';
  if (status === 'low_stock') return 'Low stock';
  return 'Out of stock';
};

export const getStockClasses = (status: MedicineStockStatus): string => {
  if (status === 'in_stock') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (status === 'low_stock') return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-gray-500 bg-gray-100 border-gray-200';
};

export const toPublicHospitalView = (hospital: Hospital): PublicHospitalView => ({
  ...hospital,
  imageUrl: hospital.images?.[0] ?? DEFAULT_HOSPITAL_IMAGE,
  specialties: hospital.facilities?.length ? hospital.facilities : ['General Care'],
  is24Hours: (hospital.facilities || []).some((f) => /24|emergency/i.test(f)),
  phone: hospital.phone?.trim() || '—',
  email: hospital.email?.trim() || '—',
  website: hospital.website?.trim() || '',
  country: 'Pakistan',
  doctorCount: hospital.doctorCount ?? hospital.doctorIds?.length ?? 0,
  rating: hospital.rating ?? 0,
});

export const doctorSummaryToSearchResult = (
  doctor: HospitalDoctorSummary,
  city: string,
): DoctorSearchResult => {
  const parts = doctor.fullName.trim().split(/\s+/).filter(Boolean);
  return {
    id: doctor.id,
    userId: doctor.id,
    user: {
      id: doctor.id,
      firstName: parts[0] ?? doctor.fullName,
      lastName: parts.slice(1).join(' '),
    },
    city,
    specialtyIds: [],
    languageIds: [],
    consultationFee: 1500,
    currency: 'PKR',
    averageRating: doctor.averageRating ?? 0,
    reviewCount: doctor.reviewCount ?? 0,
  };
};

const DEFAULT_PHARMACY_IMAGE =
  'https://images.unsplash.com/photo-1587854692152-cf660a4e3718?w=800&auto=format&fit=crop';

export const toLabTestView = (test: LabTest): LabTest => ({
  ...test,
  slug: test.slug ?? test.id,
  description: test.description ?? '',
  category: test.category ?? 'General',
  sampleType: test.sampleType ?? 'Blood',
  turnaroundTime: test.turnaroundTime ?? '24 hours',
});

const DEFAULT_LAB_IMAGE =
  'https://images.unsplash.com/photo-1579154204601-01588fcc3518?w=800&auto=format&fit=crop';

export const toPublicLabView = (lab: PublicLab, tests: LabTest[] = []): PublicLab => {
  const mappedTests = tests.map(toLabTestView);
  return {
    ...lab,
    address: lab.address ?? '—',
    phone: lab.phone?.trim() || '—',
    email: lab.email?.trim() || '—',
    website: lab.website?.trim() || '',
    description: lab.description?.trim() || `Diagnostic laboratory in ${lab.city}.`,
    imageUrl: lab.images?.[0] || lab.imageUrl || DEFAULT_LAB_IMAGE,
    rating: lab.rating ?? 4.5,
    timings: lab.timings?.trim() || 'Mon–Sat: 8:00 AM – 8:00 PM',
    tests: mappedTests,
    testCount: lab.testCount ?? mappedTests.length,
    isHomeCollection: lab.isHomeCollection ?? mappedTests.some((test) => test.homeCollectionAvailable),
  };
};

export const medicineToPharmacyMedicine = (medicine: Medicine): PharmacyMedicine => ({
  id: medicine.id,
  name: medicine.name,
  manufacturer: medicine.manufacturer ?? '—',
  description: medicine.description ?? '',
  category: 'General',
  dosage: '—',
  price: medicine.price,
  requiresPrescription: medicine.requiresPrescription,
  stockStatus: stockStatusFromStock(medicine.stock),
  stockQuantity: medicine.stock,
});

export const toPublicPharmacyView = (
  pharmacy: PharmacySummary,
  medicines: Medicine[],
): PublicPharmacyView => ({
  ...pharmacy,
  phone: pharmacy.phone?.trim() || '—',
  email: pharmacy.email?.trim() || '—',
  description:
    pharmacy.description?.trim() || `Trusted pharmacy in ${pharmacy.city}.`,
  imageUrl: pharmacy.images?.[0] || DEFAULT_PHARMACY_IMAGE,
  rating: pharmacy.rating ?? 4.5,
  medicineCount: medicines.length,
  timings: pharmacy.timings?.trim() || 'Mon–Sun: 9:00 AM – 10:00 PM',
  isHomeDelivery: pharmacy.isHomeDelivery !== false,
  deliveryFee: pharmacy.deliveryFee ?? 150,
  deliveryTime: pharmacy.deliveryTime?.trim() || '45–90 min',
  medicines: medicines.map(medicineToPharmacyMedicine),
});

export const toSurgeryProcedureView = (procedure: SurgeryProcedure): SurgeryProcedure => ({
  ...procedure,
  priceFrom: procedure.estimatedCostRange?.min ?? procedure.priceFrom ?? 0,
  priceTo: procedure.estimatedCostRange?.max ?? procedure.priceTo,
  duration: procedure.duration ?? '—',
  anesthesiaType: procedure.anesthesiaType ?? 'General',
});

export const toSurgeryHospitalView = (
  hospital: Hospital,
  procedures: SurgeryProcedure[],
): SurgeryHospitalView => ({
  id: hospital.id,
  slug: hospital.slug,
  name: hospital.name,
  description: hospital.description ?? '',
  phone: hospital.phone?.trim() || '—',
  email: hospital.email?.trim() || '—',
  website: hospital.website?.trim() || '',
  address: hospital.address ?? '',
  city: hospital.city,
  citySlug: hospital.citySlug,
  country: 'Pakistan',
  imageUrl: hospital.images?.[0] ?? DEFAULT_HOSPITAL_IMAGE,
  rating: hospital.rating ?? 0,
  is24Hours: (hospital.facilities || []).some((f) => /24|emergency/i.test(f)),
  facilities: hospital.facilities ?? [],
  surgeryIds: procedures.map((p) => p.id),
  doctorIds: hospital.doctorIds ?? [],
  surgeries: procedures.map(toSurgeryProcedureView),
  surgeryCount: procedures.length,
  specialistCount: hospital.doctorIds?.length ?? 0,
});

export const groupMedicinesByPharmacy = (
  medicines: Medicine[],
): { pharmacy: PharmacySummary; medicines: Medicine[] }[] => {
  const map = new Map<string, { pharmacy: PharmacySummary; medicines: Medicine[] }>();

  for (const medicine of medicines) {
    if (!medicine.pharmacy) continue;
    const existing = map.get(medicine.pharmacy.id);
    if (existing) {
      existing.medicines.push(medicine);
    } else {
      map.set(medicine.pharmacy.id, { pharmacy: medicine.pharmacy, medicines: [medicine] });
    }
  }

  return [...map.values()];
};
