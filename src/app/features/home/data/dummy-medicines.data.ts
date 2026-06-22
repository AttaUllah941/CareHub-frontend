export interface MedicineCityOption {
  name: string;
  slug: string;
}

export type MedicineStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface PharmacyMedicine {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  dosage: string;
  price: number;
  stockStatus: MedicineStockStatus;
  stockQuantity: number;
  requiresPrescription: boolean;
}

export interface PublicPharmacy {
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
  isHomeDelivery: boolean;
  deliveryFee?: number;
  deliveryTime?: string;
  timings: string;
  medicineIds: string[];
  medicines?: PharmacyMedicine[];
  medicineCount?: number;
}

export const MEDICINE_CITIES: MedicineCityOption[] = [
  { name: 'Lahore', slug: 'lahore' },
  { name: 'Karachi', slug: 'karachi' },
  { name: 'Islamabad', slug: 'islamabad' },
  { name: 'Peshawar', slug: 'peshawar' },
  { name: 'Quetta', slug: 'quetta' },
];

const PHARMACY_MEDICINES: PharmacyMedicine[] = [
  {
    id: 'med-panadol',
    slug: 'panadol-extra',
    name: 'Panadol Extra',
    description: 'Paracetamol 500mg with caffeine for effective relief from headache, fever, and body aches.',
    category: 'Pain Relief',
    manufacturer: 'GSK',
    dosage: '2 tablets every 6 hours',
    price: 280,
    stockStatus: 'in_stock',
    stockQuantity: 120,
    requiresPrescription: false,
  },
  {
    id: 'med-brufen',
    slug: 'brufen-400',
    name: 'Brufen 400mg',
    description: 'Ibuprofen tablets for inflammation, pain, and fever reduction.',
    category: 'Pain Relief',
    manufacturer: 'Abbott',
    dosage: '1 tablet every 8 hours after food',
    price: 195,
    stockStatus: 'in_stock',
    stockQuantity: 85,
    requiresPrescription: false,
  },
  {
    id: 'med-augmentin',
    slug: 'augmentin-625',
    name: 'Augmentin 625mg',
    description: 'Amoxicillin and clavulanic acid antibiotic for bacterial infections.',
    category: 'Antibiotics',
    manufacturer: 'GSK',
    dosage: '1 tablet twice daily',
    price: 650,
    stockStatus: 'in_stock',
    stockQuantity: 45,
    requiresPrescription: true,
  },
  {
    id: 'med-amoxil',
    slug: 'amoxil-500',
    name: 'Amoxil 500mg',
    description: 'Broad-spectrum penicillin antibiotic for respiratory and urinary infections.',
    category: 'Antibiotics',
    manufacturer: 'GSK',
    dosage: '1 capsule three times daily',
    price: 420,
    stockStatus: 'low_stock',
    stockQuantity: 12,
    requiresPrescription: true,
  },
  {
    id: 'med-omeprazole',
    slug: 'risek-20',
    name: 'Risek 20mg (Omeprazole)',
    description: 'Proton pump inhibitor for acid reflux, heartburn, and stomach ulcers.',
    category: 'Gastrointestinal',
    manufacturer: 'Getz Pharma',
    dosage: '1 capsule daily before breakfast',
    price: 380,
    stockStatus: 'in_stock',
    stockQuantity: 60,
    requiresPrescription: false,
  },
  {
    id: 'med-metformin',
    slug: 'glucophage-500',
    name: 'Glucophage 500mg',
    description: 'Metformin for type 2 diabetes management and blood sugar control.',
    category: 'Diabetes',
    manufacturer: 'Merck',
    dosage: '1 tablet twice daily with meals',
    price: 290,
    stockStatus: 'in_stock',
    stockQuantity: 70,
    requiresPrescription: true,
  },
  {
    id: 'med-insulin',
    slug: 'insulin-novorapid',
    name: 'NovoRapid Insulin',
    description: 'Rapid-acting insulin for mealtime blood glucose control in diabetic patients.',
    category: 'Diabetes',
    manufacturer: 'Novo Nordisk',
    dosage: 'As directed by physician',
    price: 3200,
    stockStatus: 'low_stock',
    stockQuantity: 8,
    requiresPrescription: true,
  },
  {
    id: 'med-cetirizine',
    slug: 'zyrtec-10',
    name: 'Zyrtec 10mg (Cetirizine)',
    description: 'Antihistamine for allergy relief, hay fever, and skin itching.',
    category: 'Allergy',
    manufacturer: 'UCB Pharma',
    dosage: '1 tablet daily',
    price: 350,
    stockStatus: 'in_stock',
    stockQuantity: 95,
    requiresPrescription: false,
  },
  {
    id: 'med-ventolin',
    slug: 'ventolin-inhaler',
    name: 'Ventolin Inhaler',
    description: 'Salbutamol inhaler for quick relief of asthma and breathing difficulty.',
    category: 'Respiratory',
    manufacturer: 'GSK',
    dosage: '2 puffs as needed',
    price: 890,
    stockStatus: 'in_stock',
    stockQuantity: 35,
    requiresPrescription: true,
  },
  {
    id: 'med-amlodipine',
    slug: 'norvasc-5',
    name: 'Norvasc 5mg (Amlodipine)',
    description: 'Calcium channel blocker for hypertension and angina management.',
    category: 'Cardiology',
    manufacturer: 'Pfizer',
    dosage: '1 tablet daily',
    price: 520,
    stockStatus: 'in_stock',
    stockQuantity: 55,
    requiresPrescription: true,
  },
  {
    id: 'med-atorvastatin',
    slug: 'lipitor-20',
    name: 'Lipitor 20mg (Atorvastatin)',
    description: 'Statin medication to lower cholesterol and reduce cardiovascular risk.',
    category: 'Cardiology',
    manufacturer: 'Pfizer',
    dosage: '1 tablet at bedtime',
    price: 780,
    stockStatus: 'in_stock',
    stockQuantity: 40,
    requiresPrescription: true,
  },
  {
    id: 'med-multivitamin',
    slug: 'centrum-adults',
    name: 'Centrum Adults Multivitamin',
    description: 'Daily multivitamin supplement supporting immunity, energy, and overall wellness.',
    category: 'Vitamins',
    manufacturer: 'Haleon',
    dosage: '1 tablet daily',
    price: 1450,
    stockStatus: 'in_stock',
    stockQuantity: 30,
    requiresPrescription: false,
  },
  {
    id: 'med-vitamin-d',
    slug: 'vitamin-d3-5000',
    name: 'Vitamin D3 5000 IU',
    description: 'High-potency vitamin D supplement for bone health and immunity support.',
    category: 'Vitamins',
    manufacturer: 'Nutrifactor',
    dosage: '1 capsule daily',
    price: 980,
    stockStatus: 'in_stock',
    stockQuantity: 50,
    requiresPrescription: false,
  },
  {
    id: 'med-ors',
    slug: 'ors-sachet',
    name: 'ORS Sachet (Oral Rehydration)',
    description: 'Oral rehydration salts for dehydration due to diarrhea and heat exhaustion.',
    category: 'General',
    manufacturer: 'Getz Pharma',
    dosage: '1 sachet in 1 litre water',
    price: 45,
    stockStatus: 'in_stock',
    stockQuantity: 200,
    requiresPrescription: false,
  },
  {
    id: 'med-cough-syrup',
    slug: 'corex-dx',
    name: 'Corex-DX Cough Syrup',
    description: 'Cough suppressant syrup for dry cough and throat irritation relief.',
    category: 'Respiratory',
    manufacturer: 'Pfizer',
    dosage: '1 teaspoon three times daily',
    price: 185,
    stockStatus: 'in_stock',
    stockQuantity: 65,
    requiresPrescription: false,
  },
  {
    id: 'med-eye-drops',
    slug: 'refresh-tears',
    name: 'Refresh Tears Eye Drops',
    description: 'Lubricating eye drops for dry eye relief and computer strain.',
    category: 'Ophthalmology',
    manufacturer: 'Allergan',
    dosage: '1–2 drops as needed',
    price: 720,
    stockStatus: 'in_stock',
    stockQuantity: 28,
    requiresPrescription: false,
  },
  {
    id: 'med-iron',
    slug: 'folic-iron',
    name: 'Folic Acid + Iron Tablets',
    description: 'Supplement for iron deficiency anemia, especially during pregnancy.',
    category: 'Vitamins',
    manufacturer: 'Searle',
    dosage: '1 tablet daily',
    price: 165,
    stockStatus: 'in_stock',
    stockQuantity: 75,
    requiresPrescription: false,
  },
  {
    id: 'med-antacid',
    slug: 'gaviscon-liquid',
    name: 'Gaviscon Liquid',
    description: 'Antacid suspension providing fast relief from heartburn and indigestion.',
    category: 'Gastrointestinal',
    manufacturer: 'Reckitt',
    dosage: '10–20ml after meals',
    price: 420,
    stockStatus: 'in_stock',
    stockQuantity: 42,
    requiresPrescription: false,
  },
  {
    id: 'med-azithromycin',
    slug: 'zithromax-500',
    name: 'Zithromax 500mg (Azithromycin)',
    description: 'Macrolide antibiotic for respiratory tract and skin infections.',
    category: 'Antibiotics',
    manufacturer: 'Pfizer',
    dosage: '1 tablet daily for 3 days',
    price: 1100,
    stockStatus: 'out_of_stock',
    stockQuantity: 0,
    requiresPrescription: true,
  },
  {
    id: 'med-thyroid',
    slug: 'eltroxin-50',
    name: 'Eltroxin 50mcg',
    description: 'Levothyroxine for hypothyroidism and thyroid hormone replacement therapy.',
    category: 'Endocrinology',
    manufacturer: 'GSK',
    dosage: '1 tablet on empty stomach',
    price: 340,
    stockStatus: 'in_stock',
    stockQuantity: 48,
    requiresPrescription: true,
  },
  {
    id: 'med-pain-gel',
    slug: 'voltaren-gel',
    name: 'Voltaren Emulgel',
    description: 'Topical diclofenac gel for joint pain, muscle aches, and inflammation.',
    category: 'Pain Relief',
    manufacturer: 'Novartis',
    dosage: 'Apply 3–4 times daily',
    price: 560,
    stockStatus: 'in_stock',
    stockQuantity: 22,
    requiresPrescription: false,
  },
];

