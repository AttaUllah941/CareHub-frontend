export interface LabCityOption {
  name: string;
  slug: string;
}

export interface LabTimings {
  weekdays: string;
  saturday?: string;
  sunday?: string;
}

export interface LabTest {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sampleType: string;
  turnaroundTime: string;
  preparation?: string;
}

export interface PublicLab {
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
  isHomeCollection: boolean;
  timings: LabTimings;
  testIds: string[];
  tests?: LabTest[];
  testCount?: number;
}

export const LAB_CITIES: LabCityOption[] = [
  { name: 'Lahore', slug: 'lahore' },
  { name: 'Karachi', slug: 'karachi' },
  { name: 'Islamabad', slug: 'islamabad' },
];

const LAB_TESTS: LabTest[] = [
  {
    id: 'test-cbc',
    slug: 'complete-blood-count',
    name: 'Complete Blood Count (CBC)',
    description: 'Measures red blood cells, white blood cells, hemoglobin, and platelets to assess overall health and detect infections or anemia.',
    category: 'Hematology',
    price: 1200,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'No fasting required',
  },
  {
    id: 'test-lft',
    slug: 'liver-function-test',
    name: 'Liver Function Test (LFT)',
    description: 'Evaluates liver health by measuring enzymes, proteins, and bilirubin levels in the blood.',
    category: 'Biochemistry',
    price: 2500,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'Fasting 8–12 hours recommended',
  },
  {
    id: 'test-rft',
    slug: 'renal-function-test',
    name: 'Renal Function Test (RFT)',
    description: 'Checks kidney function through creatinine, urea, and electrolyte levels.',
    category: 'Biochemistry',
    price: 2200,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'No special preparation',
  },
  {
    id: 'test-hba1c',
    slug: 'hba1c',
    name: 'HbA1c (Glycated Hemoglobin)',
    description: 'Measures average blood sugar over the past 2–3 months; essential for diabetes monitoring.',
    category: 'Diabetes',
    price: 1800,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'No fasting required',
  },
  {
    id: 'test-lipid',
    slug: 'lipid-profile',
    name: 'Lipid Profile',
    description: 'Assesses cholesterol and triglyceride levels to evaluate cardiovascular risk.',
    category: 'Cardiology',
    price: 2800,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'Fasting 10–12 hours required',
  },
  {
    id: 'test-thyroid',
    slug: 'thyroid-profile',
    name: 'Thyroid Profile (T3, T4, TSH)',
    description: 'Screens thyroid gland function and helps diagnose hyperthyroidism or hypothyroidism.',
    category: 'Endocrinology',
    price: 3500,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'No fasting required',
  },
  {
    id: 'test-vitd',
    slug: 'vitamin-d',
    name: 'Vitamin D (25-OH)',
    description: 'Measures vitamin D levels to detect deficiency linked to bone health and immunity.',
    category: 'Vitamins',
    price: 3200,
    sampleType: 'Blood',
    turnaroundTime: '48 hours',
    preparation: 'No special preparation',
  },
  {
    id: 'test-urine',
    slug: 'urine-routine-examination',
    name: 'Urine Routine Examination',
    description: 'Detects urinary tract infections, kidney problems, and metabolic disorders through urine analysis.',
    category: 'Urology',
    price: 800,
    sampleType: 'Urine',
    turnaroundTime: 'Same day',
    preparation: 'Mid-stream clean-catch sample',
  },
  {
    id: 'test-hbsag',
    slug: 'hbsag',
    name: 'HBsAg (Hepatitis B Surface Antigen)',
    description: 'Screens for active hepatitis B infection.',
    category: 'Serology',
    price: 1500,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'No fasting required',
  },
  {
    id: 'test-pcr',
    slug: 'covid-pcr',
    name: 'COVID-19 PCR Test',
    description: 'Molecular test to detect active SARS-CoV-2 infection with high accuracy.',
    category: 'Infectious Disease',
    price: 4500,
    sampleType: 'Nasal swab',
    turnaroundTime: '12–24 hours',
    preparation: 'No eating or drinking 30 min before swab',
  },
  {
    id: 'test-mri-brain',
    slug: 'mri-brain',
    name: 'MRI Brain (Plain)',
    description: 'Non-invasive imaging to evaluate brain structure, tumors, strokes, and neurological conditions.',
    category: 'Radiology',
    price: 18000,
    sampleType: 'Imaging',
    turnaroundTime: '24–48 hours',
    preparation: 'Remove metal objects; inform about implants',
  },
  {
    id: 'test-xray-chest',
    slug: 'chest-xray',
    name: 'Chest X-Ray (PA View)',
    description: 'Imaging of lungs, heart, and chest wall to detect infections, fluid, or structural abnormalities.',
    category: 'Radiology',
    price: 2500,
    sampleType: 'Imaging',
    turnaroundTime: 'Same day',
    preparation: 'Remove jewelry from chest area',
  },
  {
    id: 'test-b12',
    slug: 'vitamin-b12',
    name: 'Vitamin B12',
    description: 'Measures B12 levels to diagnose deficiency causing anemia, fatigue, or neurological symptoms.',
    category: 'Vitamins',
    price: 2800,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'No fasting required',
  },
  {
    id: 'test-ferritin',
    slug: 'ferritin',
    name: 'Ferritin',
    description: 'Assesses iron stores in the body and helps diagnose iron deficiency or overload.',
    category: 'Hematology',
    price: 2200,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'No fasting required',
  },
  {
    id: 'test-psa',
    slug: 'psa',
    name: 'PSA (Prostate Specific Antigen)',
    description: 'Screens for prostate conditions including enlargement, inflammation, and cancer.',
    category: 'Urology',
    price: 2400,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'Avoid ejaculation 48 hours before test',
  },
  {
    id: 'test-bhcg',
    slug: 'beta-hcg',
    name: 'Beta HCG (Pregnancy Test)',
    description: 'Detects pregnancy hormone levels in blood for early and accurate confirmation.',
    category: 'Gynecology',
    price: 1500,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'No special preparation',
  },
  {
    id: 'test-pt-inr',
    slug: 'pt-inr',
    name: 'PT/INR (Prothrombin Time)',
    description: 'Monitors blood clotting function, especially for patients on anticoagulant therapy.',
    category: 'Hematology',
    price: 1600,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'Inform lab about blood thinners',
  },
  {
    id: 'test-crp',
    slug: 'c-reactive-protein',
    name: 'C-Reactive Protein (CRP)',
    description: 'Marker of inflammation used to detect infections and monitor inflammatory conditions.',
    category: 'Biochemistry',
    price: 1800,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'No fasting required',
  },
  {
    id: 'test-esr',
    slug: 'esr',
    name: 'ESR (Erythrocyte Sedimentation Rate)',
    description: 'Non-specific test for inflammation, useful in diagnosing autoimmune and infectious diseases.',
    category: 'Hematology',
    price: 900,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'No fasting required',
  },
  {
    id: 'test-hcv',
    slug: 'hcv-antibody',
    name: 'HCV Antibody (Hepatitis C)',
    description: 'Screens for hepatitis C virus exposure and chronic infection.',
    category: 'Serology',
    price: 2200,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'No fasting required',
  },
  {
    id: 'test-hiv',
    slug: 'hiv-screening',
    name: 'HIV 1 & 2 Antibody Screening',
    description: 'Confidential screening for HIV infection with high sensitivity.',
    category: 'Serology',
    price: 2500,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'No fasting required',
  },
  {
    id: 'test-dengue',
    slug: 'dengue-ns1',
    name: 'Dengue NS1 Antigen',
    description: 'Early detection of dengue fever during the acute phase of infection.',
    category: 'Infectious Disease',
    price: 3500,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'No special preparation',
  },
  {
    id: 'test-malaria',
    slug: 'malaria-antigen',
    name: 'Malaria Antigen (Rapid)',
    description: 'Rapid detection of malaria parasites in blood for timely treatment.',
    category: 'Infectious Disease',
    price: 2000,
    sampleType: 'Blood',
    turnaroundTime: 'Same day',
    preparation: 'No special preparation',
  },
  {
    id: 'test-stool',
    slug: 'stool-routine',
    name: 'Stool Routine Examination',
    description: 'Analyzes stool for parasites, blood, infection, and digestive disorders.',
    category: 'Gastroenterology',
    price: 1000,
    sampleType: 'Stool',
    turnaroundTime: '24 hours',
    preparation: 'Fresh sample in sterile container',
  },
  {
    id: 'test-ecg',
    slug: 'ecg',
    name: 'ECG (Electrocardiogram)',
    description: 'Records electrical activity of the heart to detect arrhythmias and cardiac conditions.',
    category: 'Cardiology',
    price: 2000,
    sampleType: 'Procedure',
    turnaroundTime: 'Same day',
    preparation: 'Avoid lotions on chest area',
  },
  {
    id: 'test-ultrasound-abd',
    slug: 'ultrasound-abdomen',
    name: 'Ultrasound Abdomen',
    description: 'Imaging of liver, gallbladder, kidneys, spleen, and pancreas for structural abnormalities.',
    category: 'Radiology',
    price: 4500,
    sampleType: 'Imaging',
    turnaroundTime: 'Same day',
    preparation: 'Fasting 6–8 hours required',
  },
  {
    id: 'test-ggt',
    slug: 'ggt',
    name: 'GGT (Gamma Glutamyl Transferase)',
    description: 'Liver enzyme test used to evaluate bile duct disease and alcohol-related liver damage.',
    category: 'Biochemistry',
    price: 1400,
    sampleType: 'Blood',
    turnaroundTime: '24 hours',
    preparation: 'Fasting 8 hours recommended',
  },
  {
    id: 'test-cea',
    slug: 'cea-tumor-marker',
    name: 'CEA (Carcinoembryonic Antigen)',
    description: 'Tumor marker used to monitor certain cancers, especially colorectal cancer.',
    category: 'Oncology',
    price: 3800,
    sampleType: 'Blood',
    turnaroundTime: '48 hours',
    preparation: 'No fasting required',
  },
  {
    id: 'test-afp',
    slug: 'afp-tumor-marker',
    name: 'AFP (Alpha Fetoprotein)',
    description: 'Tumor marker for liver cancer and certain germ cell tumors; also used in pregnancy screening.',
    category: 'Oncology',
    price: 3600,
    sampleType: 'Blood',
    turnaroundTime: '48 hours',
    preparation: 'No fasting required',
  },
];

