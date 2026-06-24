import { DoctorSearchResult } from '../../../core/models/doctor.model';
import { getDummyDoctorsByIds } from '../../doctors/data/dummy-doctors.data';

export interface SurgeryCityOption {
  name: string;
  slug: string;
}

export interface SurgeryProcedure {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  priceFrom: number;
  priceTo?: number;
  duration: string;
  anesthesiaType: string;
  hospitalStay?: string;
}

export interface SurgeryHospital {
  id: string;
  slug: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  citySlug: string;
  country: string;
  imageUrl: string;
  rating: number;
  is24Hours: boolean;
  facilities: string[];
  surgeryIds: string[];
  doctorIds: string[];
  surgeries?: SurgeryProcedure[];
  specialists?: DoctorSearchResult[];
  surgeryCount?: number;
  specialistCount?: number;
}

export const SURGERY_CITIES: SurgeryCityOption[] = [
  { name: 'Lahore', slug: 'lahore' },
  { name: 'Karachi', slug: 'karachi' },
  { name: 'Islamabad', slug: 'islamabad' },
];

const SURGERY_PROCEDURES: SurgeryProcedure[] = [
  {
    id: 'surg-appendectomy',
    slug: 'appendectomy',
    name: 'Appendectomy',
    description: 'Surgical removal of the appendix, typically performed laparoscopically for acute appendicitis.',
    category: 'General Surgery',
    priceFrom: 85000,
    priceTo: 150000,
    duration: '45–90 minutes',
    anesthesiaType: 'General',
    hospitalStay: '1–2 days',
  },
  {
    id: 'surg-cholecystectomy',
    slug: 'laparoscopic-cholecystectomy',
    name: 'Laparoscopic Cholecystectomy',
    description: 'Minimally invasive gallbladder removal for gallstones and cholecystitis.',
    category: 'General Surgery',
    priceFrom: 120000,
    priceTo: 220000,
    duration: '1–2 hours',
    anesthesiaType: 'General',
    hospitalStay: '1–3 days',
  },
  {
    id: 'surg-hernia',
    slug: 'hernia-repair',
    name: 'Inguinal Hernia Repair',
    description: 'Repair of inguinal hernia using mesh or tissue techniques to prevent recurrence.',
    category: 'General Surgery',
    priceFrom: 95000,
    priceTo: 180000,
    duration: '1–2 hours',
    anesthesiaType: 'Spinal / General',
    hospitalStay: '1–2 days',
  },
  {
    id: 'surg-cataract',
    slug: 'cataract-surgery',
    name: 'Cataract Surgery (Phacoemulsification)',
    description: 'Removal of clouded lens and implantation of intraocular lens to restore vision.',
    category: 'Ophthalmology',
    priceFrom: 45000,
    priceTo: 120000,
    duration: '20–40 minutes',
    anesthesiaType: 'Local',
    hospitalStay: 'Day case',
  },
  {
    id: 'surg-cabg',
    slug: 'cabg',
    name: 'Coronary Artery Bypass Graft (CABG)',
    description: 'Open-heart surgery to bypass blocked coronary arteries and restore blood flow.',
    category: 'Cardiac Surgery',
    priceFrom: 650000,
    priceTo: 1200000,
    duration: '3–6 hours',
    anesthesiaType: 'General',
    hospitalStay: '5–10 days',
  },
  {
    id: 'surg-angioplasty',
    slug: 'coronary-angioplasty',
    name: 'Coronary Angioplasty with Stent',
    description: 'Catheter-based procedure to open narrowed coronary arteries and place stents.',
    category: 'Cardiology',
    priceFrom: 350000,
    priceTo: 600000,
    duration: '1–2 hours',
    anesthesiaType: 'Local / Sedation',
    hospitalStay: '1–2 days',
  },
  {
    id: 'surg-knee-replacement',
    slug: 'total-knee-replacement',
    name: 'Total Knee Replacement (TKR)',
    description: 'Replacement of damaged knee joint with prosthetic components for arthritis relief.',
    category: 'Orthopedics',
    priceFrom: 450000,
    priceTo: 850000,
    duration: '1.5–2.5 hours',
    anesthesiaType: 'Spinal / General',
    hospitalStay: '3–5 days',
  },
  {
    id: 'surg-hip-replacement',
    slug: 'total-hip-replacement',
    name: 'Total Hip Replacement (THR)',
    description: 'Surgical replacement of hip joint to treat severe arthritis or fractures.',
    category: 'Orthopedics',
    priceFrom: 500000,
    priceTo: 950000,
    duration: '1.5–3 hours',
    anesthesiaType: 'Spinal / General',
    hospitalStay: '4–7 days',
  },
  {
    id: 'surg-cesarean',
    slug: 'cesarean-section',
    name: 'Cesarean Section (C-Section)',
    description: 'Surgical delivery of baby through abdominal incision when vaginal delivery is not safe.',
    category: 'Gynecology',
    priceFrom: 120000,
    priceTo: 280000,
    duration: '45–60 minutes',
    anesthesiaType: 'Spinal / Epidural',
    hospitalStay: '2–4 days',
  },
  {
    id: 'surg-hysterectomy',
    slug: 'laparoscopic-hysterectomy',
    name: 'Laparoscopic Hysterectomy',
    description: 'Minimally invasive removal of uterus for fibroids, endometriosis, or cancer.',
    category: 'Gynecology',
    priceFrom: 200000,
    priceTo: 400000,
    duration: '2–3 hours',
    anesthesiaType: 'General',
    hospitalStay: '2–4 days',
  },
  {
    id: 'surg-tonsillectomy',
    slug: 'tonsillectomy',
    name: 'Tonsillectomy',
    description: 'Surgical removal of tonsils for recurrent infections or obstructive sleep apnea.',
    category: 'ENT',
    priceFrom: 65000,
    priceTo: 120000,
    duration: '30–60 minutes',
    anesthesiaType: 'General',
    hospitalStay: 'Day case / 1 day',
  },
  {
    id: 'surg-septoplasty',
    slug: 'septoplasty',
    name: 'Septoplasty',
    description: 'Correction of deviated nasal septum to improve breathing and reduce congestion.',
    category: 'ENT',
    priceFrom: 80000,
    priceTo: 160000,
    duration: '1–2 hours',
    anesthesiaType: 'General',
    hospitalStay: 'Day case / 1 day',
  },
  {
    id: 'surg-prostate',
    slug: 'turp',
    name: 'TURP (Prostate Surgery)',
    description: 'Transurethral resection of prostate to relieve urinary obstruction from BPH.',
    category: 'Urology',
    priceFrom: 150000,
    priceTo: 300000,
    duration: '1–2 hours',
    anesthesiaType: 'Spinal / General',
    hospitalStay: '2–3 days',
  },
  {
    id: 'surg-kidney-stone',
    slug: 'pcnl-kidney-stone',
    name: 'PCNL (Kidney Stone Removal)',
    description: 'Percutaneous removal of large kidney stones through a small back incision.',
    category: 'Urology',
    priceFrom: 180000,
    priceTo: 350000,
    duration: '1.5–3 hours',
    anesthesiaType: 'General',
    hospitalStay: '2–4 days',
  },
  {
    id: 'surg-mastectomy',
    slug: 'mastectomy',
    name: 'Mastectomy',
    description: 'Surgical removal of breast tissue for breast cancer treatment or risk reduction.',
    category: 'Oncology',
    priceFrom: 250000,
    priceTo: 550000,
    duration: '2–4 hours',
    anesthesiaType: 'General',
    hospitalStay: '2–5 days',
  },
  {
    id: 'surg-thyroidectomy',
    slug: 'thyroidectomy',
    name: 'Thyroidectomy',
    description: 'Partial or total removal of thyroid gland for nodules, goiter, or cancer.',
    category: 'General Surgery',
    priceFrom: 180000,
    priceTo: 380000,
    duration: '2–4 hours',
    anesthesiaType: 'General',
    hospitalStay: '1–3 days',
  },
  {
    id: 'surg-spine',
    slug: 'lumbar-discectomy',
    name: 'Lumbar Discectomy',
    description: 'Removal of herniated disc material pressing on spinal nerves to relieve pain.',
    category: 'Neurosurgery',
    priceFrom: 300000,
    priceTo: 600000,
    duration: '1.5–3 hours',
    anesthesiaType: 'General',
    hospitalStay: '2–4 days',
  },
  {
    id: 'surg-bariatric',
    slug: 'gastric-sleeve',
    name: 'Gastric Sleeve Surgery',
    description: 'Weight-loss surgery reducing stomach size to limit food intake and promote weight loss.',
    category: 'Bariatric',
    priceFrom: 350000,
    priceTo: 650000,
    duration: '1–2 hours',
    anesthesiaType: 'General',
    hospitalStay: '2–4 days',
  },
];

