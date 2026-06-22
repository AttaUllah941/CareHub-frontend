import { DoctorSearchResult } from '../../../core/models/doctor.model';
import {
  DoctorConsultationOption,
  DoctorDetailProfile,
  DoctorReview,
} from '../../../core/models/doctor-profile.model';
import { specialtyLabelFromSlug } from './home-content';

interface DummyDoctorTemplate {
  id: string;
  firstName: string;
  lastName: string;
  specialtySlugs: string[];
  yearsOfExperience: number;
  consultationFee: number;
  qualifications: string[];
  about: string;
  clinic: string;
  avatarSeed: string;
}

const DUMMY_TEMPLATES: DummyDoctorTemplate[] = [
  {
    id: 'dummy-1',
    firstName: 'Zafar',
    lastName: 'Ahmed',
    specialtySlugs: ['dermatologist', 'dermatology'],
    yearsOfExperience: 27,
    consultationFee: 2000,
    qualifications: ['MBBS', 'FCPS Dermatology'],
    about: 'Expert in Hair Problems, Acne And Acne Scars, PRP and Laser treatments.',
    clinic: 'South City Hospital',
    avatarSeed: 'zafar',
  },
  {
    id: 'dummy-2',
    firstName: 'Ayesha',
    lastName: 'Khan',
    specialtySlugs: ['dermatologist', 'dermatology'],
    yearsOfExperience: 14,
    consultationFee: 1500,
    qualifications: ['MBBS', 'MD Dermatology'],
    about: 'Skin specialist for Acne, Eczema, Psoriasis and cosmetic dermatology.',
    clinic: 'Shaukat Khanum Memorial',
    avatarSeed: 'ayesha',
  },
  {
    id: 'dummy-3',
    firstName: 'Hassan',
    lastName: 'Raza',
    specialtySlugs: ['dermatologist', 'dermatology'],
    yearsOfExperience: 19,
    consultationFee: 1800,
    qualifications: ['MBBS', 'D.Derm'],
    about: 'Hair fall, PRP therapy, Laser hair removal and anti-aging treatments.',
    clinic: 'Fatima Memorial Hospital',
    avatarSeed: 'hassan',
  },
  {
    id: 'dummy-4',
    firstName: 'Sana',
    lastName: 'Malik',
    specialtySlugs: ['gynecologist', 'gynecology'],
    yearsOfExperience: 16,
    consultationFee: 2500,
    qualifications: ['MBBS', 'FCPS Gynecology'],
    about: 'Pregnancy care, high-risk pregnancies, and women health consultations.',
    clinic: 'Services Hospital',
    avatarSeed: 'sana',
  },
  {
    id: 'dummy-5',
    firstName: 'Nadia',
    lastName: 'Hussain',
    specialtySlugs: ['gynecologist', 'gynecology'],
    yearsOfExperience: 22,
    consultationFee: 3000,
    qualifications: ['MBBS', 'MCPS', 'FCPS'],
    about: 'Infertility, PCOS, and laparoscopic gynecology procedures.',
    clinic: 'Ittefaq Hospital',
    avatarSeed: 'nadia',
  },
  {
    id: 'dummy-6',
    firstName: 'Imran',
    lastName: 'Siddiqui',
    specialtySlugs: ['urologist', 'urology'],
    yearsOfExperience: 18,
    consultationFee: 2200,
    qualifications: ['MBBS', 'FCPS Urology'],
    about: 'Kidney stones, prostate health, and male urological disorders.',
    clinic: 'Jinnah Hospital',
    avatarSeed: 'imran',
  },
  {
    id: 'dummy-7',
    firstName: 'Khalid',
    lastName: 'Mehmood',
    specialtySlugs: ['gastroenterologist', 'gastroenterology'],
    yearsOfExperience: 21,
    consultationFee: 2800,
    qualifications: ['MBBS', 'FCPS Gastroenterology'],
    about: 'Gastritis, liver disease, IBS and endoscopy specialist.',
    clinic: 'Mayo Hospital',
    avatarSeed: 'khalid',
  },
  {
    id: 'dummy-8',
    firstName: 'Farah',
    lastName: 'Abbasi',
    specialtySlugs: ['gastroenterologist', 'gastroenterology'],
    yearsOfExperience: 12,
    consultationFee: 1600,
    qualifications: ['MBBS', 'MD Internal Medicine'],
    about: 'Digestive disorders, acid reflux, and nutrition counselling.',
    clinic: 'Hameed Latif Hospital',
    avatarSeed: 'farah',
  },
  {
    id: 'dummy-9',
    firstName: 'Tariq',
    lastName: 'Jamil',
    specialtySlugs: ['general-practitioner', 'general-physician', 'general-medicine'],
    yearsOfExperience: 25,
    consultationFee: 1200,
    qualifications: ['MBBS', 'MCPS Family Medicine'],
    about: 'General health checkups, fever, diabetes and hypertension management.',
    clinic: 'City Clinic',
    avatarSeed: 'tariq',
  },
  {
    id: 'dummy-10',
    firstName: 'Bushra',
    lastName: 'Ansari',
    specialtySlugs: ['general-practitioner', 'general-physician', 'general-medicine'],
    yearsOfExperience: 11,
    consultationFee: 800,
    qualifications: ['MBBS'],
    about: 'Primary care, vaccinations, and common illness treatment.',
    clinic: 'Community Health Center',
    avatarSeed: 'bushra',
  },
  {
    id: 'dummy-11',
    firstName: 'Asim',
    lastName: 'Shah',
    specialtySlugs: ['psychiatrist', 'psychologist', 'psychiatry'],
    yearsOfExperience: 15,
    consultationFee: 3500,
    qualifications: ['MBBS', 'FCPS Psychiatry'],
    about: 'Anxiety, Depression, stress management and psychotherapy.',
    clinic: 'Institute of Mental Health',
    avatarSeed: 'asim',
  },
  {
    id: 'dummy-12',
    firstName: 'Rabia',
    lastName: 'Noor',
    specialtySlugs: ['psychiatrist', 'psychologist', 'psychiatry'],
    yearsOfExperience: 10,
    consultationFee: 2500,
    qualifications: ['MBBS', 'MD Psychiatry'],
    about: 'Child psychiatry, ADHD, and cognitive behavioral therapy.',
    clinic: 'MindCare Clinic',
    avatarSeed: 'rabia',
  },
  {
    id: 'dummy-13',
    firstName: 'Usman',
    lastName: 'Ali',
    specialtySlugs: ['pediatrician', 'pediatrics'],
    yearsOfExperience: 17,
    consultationFee: 2000,
    qualifications: ['MBBS', 'FCPS Pediatrics'],
    about: 'Newborn care, vaccinations, and childhood illness specialist.',
    clinic: 'Children Hospital',
    avatarSeed: 'usman',
  },
  {
    id: 'dummy-14',
    firstName: 'Hina',
    lastName: 'Sheikh',
    specialtySlugs: ['pediatrician', 'pediatrics'],
    yearsOfExperience: 13,
    consultationFee: 1800,
    qualifications: ['MBBS', 'DCH'],
    about: 'Growth monitoring, nutrition and pediatric emergency care.',
    clinic: 'Pakistan Institute of Medical Sciences',
    avatarSeed: 'hina',
  },
  {
    id: 'dummy-15',
    firstName: 'Saad',
    lastName: 'Qureshi',
    specialtySlugs: ['nutritionist', 'nutrition'],
    yearsOfExperience: 8,
    consultationFee: 1500,
    qualifications: ['BS Nutrition', 'MSc Dietetics'],
    about: 'Weight loss programs, diabetes diet plans and sports nutrition.',
    clinic: 'Health Plus Clinic',
    avatarSeed: 'saad',
  },
  {
    id: 'dummy-16',
    firstName: 'Amir',
    lastName: 'Butt',
    specialtySlugs: ['cardiologist', 'cardiology'],
    yearsOfExperience: 24,
    consultationFee: 4000,
    qualifications: ['MBBS', 'FCPS Cardiology'],
    about: 'Heart disease, hypertension, ECG and cardiac risk assessment.',
    clinic: 'National Hospital',
    avatarSeed: 'amir',
  },
  {
    id: 'dummy-17',
    firstName: 'Saima',
    lastName: 'Akhtar',
    specialtySlugs: ['neurologist', 'neurology'],
    yearsOfExperience: 20,
    consultationFee: 3500,
    qualifications: ['MBBS', 'FCPS Neurology'],
    about: 'Migraine, epilepsy, stroke recovery and nerve disorders.',
    clinic: 'Neuro Care Institute',
    avatarSeed: 'saima',
  },
  {
    id: 'dummy-18',
    firstName: 'Waqar',
    lastName: 'Cheema',
    specialtySlugs: ['orthopedic-surgeon', 'orthopedic'],
    yearsOfExperience: 19,
    consultationFee: 3000,
    qualifications: ['MBBS', 'FCPS Orthopedic Surgery'],
    about: 'Joint pain, fractures, sports injuries and spine problems.',
    clinic: 'Orthopedic & Spine Center',
    avatarSeed: 'waqar',
  },
  {
    id: 'dummy-19',
    firstName: 'Maria',
    lastName: 'Iqbal',
    specialtySlugs: ['pulmonologist', 'pulmonology'],
    yearsOfExperience: 14,
    consultationFee: 2200,
    qualifications: ['MBBS', 'FCPS Pulmonology'],
    about: 'Asthma, TB, breathlessness and chest infection treatment.',
    clinic: 'Chest Clinic',
    avatarSeed: 'maria',
  },
  {
    id: 'dummy-20',
    firstName: 'Junaid',
    lastName: 'Mirza',
    specialtySlugs: ['ophthalmologist', 'ophthalmology'],
    yearsOfExperience: 16,
    consultationFee: 1800,
    qualifications: ['MBBS', 'MCPS Ophthalmology'],
    about: 'Cataract, glaucoma, LASIK and eye infection specialist.',
    clinic: 'Al-Shifa Eye Trust',
    avatarSeed: 'junaid',
  },
  {
    id: 'dummy-21',
    firstName: 'Faisal',
    lastName: 'Mahmood',
    specialtySlugs: ['ent'],
    yearsOfExperience: 12,
    consultationFee: 1700,
    qualifications: ['MBBS', 'FCPS ENT'],
    about: 'Ear infections, sinusitis, tonsillitis and hearing problems.',
    clinic: 'ENT Specialist Clinic',
    avatarSeed: 'faisal',
  },
];