const ALL_LAB_TEST_IDS = LAB_TESTS.map((test) => test.id);

const DUMMY_LABS: Omit<PublicLab, 'tests' | 'testCount'>[] = [
  {
    id: 'lab-lhr-chughtai',
    slug: 'chughtai-lab',
    name: 'Chughtai Lab',
    description: 'Pakistan\'s largest diagnostic network with NABL-accredited labs, home sample collection, and online reports.',
    phone: '03-111-456-456',
    email: 'info@chughtailab.com',
    address: '7 Jail Road, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop',
    rating: 4.8,
    isHomeCollection: true,
    timings: { weekdays: '7:00 AM – 10:00 PM', saturday: '7:00 AM – 10:00 PM', sunday: '8:00 AM – 8:00 PM' },
    testIds: ALL_LAB_TEST_IDS,
  },
  {
    id: 'lab-lhr-ideals',
    slug: 'ideals-diagnostic',
    name: 'IDEALS Diagnostic Centre',
    description: 'Trusted Lahore lab offering pathology, radiology, and specialized diagnostic services with fast turnaround.',
    phone: '042-35761234',
    email: 'contact@idealslab.pk',
    address: 'Gulberg III, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop',
    rating: 4.6,
    isHomeCollection: true,
    timings: { weekdays: '8:00 AM – 9:00 PM', saturday: '8:00 AM – 6:00 PM', sunday: 'Closed' },
    testIds: [
      'test-cbc', 'test-lft', 'test-rft', 'test-lipid', 'test-urine', 'test-xray-chest',
      'test-hba1c', 'test-thyroid', 'test-vitd', 'test-hbsag', 'test-crp', 'test-esr',
      'test-b12', 'test-ferritin', 'test-stool', 'test-ecg', 'test-ggt', 'test-dengue',
    ],
  },
  {
    id: 'lab-lhr-shaukat',
    slug: 'shaukat-khanum-lab',
    name: 'Shaukat Khanum Laboratory',
    description: 'Hospital-affiliated lab with advanced oncology diagnostics and comprehensive test panels.',
    phone: '042-35905000',
    email: 'lab@skm.org.pk',
    address: '7-A Block R-3, Johar Town, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1580281653706-8b283f070c05?w=800&auto=format&fit=crop',
    rating: 4.9,
    isHomeCollection: false,
    timings: { weekdays: '24 hours', saturday: '24 hours', sunday: '24 hours' },
    testIds: ALL_LAB_TEST_IDS,
  },
  {
    id: 'lab-lhr-testzone',
    slug: 'test-zone-lab',
    name: 'Test Zone Laboratory',
    description: 'Affordable diagnostic services with same-day reporting for routine blood and urine tests.',
    phone: '042-37123456',
    email: 'info@testzone.pk',
    address: 'DHA Phase 5, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15a5089a2?w=800&auto=format&fit=crop',
    rating: 4.4,
    isHomeCollection: true,
    timings: { weekdays: '7:30 AM – 9:30 PM', saturday: '8:00 AM – 5:00 PM' },
    testIds: [
      'test-cbc', 'test-hba1c', 'test-urine', 'test-hbsag', 'test-pcr', 'test-dengue',
      'test-malaria', 'test-crp', 'test-esr', 'test-lft', 'test-rft', 'test-bhcg',
    ],
  },
  {
    id: 'lab-khi-aga',
    slug: 'aga-khan-lab',
    name: 'Aga Khan University Hospital Laboratory',
    description: 'Internationally accredited lab with cutting-edge diagnostics and specialized test panels.',
    phone: '021-34930000',
    email: 'lab@aku.edu',
    address: 'Stadium Road, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-0f4085a5e137?w=800&auto=format&fit=crop',
    rating: 4.9,
    isHomeCollection: true,
    timings: { weekdays: '24 hours', saturday: '24 hours', sunday: '24 hours' },
    testIds: ALL_LAB_TEST_IDS,
  },
  {
    id: 'lab-khi-dr-essen',
    slug: 'dr-essen-lab',
    name: 'Dr. Essen Laboratory',
    description: 'Popular Karachi lab chain known for reliable reports, home collection, and competitive pricing.',
    phone: '021-111-337-337',
    email: 'info@dressen.com.pk',
    address: 'Clifton Block 2, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop',
    rating: 4.7,
    isHomeCollection: true,
    timings: { weekdays: '7:00 AM – 10:00 PM', saturday: '7:00 AM – 10:00 PM', sunday: '8:00 AM – 6:00 PM' },
    testIds: [
      'test-cbc', 'test-lft', 'test-rft', 'test-hba1c', 'test-lipid', 'test-urine',
      'test-hbsag', 'test-pcr', 'test-hcv', 'test-hiv', 'test-dengue', 'test-malaria',
      'test-thyroid', 'test-vitd', 'test-crp', 'test-b12', 'test-ferritin', 'test-ecg',
    ],
  },
  {
    id: 'lab-khi-south',
    slug: 'south-city-diagnostics',
    name: 'South City Diagnostics',
    description: 'Full-service diagnostic center in Clifton with pathology and imaging under one roof.',
    phone: '021-35862301',
    email: 'lab@southcityhospital.com',
    address: 'Clifton Block 3, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop',
    rating: 4.5,
    isHomeCollection: false,
    timings: { weekdays: '8:00 AM – 8:00 PM', saturday: '8:00 AM – 4:00 PM', sunday: 'Closed' },
    testIds: [
      'test-cbc', 'test-lft', 'test-thyroid', 'test-xray-chest', 'test-urine',
      'test-lipid', 'test-hba1c', 'test-vitd', 'test-ecg', 'test-ultrasound-abd',
    ],
  },
  {
    id: 'lab-khi-metropolis',
    slug: 'metropolis-healthcare',
    name: 'Metropolis Healthcare',
    description: 'National diagnostic chain offering specialized tests and health checkup packages.',
    phone: '021-111-000-637',
    email: 'karachi@metropolisindia.com',
    address: 'PECHS Block 6, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1580281653706-8b283f070c05?w=800&auto=format&fit=crop',
    rating: 4.6,
    isHomeCollection: true,
    timings: { weekdays: '7:00 AM – 9:00 PM', saturday: '7:00 AM – 6:00 PM' },
    testIds: ALL_LAB_TEST_IDS,
  },
  {
    id: 'lab-isl-shifa',
    slug: 'shifa-international-lab',
    name: 'Shifa International Laboratory',
    description: 'Hospital-grade laboratory with advanced molecular diagnostics and radiology services.',
    phone: '051-8463666',
    email: 'lab@shifa.com.pk',
    address: 'Pitras Bukhari Road, H-8/4, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
    rating: 4.8,
    isHomeCollection: true,
    timings: { weekdays: '24 hours', saturday: '24 hours', sunday: '24 hours' },
    testIds: ALL_LAB_TEST_IDS,
  },
  {
    id: 'lab-isl-maroof',
    slug: 'maroof-diagnostics',
    name: 'Maroof International Diagnostics',
    description: 'Modern diagnostic facility in F-10 with home collection and online report access.',
    phone: '051-111627663',
    email: 'diagnostics@maroofhospital.com',
    address: 'F-10 Markaz, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd818fdf05?w=800&auto=format&fit=crop',
    rating: 4.5,
    isHomeCollection: true,
    timings: { weekdays: '8:00 AM – 9:00 PM', saturday: '8:00 AM – 5:00 PM', sunday: 'Closed' },
    testIds: [
      'test-cbc', 'test-lft', 'test-rft', 'test-urine', 'test-hbsag', 'test-xray-chest',
      'test-lipid', 'test-thyroid', 'test-hba1c', 'test-vitd', 'test-crp', 'test-ecg',
    ],
  },
  {
    id: 'lab-isl-pims',
    slug: 'pims-laboratory',
    name: 'PIMS Laboratory',
    description: 'Federal hospital laboratory serving Islamabad with affordable routine and specialized tests.',
    phone: '051-9261170',
    email: 'lab@pims.gov.pk',
    address: 'G-8/3, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15a5089a2?w=800&auto=format&fit=crop',
    rating: 4.3,
    isHomeCollection: false,
    timings: { weekdays: '8:00 AM – 4:00 PM', saturday: '8:00 AM – 1:00 PM', sunday: 'Closed' },
    testIds: [
      'test-cbc', 'test-lft', 'test-rft', 'test-hba1c', 'test-urine', 'test-crp',
      'test-esr', 'test-hbsag', 'test-dengue', 'test-malaria',
    ],
  },
  {
    id: 'lab-isl-islamabad-lab',
    slug: 'islamabad-diagnostic-centre',
    name: 'Islamabad Diagnostic Centre',
    description: 'Community-focused lab with walk-in services and health screening packages.',
    phone: '051-2288888',
    email: 'info@idclab.pk',
    address: 'Blue Area, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1586773866498-ae9052b6dd04?w=800&auto=format&fit=crop',
    rating: 4.4,
    isHomeCollection: true,
    timings: { weekdays: '7:00 AM – 9:00 PM', saturday: '7:00 AM – 6:00 PM' },
    testIds: [
      'test-cbc', 'test-lipid', 'test-thyroid', 'test-vitd', 'test-pcr', 'test-lft',
      'test-rft', 'test-hba1c', 'test-urine', 'test-hbsag', 'test-crp', 'test-b12',
    ],
  },
];

function getTestsByIds(testIds: string[]): LabTest[] {
  return testIds
    .map((id) => LAB_TESTS.find((t) => t.id === id))
    .filter((t): t is LabTest => t !== undefined);
}

function enrichLab(lab: Omit<PublicLab, 'tests' | 'testCount'>): PublicLab {
  const tests = getTestsByIds(lab.testIds);
  return {
    ...lab,
    tests,
    testCount: tests.length,
  };
}

export function getLabsByCitySlug(citySlug: string): PublicLab[] {
  return DUMMY_LABS.filter((l) => l.citySlug === citySlug.toLowerCase()).map(enrichLab);
}

export function getLabBySlug(citySlug: string, labSlug: string): PublicLab | undefined {
  const lab = DUMMY_LABS.find(
    (l) => l.citySlug === citySlug.toLowerCase() && l.slug === labSlug.toLowerCase(),
  );
  return lab ? enrichLab(lab) : undefined;
}

export function getLabCityName(citySlug: string): string {
  return LAB_CITIES.find((c) => c.slug === citySlug)?.name ?? citySlug;
}

export function formatLabPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}