const DUMMY_SURGERY_HOSPITALS: Omit<SurgeryHospital, 'surgeries' | 'specialists' | 'surgeryCount' | 'specialistCount'>[] = [
  {
    id: 'surg-lhr-skm',
    slug: 'shaukat-khanum-memorial',
    name: 'Shaukat Khanum Memorial Cancer Hospital',
    description: 'Leading cancer hospital offering advanced oncological surgeries, minimally invasive procedures, and multidisciplinary surgical care.',
    phone: '042-35905000',
    email: 'info@skm.org.pk',
    address: '7-A Block R-3, Johar Town, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1586773866498-ae9052b6dd04?w=800&auto=format&fit=crop',
    rating: 4.9,
    is24Hours: true,
    facilities: ['Modular OTs', 'ICU & CCU', 'Robotic Surgery', 'Blood Bank', 'Post-op Recovery', 'Pain Management'],
    surgeryIds: ['surg-mastectomy', 'surg-thyroidectomy', 'surg-appendectomy', 'surg-cholecystectomy', 'surg-hernia'],
    doctorIds: ['dummy-2', 'dummy-16', 'dummy-11', 'dummy-18'],
  },
  {
    id: 'surg-lhr-services',
    slug: 'services-hospital',
    name: 'Services Hospital',
    description: 'Major public tertiary hospital with comprehensive general, trauma, and emergency surgical departments.',
    phone: '042-99203402',
    email: 'info@serviceshospital.gov.pk',
    address: 'Jail Road, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
    rating: 4.5,
    is24Hours: true,
    facilities: ['Emergency OT', 'Trauma Center', 'ICU', '24/7 Surgical Team', 'Radiology', 'Laboratory'],
    surgeryIds: ['surg-appendectomy', 'surg-hernia', 'surg-cholecystectomy', 'surg-tonsillectomy', 'surg-thyroidectomy'],
    doctorIds: ['dummy-7', 'dummy-9', 'dummy-8', 'dummy-21'],
  },
  {
    id: 'surg-lhr-fatima',
    slug: 'fatima-memorial-hospital',
    name: 'Fatima Memorial Hospital',
    description: 'Renowned hospital for women and children offering gynecological, obstetric, and pediatric surgical services.',
    phone: '042-35862623',
    email: 'contact@fmh.org.pk',
    address: 'Shadman, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd818fdf05?w=800&auto=format&fit=crop',
    rating: 4.7,
    is24Hours: true,
    facilities: ['NICU', 'Labour Suite', 'Laparoscopic OT', 'Neonatal Surgery', 'NICU Recovery', 'Lactation Support'],
    surgeryIds: ['surg-cesarean', 'surg-hysterectomy', 'surg-appendectomy', 'surg-hernia'],
    doctorIds: ['dummy-3', 'dummy-5', 'dummy-13', 'dummy-14'],
  },
  {
    id: 'surg-lhr-mayo',
    slug: 'mayo-hospital',
    name: 'Mayo Hospital',
    description: 'Historic teaching hospital with broad surgical specialties including orthopedics, ENT, and general surgery.',
    phone: '042-99211109',
    email: 'info@mayohospital.gov.pk',
    address: 'Outer Circular Road, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15a5089a2?w=800&auto=format&fit=crop',
    rating: 4.4,
    is24Hours: true,
    facilities: ['Teaching Hospital', 'Orthopedic OT', 'ENT Suite', 'Blood Bank', 'Post-op Ward', 'Physiotherapy'],
    surgeryIds: ['surg-knee-replacement', 'surg-hip-replacement', 'surg-tonsillectomy', 'surg-septoplasty', 'surg-appendectomy'],
    doctorIds: ['dummy-18', 'dummy-21', 'dummy-10', 'dummy-7'],
  },
  {
    id: 'surg-khi-aga',
    slug: 'aga-khan-university-hospital',
    name: 'Aga Khan University Hospital',
    description: 'Premier private hospital with internationally trained surgeons across cardiac, orthopedic, and minimally invasive specialties.',
    phone: '021-34930000',
    email: 'patientservices@aku.edu',
    address: 'Stadium Road, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-0f4085a5e137?w=800&auto=format&fit=crop',
    rating: 4.9,
    is24Hours: true,
    facilities: ['Cardiac Cath Lab', 'Hybrid OT', 'Robotic Surgery', 'ICU/CCU', 'International Standards', 'Rehabilitation'],
    surgeryIds: ['surg-cabg', 'surg-angioplasty', 'surg-knee-replacement', 'surg-hip-replacement', 'surg-cataract', 'surg-cholecystectomy'],
    doctorIds: ['dummy-16', 'dummy-17', 'dummy-18', 'dummy-6'],
  },
  {
    id: 'surg-khi-liaquat',
    slug: 'liaquat-national-hospital',
    name: 'Liaquat National Hospital',
    description: 'Leading Karachi hospital known for cardiac surgery, neurosurgery, and advanced laparoscopic procedures.',
    phone: '021-34412345',
    email: 'info@lnh.edu.pk',
    address: 'National Stadium Road, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop',
    rating: 4.8,
    is24Hours: true,
    facilities: ['Cardiac Surgery Unit', 'Neurosurgery OT', 'Dialysis', 'ICU', 'Advanced Imaging', '24/7 Emergency'],
    surgeryIds: ['surg-cabg', 'surg-angioplasty', 'surg-spine', 'surg-kidney-stone', 'surg-prostate'],
    doctorIds: ['dummy-16', 'dummy-17', 'dummy-7', 'dummy-12'],
  },
  {
    id: 'surg-khi-south',
    slug: 'south-city-hospital',
    name: 'South City Hospital',
    description: 'Multi-specialty Clifton hospital offering general, gynecological, and bariatric surgical services.',
    phone: '021-35862301',
    email: 'info@southcityhospital.com',
    address: 'Clifton Block 3, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1580281653706-8b283f070c05?w=800&auto=format&fit=crop',
    rating: 4.6,
    is24Hours: false,
    facilities: ['Laparoscopic OT', 'Maternity Wing', 'Bariatric Program', 'Day Care Surgery', 'Pharmacy', 'Diagnostics'],
    surgeryIds: ['surg-bariatric', 'surg-cesarean', 'surg-hysterectomy', 'surg-hernia', 'surg-cataract'],
    doctorIds: ['dummy-1', 'dummy-4', 'dummy-9'],
  },
  {
    id: 'surg-khi-jinnah',
    slug: 'jinnah-postgraduate-medical-centre',
    name: 'Jinnah Postgraduate Medical Centre',
    description: 'Major public hospital and surgical training center with urology, general, and trauma surgery departments.',
    phone: '021-99201300',
    email: 'info@jpmc.edu.pk',
    address: 'Rafiqui Shaheed Road, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop',
    rating: 4.3,
    is24Hours: true,
    facilities: ['Trauma Center', 'Urology OT', 'Teaching Hospital', 'Blood Bank', 'Emergency Surgery', 'Radiology'],
    surgeryIds: ['surg-prostate', 'surg-kidney-stone', 'surg-appendectomy', 'surg-hernia', 'surg-tonsillectomy'],
    doctorIds: ['dummy-6', 'dummy-11', 'dummy-19'],
  },
  {
    id: 'surg-isl-shifa',
    slug: 'shifa-international-hospital',
    name: 'Shifa International Hospital',
    description: 'Top Islamabad hospital with comprehensive surgical programs including cardiac, orthopedic, and laparoscopic surgery.',
    phone: '051-8463666',
    email: 'info@shifa.com.pk',
    address: 'Pitras Bukhari Road, H-8/4, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
    rating: 4.8,
    is24Hours: true,
    facilities: ['Cardiac Center', 'Orthopedic Wing', 'Laparoscopic Suite', 'ICU', 'International Accredited', 'Rehab Center'],
    surgeryIds: ['surg-cabg', 'surg-knee-replacement', 'surg-hip-replacement', 'surg-cataract', 'surg-cholecystectomy', 'surg-spine'],
    doctorIds: ['dummy-16', 'dummy-18', 'dummy-20', 'dummy-21'],
  },
  {
    id: 'surg-isl-pims',
    slug: 'pims-hospital',
    name: 'Pakistan Institute of Medical Sciences (PIMS)',
    description: 'Federal tertiary hospital providing affordable surgical care across general, gynecological, and ENT specialties.',
    phone: '051-9261170',
    email: 'info@pims.gov.pk',
    address: 'G-8/3, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1586773866498-ae9052b6dd04?w=800&auto=format&fit=crop',
    rating: 4.4,
    is24Hours: true,
    facilities: ['Government Hospital', 'General Surgery', 'Gynecology OT', 'ENT Department', 'ICU', 'Emergency OT'],
    surgeryIds: ['surg-appendectomy', 'surg-cesarean', 'surg-hysterectomy', 'surg-tonsillectomy', 'surg-hernia'],
    doctorIds: ['dummy-9', 'dummy-13', 'dummy-4', 'dummy-19'],
  },
  {
    id: 'surg-isl-maroof',
    slug: 'maroof-international-hospital',
    name: 'Maroof International Hospital',
    description: 'Modern Islamabad hospital with day-care surgery, laparoscopic procedures, and specialist surgical consultations.',
    phone: '051-111627663',
    email: 'info@maroofhospital.com',
    address: 'F-10 Markaz, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd818fdf05?w=800&auto=format&fit=crop',
    rating: 4.5,
    is24Hours: false,
    facilities: ['Day Care Surgery', 'Laparoscopic OT', 'Recovery Lounge', 'Diagnostics', 'Pharmacy', 'Home Care'],
    surgeryIds: ['surg-cholecystectomy', 'surg-hernia', 'surg-cataract', 'surg-septoplasty', 'surg-bariatric'],
    doctorIds: ['dummy-1', 'dummy-15', 'dummy-12', 'dummy-10'],
  },
];