function toDoctorResult(template: DummyDoctorTemplate, city: string): DoctorSearchResult {
  const specialtyName = specialtyLabelFromSlug(template.specialtySlugs[0]);
  return {
    id: template.id,
    userId: `${template.id}-user`,
    user: { id: `${template.id}-user`, firstName: template.firstName, lastName: template.lastName },
    gender: template.firstName.endsWith('a') ? 'FEMALE' : 'MALE',
    city,
    country: 'Pakistan',
    title: 'Dr.',
    yearsOfExperience: template.yearsOfExperience,
    consultationFee: template.consultationFee,
    currency: 'PKR',
    profileImageUrl: `https://i.pravatar.cc/160?u=${template.avatarSeed}`,
    about: template.about,
    qualifications: template.qualifications.map((degree, i) => ({
      degree,
      institution: i === 0 ? 'King Edward Medical University' : 'College of Physicians & Surgeons',
      year: 2005 + i * 2,
    })),
    specialtyIds: [template.specialtySlugs[0]],
    specialties: [{ id: template.specialtySlugs[0], name: specialtyName, slug: template.specialtySlugs[0], isActive: true }],
    languageIds: ['ur', 'en'],
    languages: [
      { id: 'ur', name: 'Urdu', code: 'ur', isActive: true },
      { id: 'en', name: 'English', code: 'en', isActive: true },
    ],
    clinics: [{ id: `${template.id}-clinic`, name: template.clinic, city }],
    availableDays: [1, 2, 3, 4, 5],
  };
}

