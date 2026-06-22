import { DoctorSearchResult } from '../../../core/models/doctor.model';
import { getDummyDoctorsByIds } from './dummy-doctors.data';

export interface HospitalCityOption {
  name: string;
  slug: string;
}

export interface PublicHospital {
  id: string;
  slug: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  citySlug: string;
  state?: string;
  country: string;
  postalCode?: string;
  imageUrl: string;
  specialties: string[];
  doctorCount: number;
  rating: number;
  is24Hours: boolean;
  doctorIds: string[];
  doctors?: DoctorSearchResult[];
}

export const HOSPITAL_CITIES: HospitalCityOption[] = [
  { name: 'Lahore', slug: 'lahore' },
  { name: 'Karachi', slug: 'karachi' },
  { name: 'Islamabad', slug: 'islamabad' },
];

const DUMMY_HOSPITALS: Omit<PublicHospital, 'doctors' | 'doctorCount'>[] = [
  {
    id: 'hosp-lhr-services',
    slug: 'services-hospital',
    name: 'Services Hospital',
    description: 'One of Lahore\'s largest tertiary care hospitals with emergency, OPD, and specialist departments.',
    phone: '042-99203402',
    email: 'info@serviceshospital.gov.pk',
    address: 'Jail Road, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
    specialties: ['Gynecology', 'General Medicine', 'Gastroenterology', 'Emergency'],
    rating: 4.6,
    is24Hours: true,
    doctorIds: ['dummy-4', 'dummy-7', 'dummy-9', 'dummy-8'],
  },
  {
    id: 'hosp-lhr-skm',
    slug: 'shaukat-khanum-memorial',
    name: 'Shaukat Khanum Memorial Cancer Hospital',
    description: 'Leading cancer hospital providing oncology, radiology, and multidisciplinary cancer care.',
    phone: '042-35905000',
    email: 'info@skm.org.pk',
    address: '7-A Block R-3, Johar Town, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1586773866498-ae9052b6dd04?w=800&auto=format&fit=crop',
    specialties: ['Oncology', 'Dermatology', 'Radiology'],
    rating: 4.8,
    is24Hours: true,
    doctorIds: ['dummy-2', 'dummy-16', 'dummy-11'],
  },
  {
    id: 'hosp-lhr-fatima',
    slug: 'fatima-memorial-hospital',
    name: 'Fatima Memorial Hospital',
    description: 'Trusted hospital for women and children with NICU, gynecology, and pediatric services.',
    phone: '042-35862623',
    email: 'contact@fmh.org.pk',
    address: 'Shadman, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd818fdf05?w=800&auto=format&fit=crop',
    specialties: ['Pediatrics', 'Gynecology', 'Dermatology'],
    rating: 4.5,
    is24Hours: true,
    doctorIds: ['dummy-3', 'dummy-5', 'dummy-13', 'dummy-14'],
  },
  {
    id: 'hosp-lhr-mayo',
    slug: 'mayo-hospital',
    name: 'Mayo Hospital',
    description: 'Historic teaching hospital affiliated with King Edward Medical University.',
    phone: '042-99211109',
    email: 'info@mayohospital.gov.pk',
    address: 'Outer Circular Road, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15a5089a2?w=800&auto=format&fit=crop',
    specialties: ['General Medicine', 'Surgery', 'Orthopedics', 'ENT'],
    rating: 4.3,
    is24Hours: true,
    doctorIds: ['dummy-7', 'dummy-18', 'dummy-21', 'dummy-10'],
  },
  {
    id: 'hosp-khi-aga-khan',
    slug: 'aga-khan-university-hospital',
    name: 'Aga Khan University Hospital',
    description: 'Premier private hospital in Karachi with international standard facilities and specialists.',
    phone: '021-34930000',
    email: 'patientservices@aku.edu',
    address: 'Stadium Road, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-0f4085a5e137?w=800&auto=format&fit=crop',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Urology'],
    rating: 4.9,
    is24Hours: true,
    doctorIds: ['dummy-16', 'dummy-17', 'dummy-18', 'dummy-6'],
  },
  {
    id: 'hosp-khi-south-city',
    slug: 'south-city-hospital',
    name: 'South City Hospital',
    description: 'Multi-specialty hospital in Clifton offering OPD, diagnostics, and surgical services.',
    phone: '021-35862301',
    email: 'info@southcityhospital.com',
    address: 'Clifton Block 3, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop',
    specialties: ['Dermatology', 'Gynecology', 'General Medicine'],
    rating: 4.7,
    is24Hours: false,
    doctorIds: ['dummy-1', 'dummy-4', 'dummy-9'],
  },
  {
    id: 'hosp-khi-jinnah',
    slug: 'jinnah-postgraduate-medical-centre',
    name: 'Jinnah Postgraduate Medical Centre',
    description: 'Major public hospital and medical education center in Karachi.',
    phone: '021-99201300',
    email: 'info@jpmc.edu.pk',
    address: 'Rafiqui Shaheed Road, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1580281653706-8b283f070c05?w=800&auto=format&fit=crop',
    specialties: ['Urology', 'Psychiatry', 'Pulmonology', 'Emergency'],
    rating: 4.4,
    is24Hours: true,
    doctorIds: ['dummy-6', 'dummy-11', 'dummy-19'],
  },
  {
    id: 'hosp-khi-liaquat',
    slug: 'liaquat-national-hospital',
    name: 'Liaquat National Hospital',
    description: 'Renowned private hospital with advanced cardiac, neuro, and surgical units.',
    phone: '021-34412345',
    email: 'info@lnh.edu.pk',
    address: 'National Stadium Road, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-0f4085a5e137?w=800&auto=format&fit=crop',
    specialties: ['Cardiology', 'Neurology', 'Gastroenterology'],
    rating: 4.6,
    is24Hours: true,
    doctorIds: ['dummy-16', 'dummy-17', 'dummy-7', 'dummy-12'],
  },
  {
    id: 'hosp-isl-pims',
    slug: 'pims-hospital',
    name: 'Pakistan Institute of Medical Sciences (PIMS)',
    description: 'Federal tertiary care hospital serving Islamabad and surrounding regions.',
    phone: '051-9261170',
    email: 'info@pims.gov.pk',
    address: 'G-8/3, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
    specialties: ['General Medicine', 'Pediatrics', 'Gynecology', 'Emergency'],
    rating: 4.4,
    is24Hours: true,
    doctorIds: ['dummy-9', 'dummy-13', 'dummy-4', 'dummy-19'],
  },
  {
    id: 'hosp-isl-shifa',
    slug: 'shifa-international-hospital',
    name: 'Shifa International Hospital',
    description: 'Leading private hospital in Islamabad with comprehensive specialty care.',
    phone: '051-8463666',
    email: 'info@shifa.com.pk',
    address: 'Pitras Bukhari Road, H-8/4, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1586773866498-ae9052b6dd04?w=800&auto=format&fit=crop',
    specialties: ['Cardiology', 'Orthopedics', 'Ophthalmology', 'ENT'],
    rating: 4.8,
    is24Hours: true,
    doctorIds: ['dummy-16', 'dummy-18', 'dummy-20', 'dummy-21'],
  },
  {
    id: 'hosp-isl-maroof',
    slug: 'maroof-international-hospital',
    name: 'Maroof International Hospital',
    description: 'Modern hospital in Islamabad offering OPD, diagnostics, and specialist consultations.',
    phone: '051-111627663',
    email: 'info@maroofhospital.com',
    address: 'F-10 Markaz, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd818fdf05?w=800&auto=format&fit=crop',
    specialties: ['Dermatology', 'Nutrition', 'Psychiatry', 'General Medicine'],
    rating: 4.5,
    is24Hours: false,
    doctorIds: ['dummy-1', 'dummy-15', 'dummy-12', 'dummy-10'],
  },
];

function enrichHospital(hospital: Omit<PublicHospital, 'doctors' | 'doctorCount'>): PublicHospital {
  const doctors = getDummyDoctorsByIds(hospital.doctorIds, hospital.city, hospital.name);
  return {
    ...hospital,
    doctorCount: doctors.length,
    doctors,
  };
}

export function getHospitalsByCitySlug(citySlug: string): PublicHospital[] {
  return DUMMY_HOSPITALS.filter((h) => h.citySlug === citySlug.toLowerCase()).map(enrichHospital);
}

export function getHospitalBySlug(citySlug: string, hospitalSlug: string): PublicHospital | undefined {
  const hospital = DUMMY_HOSPITALS.find(
    (h) => h.citySlug === citySlug.toLowerCase() && h.slug === hospitalSlug.toLowerCase(),
  );
  return hospital ? enrichHospital(hospital) : undefined;
}

export function getHospitalCityName(citySlug: string): string {
  return HOSPITAL_CITIES.find((c) => c.slug === citySlug)?.name ?? citySlug;
}