function getSurgeriesByIds(surgeryIds: string[]): SurgeryProcedure[] {
  return surgeryIds
    .map((id) => SURGERY_PROCEDURES.find((s) => s.id === id))
    .filter((s): s is SurgeryProcedure => s !== undefined);
}

function enrichSurgeryHospital(
  hospital: Omit<SurgeryHospital, 'surgeries' | 'specialists' | 'surgeryCount' | 'specialistCount'>,
): SurgeryHospital {
  const surgeries = getSurgeriesByIds(hospital.surgeryIds);
  const specialists = getDummyDoctorsByIds(hospital.doctorIds, hospital.city, hospital.name);
  return {
    ...hospital,
    surgeries,
    specialists,
    surgeryCount: surgeries.length,
    specialistCount: specialists.length,
  };
}

export function getSurgeryHospitalsByCitySlug(citySlug: string): SurgeryHospital[] {
  return DUMMY_SURGERY_HOSPITALS.filter((h) => h.citySlug === citySlug.toLowerCase()).map(enrichSurgeryHospital);
}

export function getSurgeryHospitalBySlug(citySlug: string, hospitalSlug: string): SurgeryHospital | undefined {
  const hospital = DUMMY_SURGERY_HOSPITALS.find(
    (h) => h.citySlug === citySlug.toLowerCase() && h.slug === hospitalSlug.toLowerCase(),
  );
  return hospital ? enrichSurgeryHospital(hospital) : undefined;
}

export function getSurgeryCityName(citySlug: string): string {
  return SURGERY_CITIES.find((c) => c.slug === citySlug)?.name ?? citySlug;
}

function formatSurgeryPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

export function formatSurgeryPriceRange(priceFrom: number, priceTo?: number): string {
  if (priceTo && priceTo > priceFrom) {
    return `${formatSurgeryPrice(priceFrom)} – ${formatSurgeryPrice(priceTo)}`;
  }
  return `From ${formatSurgeryPrice(priceFrom)}`;
}