export const ALL_MEDICINE_IDS = PHARMACY_MEDICINES.map((m) => m.id);

const DUMMY_PHARMACIES: Omit<PublicPharmacy, 'medicines' | 'medicineCount'>[] = [
  {
    id: 'pharm-lhr-dwatson',
    slug: 'd-watson-pharmacy',
    name: 'D.Watson Pharmacy',
    description: 'Trusted Lahore pharmacy chain with genuine medicines, health supplements, and same-day home delivery.',
    phone: '042-35711234',
    email: 'lahore@dwatson.pk',
    address: 'Main Boulevard, Gulberg III, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop',
    rating: 4.7,
    isHomeDelivery: true,
    deliveryFee: 150,
    deliveryTime: '45–90 minutes',
    timings: '9:00 AM – 11:00 PM',
    medicineIds: ALL_MEDICINE_IDS,
  },
  {
    id: 'pharm-lhr-clinix',
    slug: 'clinix-pharmacy',
    name: 'Clinix Pharmacy',
    description: '24-hour pharmacy near Services Hospital offering prescription and OTC medicines with delivery.',
    phone: '042-99203450',
    email: 'info@clinixpharmacy.pk',
    address: 'Jail Road, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-c75d40004b24?w=800&auto=format&fit=crop',
    rating: 4.5,
    isHomeDelivery: true,
    deliveryFee: 100,
    deliveryTime: '30–60 minutes',
    timings: '24 hours',
    medicineIds: ['med-panadol', 'med-brufen', 'med-augmentin', 'med-omeprazole', 'med-cetirizine', 'med-ventolin', 'med-ors', 'med-cough-syrup', 'med-antacid', 'med-metformin', 'med-amlodipine', 'med-eye-drops'],
  },
  {
    id: 'pharm-lhr-sehat',
    slug: 'sehat-online-pharmacy',
    name: 'Sehat Online Pharmacy',
    description: 'Lahore-based online pharmacy with verified medicines and free delivery on orders above Rs. 2,000.',
    phone: '03-111-SEHAT-1',
    email: 'orders@sehat.pk',
    address: 'DHA Phase 5, Lahore',
    city: 'Lahore',
    citySlug: 'lahore',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2d5eaf7?w=800&auto=format&fit=crop',
    rating: 4.6,
    isHomeDelivery: true,
    deliveryFee: 0,
    deliveryTime: '2–4 hours',
    timings: '8:00 AM – 10:00 PM',
    medicineIds: ALL_MEDICINE_IDS,
  },
  {
    id: 'pharm-khi-ihs',
    slug: 'ihs-pharmacy',
    name: 'IHS Pharmacy',
    description: 'Karachi\'s leading pharmacy with cold-chain storage for insulin and temperature-sensitive medicines.',
    phone: '021-35891234',
    email: 'karachi@ihs.pk',
    address: 'Clifton Block 5, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop',
    rating: 4.8,
    isHomeDelivery: true,
    deliveryFee: 200,
    deliveryTime: '1–2 hours',
    timings: '8:00 AM – 12:00 AM',
    medicineIds: ALL_MEDICINE_IDS,
  },
  {
    id: 'pharm-khi-medicam',
    slug: 'medicam-pharmacy',
    name: 'Medicam Pharmacy',
    description: 'Well-stocked Karachi pharmacy near Aga Khan Hospital with prescription fulfillment services.',
    phone: '021-34930100',
    email: 'pharmacy@medicam.pk',
    address: 'Stadium Road, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-c75d40004b24?w=800&auto=format&fit=crop',
    rating: 4.6,
    isHomeDelivery: true,
    deliveryFee: 150,
    deliveryTime: '45–90 minutes',
    timings: '7:00 AM – 11:00 PM',
    medicineIds: ['med-panadol', 'med-augmentin', 'med-amoxil', 'med-metformin', 'med-insulin', 'med-ventolin', 'med-atorvastatin', 'med-amlodipine', 'med-thyroid', 'med-azithromycin', 'med-multivitamin', 'med-vitamin-d'],
  },
  {
    id: 'pharm-khi-health',
    slug: 'health-plus-pharmacy',
    name: 'Health Plus Pharmacy',
    description: 'Neighborhood pharmacy in PECHS offering affordable generics and home delivery across Karachi.',
    phone: '021-34567890',
    email: 'info@healthplus.pk',
    address: 'PECHS Block 2, Karachi',
    city: 'Karachi',
    citySlug: 'karachi',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2d5eaf7?w=800&auto=format&fit=crop',
    rating: 4.4,
    isHomeDelivery: true,
    deliveryFee: 120,
    deliveryTime: '1–3 hours',
    timings: '9:00 AM – 10:00 PM',
    medicineIds: ['med-panadol', 'med-brufen', 'med-omeprazole', 'med-cetirizine', 'med-ors', 'med-cough-syrup', 'med-antacid', 'med-iron', 'med-pain-gel', 'med-eye-drops'],
  },
  {
    id: 'pharm-isl-medico',
    slug: 'medico-pharmacy',
    name: 'Medico Pharmacy',
    description: 'Islamabad pharmacy in Blue Area with licensed pharmacists and express delivery in twin cities.',
    phone: '051-2287654',
    email: 'islamabad@medico.pk',
    address: 'Blue Area, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop',
    rating: 4.7,
    isHomeDelivery: true,
    deliveryFee: 180,
    deliveryTime: '45–75 minutes',
    timings: '8:00 AM – 11:00 PM',
    medicineIds: ALL_MEDICINE_IDS,
  },
  {
    id: 'pharm-isl-shifa',
    slug: 'shifa-pharmacy',
    name: 'Shifa Hospital Pharmacy',
    description: 'Hospital-affiliated pharmacy at Shifa International with specialty and oncology medicines.',
    phone: '051-8463700',
    email: 'pharmacy@shifa.com.pk',
    address: 'H-8/4, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-c75d40004b24?w=800&auto=format&fit=crop',
    rating: 4.8,
    isHomeDelivery: false,
    timings: '24 hours',
    medicineIds: ['med-panadol', 'med-augmentin', 'med-metformin', 'med-insulin', 'med-ventolin', 'med-atorvastatin', 'med-amlodipine', 'med-thyroid', 'med-azithromycin', 'med-multivitamin'],
  },
  {
    id: 'pharm-isl-f10',
    slug: 'f10-medicine-mart',
    name: 'F-10 Medicine Mart',
    description: 'Popular F-10 Markaz pharmacy with home delivery across Islamabad and Rawalpindi.',
    phone: '051-111-MEDIC1',
    email: 'f10@medicinemart.pk',
    address: 'F-10 Markaz, Islamabad',
    city: 'Islamabad',
    citySlug: 'islamabad',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2d5eaf7?w=800&auto=format&fit=crop',
    rating: 4.5,
    isHomeDelivery: true,
    deliveryFee: 100,
    deliveryTime: '1–2 hours',
    timings: '9:00 AM – 10:00 PM',
    medicineIds: ['med-panadol', 'med-brufen', 'med-omeprazole', 'med-cetirizine', 'med-ors', 'med-cough-syrup', 'med-antacid', 'med-vitamin-d', 'med-iron', 'med-pain-gel', 'med-eye-drops', 'med-multivitamin'],
  },
  {
    id: 'pharm-psw-rehman',
    slug: 'rehman-pharmacy',
    name: 'Rehman Pharmacy',
    description: 'Established Peshawar pharmacy on University Road with genuine medicines and local delivery.',
    phone: '091-2571234',
    email: 'info@rehmanpharmacy.pk',
    address: 'University Road, Peshawar',
    city: 'Peshawar',
    citySlug: 'peshawar',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop',
    rating: 4.4,
    isHomeDelivery: true,
    deliveryFee: 100,
    deliveryTime: '1–2 hours',
    timings: '8:00 AM – 10:00 PM',
    medicineIds: ['med-panadol', 'med-brufen', 'med-augmentin', 'med-omeprazole', 'med-cetirizine', 'med-ors', 'med-cough-syrup', 'med-antacid', 'med-metformin', 'med-ventolin', 'med-multivitamin'],
  },
  {
    id: 'pharm-psw-khyber',
    slug: 'khyber-medical-store',
    name: 'Khyber Medical Store',
    description: 'Trusted medical store in Peshawar Cantt serving patients with prescription and OTC products.',
    phone: '091-5278901',
    email: 'khyber@medstore.pk',
    address: 'Peshawar Cantt, Peshawar',
    city: 'Peshawar',
    citySlug: 'peshawar',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-c75d40004b24?w=800&auto=format&fit=crop',
    rating: 4.3,
    isHomeDelivery: false,
    timings: '9:00 AM – 9:00 PM',
    medicineIds: ['med-panadol', 'med-omeprazole', 'med-cetirizine', 'med-ors', 'med-cough-syrup', 'med-antacid', 'med-iron', 'med-pain-gel', 'med-eye-drops'],
  },
  {
    id: 'pharm-qta-bolan',
    slug: 'bolan-pharmacy',
    name: 'Bolan Pharmacy',
    description: 'Leading Quetta pharmacy on Jinnah Road with essential medicines and home delivery in city limits.',
    phone: '081-2823456',
    email: 'bolan@pharmacy.pk',
    address: 'Jinnah Road, Quetta',
    city: 'Quetta',
    citySlug: 'quetta',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop',
    rating: 4.5,
    isHomeDelivery: true,
    deliveryFee: 80,
    deliveryTime: '1–2 hours',
    timings: '8:00 AM – 10:00 PM',
    medicineIds: ['med-panadol', 'med-brufen', 'med-augmentin', 'med-omeprazole', 'med-cetirizine', 'med-ventolin', 'med-ors', 'med-cough-syrup', 'med-antacid', 'med-metformin', 'med-multivitamin', 'med-vitamin-d'],
  },
  {
    id: 'pharm-qta-civil',
    slug: 'civil-hospital-pharmacy',
    name: 'Civil Hospital Pharmacy',
    description: 'Hospital pharmacy at Civil Hospital Quetta with subsidized medicines and emergency supplies.',
    phone: '081-9201234',
    email: 'pharmacy@civilhospital.gob.pk',
    address: 'Circular Road, Quetta',
    city: 'Quetta',
    citySlug: 'quetta',
    country: 'Pakistan',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2d5eaf7?w=800&auto=format&fit=crop',
    rating: 4.2,
    isHomeDelivery: false,
    timings: '24 hours',
    medicineIds: ['med-panadol', 'med-amoxil', 'med-omeprazole', 'med-ors', 'med-cough-syrup', 'med-antacid', 'med-metformin', 'med-amlodipine', 'med-iron'],
  },
];