export interface DummyDoctorSearchParams {
  specialtySlug: string;
  city: string;
  name?: string;
  maxFee?: string;
  page?: number;
  limit?: number;
}

export function searchDummyDoctors(params: DummyDoctorSearchParams): {
  doctors: DoctorSearchResult[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
} {
  const slug = params.specialtySlug.toLowerCase();
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  let filtered = DUMMY_TEMPLATES.filter((t) =>
    t.specialtySlugs.some((s) => s === slug || slug.includes(s) || s.includes(slug)),
  );

  // Fallback: show general practitioners for unknown specialties
  if (filtered.length === 0) {
    filtered = DUMMY_TEMPLATES.filter((t) =>
      t.specialtySlugs.some((s) => ['general-practitioner', 'general-medicine'].includes(s)),
    );
  }

  const nameQuery = params.name?.trim().toLowerCase();
  if (nameQuery) {
    filtered = filtered.filter(
      (t) =>
        t.firstName.toLowerCase().includes(nameQuery) ||
        t.lastName.toLowerCase().includes(nameQuery) ||
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(nameQuery),
    );
  }

  const maxFee = params.maxFee ? parseFloat(params.maxFee) : undefined;
  if (maxFee) {
    filtered = filtered.filter((t) => t.consultationFee <= maxFee);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const pageItems = filtered.slice(start, start + limit);

  return {
    doctors: pageItems.map((t) => toDoctorResult(t, params.city)),
    pagination: { page, limit, total, totalPages },
  };
}

/** Always returns demo doctors for the public listing page */
export function getDemoDoctorsForListing(params: DummyDoctorSearchParams): {
  doctors: DoctorSearchResult[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
} {
  return searchDummyDoctors(params);
}

export function getDummyDoctorsByIds(ids: string[], city: string, hospitalName?: string): DoctorSearchResult[] {
  return DUMMY_TEMPLATES.filter((t) => ids.includes(t.id)).map((t) => {
    const doctor = toDoctorResult(t, city);
    if (hospitalName) {
      doctor.clinics = [{ id: `${t.id}-clinic`, name: hospitalName, city }];
    }
    return doctor;
  });
}

const REVIEW_HEADLINES = [
  'I am satisfied with the doctor.',
  'Excellent consultation and care.',
  'Very professional and helpful.',
  'Highly recommend this doctor.',
  'Great experience overall.',
];

const REVIEW_BODIES = [
  'The doctor was very attentive and listened to all my concerns. The consultation was thorough and I felt well taken care of throughout the visit.',
  'I had been struggling with my condition for months. After consulting with the doctor, I finally got a clear diagnosis and treatment plan that worked.',
  'Staff was courteous and the clinic environment was clean and comfortable. The doctor explained everything in detail and answered all my questions.',
  'Quick appointment confirmation and minimal wait time. The doctor was knowledgeable and provided practical advice that helped me recover faster.',
  'One of the best medical experiences I have had. Professional, caring, and genuinely interested in patient wellbeing.',
];

const REVIEW_TAGS = [
  ['No Waiting Time', 'Great Experience', 'Good PA/ Staff'],
  ['Good Clinic', '1 hour meetup', 'Great Experience'],
  ['Good PA/ Staff', 'No Waiting Time'],
  ['Great Experience', 'Good Clinic'],
  ['Good PA/ Staff', 'Good Clinic', 'Great Experience'],
];

const REVIEW_NAMES = [
  'Ahmed K.',
  'Fatima S.',
  'Usman R.',
  'Sara M.',
  'Ali H.',
  'Zainab A.',
  'Bilal T.',
  'Maryam N.',
];

function hashSeed(id: string): number {
  return [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function buildReviews(doctorId: string, count: number): DoctorReview[] {
  const seed = hashSeed(doctorId);
  const reviewCount = Math.min(count, 8);
  const reviews: DoctorReview[] = [];

  for (let i = 0; i < reviewCount; i++) {
    const name = REVIEW_NAMES[(seed + i) % REVIEW_NAMES.length];
    const initials = name
      .split(' ')
      .map((p) => p.charAt(0))
      .join('');
    const day = ((seed + i * 7) % 28) + 1;
    const month = ((seed + i * 3) % 12) + 1;

    reviews.push({
      id: `${doctorId}-review-${i}`,
      patientInitials: initials,
      patientName: name,
      date: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/2024`,
      headline: REVIEW_HEADLINES[(seed + i) % REVIEW_HEADLINES.length],
      body: REVIEW_BODIES[(seed + i) % REVIEW_BODIES.length],
      tags: REVIEW_TAGS[(seed + i) % REVIEW_TAGS.length],
    });
  }

  return reviews;
}

function buildConsultationOptions(template: DummyDoctorTemplate, city: string): DoctorConsultationOption[] {
  const options: DoctorConsultationOption[] = [
    {
      id: `${template.id}-video`,
      type: 'video',
      name: 'Video Consultation',
      fee: template.consultationFee,
      currency: 'PKR',
      hours: '04:30 PM - 09:30 PM',
      status: 'Online',
    },
  ];

  options.push({
    id: `${template.id}-clinic`,
    type: 'clinic',
    name: template.clinic,
    location: city,
    fee: template.consultationFee,
    currency: 'PKR',
    hours: '04:30 PM - 09:30 PM',
    status: 'In Clinic',
  });

  return options;
}

const DEFAULT_TIME_SLOTS = ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

export function getDummyDoctorById(id: string, city = 'Lahore'): DoctorDetailProfile | null {
  const template = DUMMY_TEMPLATES.find((t) => t.id === id);
  if (!template) return null;

  const base = toDoctorResult(template, city);
  const seed = hashSeed(id);
  const reviewCount = (seed * 137 + (template.yearsOfExperience ?? 5) * 41) % 4000 + 120;
  const avgRating = 4.5 + (seed % 6) / 10;

  return {
    ...base,
    role: 'Consultant',
    averageRating: Math.min(5, Math.round(avgRating * 10) / 10),
    reviewCount,
    waitTimeMins: 5 + (seed % 15),
    avgTimeToPatientMins: 20 + (seed % 20),
    ratingBreakdown: {
      patientSatisfaction: Math.min(5, 4.5 + (seed % 5) / 10),
      diagnosis: Math.min(5, 4.4 + (seed % 6) / 10),
      staffBehaviour: Math.min(5, 4.7 + (seed % 4) / 10),
      clinicEnvironment: Math.min(5, 4.8 + (seed % 3) / 10),
    },
    reviews: buildReviews(id, reviewCount),
    consultationOptions: buildConsultationOptions(template, city),
    timeSlots: DEFAULT_TIME_SLOTS,
  };
}

export function findDummyDoctorTemplate(id: string): DummyDoctorTemplate | undefined {
  return DUMMY_TEMPLATES.find((t) => t.id === id);
}