function getMedicinesByIds(medicineIds: string[]): PharmacyMedicine[] {
  return medicineIds
    .map((id) => PHARMACY_MEDICINES.find((m) => m.id === id))
    .filter((m): m is PharmacyMedicine => m !== undefined);
}

function enrichPharmacy(pharmacy: Omit<PublicPharmacy, 'medicines' | 'medicineCount'>): PublicPharmacy {
  const medicines = getMedicinesByIds(pharmacy.medicineIds);
  return {
    ...pharmacy,
    medicines,
    medicineCount: medicines.length,
  };
}

export function getPharmaciesByCitySlug(citySlug: string): PublicPharmacy[] {
  return DUMMY_PHARMACIES.filter((p) => p.citySlug === citySlug.toLowerCase()).map(enrichPharmacy);
}

export function getPharmacyBySlug(citySlug: string, pharmacySlug: string): PublicPharmacy | undefined {
  const pharmacy = DUMMY_PHARMACIES.find(
    (p) => p.citySlug === citySlug.toLowerCase() && p.slug === pharmacySlug.toLowerCase(),
  );
  return pharmacy ? enrichPharmacy(pharmacy) : undefined;
}

export function getMedicineCityName(citySlug: string): string {
  return MEDICINE_CITIES.find((c) => c.slug === citySlug)?.name ?? citySlug;
}

export function formatMedicinePrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

export function getStockLabel(status: MedicineStockStatus): string {
  const labels: Record<MedicineStockStatus, string> = {
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock',
  };
  return labels[status];
}

export function getStockClasses(status: MedicineStockStatus): string {
  const classes: Record<MedicineStockStatus, string> = {
    in_stock: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    low_stock: 'bg-amber-50 border-amber-200 text-amber-700',
    out_of_stock: 'bg-red-50 border-red-200 text-red-700',
  };
  return classes[status];
}
