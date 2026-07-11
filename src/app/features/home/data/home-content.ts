export interface CityOption {
  name: string;
  slug: string;
}

export interface ServiceCard {
  title: string;
  subtitle: string;
  icon: string;
  link: string;
  accent: string;
}

export interface SymptomItem {
  name: string;
  slug: string;
  icon: string;
  specialtySlug: string;
  description?: string;
}

export interface MedicalQuestion {
  id: string;
  question: string;
  answer: string;
  doctorName: string;
  specialty: string;
  specialtySlug: string;
  askedAt: string;
  views: number;
  category: string;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: string;
}

export interface TrustBadge {
  number: string;
  title: string;
  subtitle: string;
}

export interface FooterCityLinks {
  city: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  specialtySlug: string;
  city: string;
}

/** Maps footer specialty labels to backend specialty slugs */
export const FOOTER_SPECIALTY_SLUGS: Record<string, string> = {
  Dermatologist: 'dermatologist',
  Gynecologist: 'gynecologist-obstetrician-obgyn',
  Psychiatrist: 'general-physician',
  Urologist: 'general-physician',
  Pediatrician: 'pediatrician',
};

export const PAKISTAN_CITIES: CityOption[] = [
  { name: 'Lahore', slug: 'lahore' },
  { name: 'Karachi', slug: 'karachi' },
  { name: 'Islamabad', slug: 'islamabad' },
  { name: 'Multan', slug: 'multan' },
  { name: 'Peshawar', slug: 'peshawar' },
  { name: 'Faisalabad', slug: 'faisalabad' },
  { name: 'Sargodha', slug: 'sargodha' },
];

export const SERVICE_CARDS: ServiceCard[] = [
  {
    title: 'Video Consultation',
    subtitle: 'PMC Verified Doctors — consult online',
    icon: '📹',
    link: '/auth/register',
    accent: 'bg-sky-50 border-sky-100',
  },
  {
    title: 'In-clinic Visit',
    subtitle: 'Book appointment with doctor',
    icon: '🏥',
    link: '/hospitals/lahore',
    accent: 'bg-emerald-50 border-emerald-100',
  },
  {
    title: 'Book Lab Test',
    subtitle: 'Home collection available',
    icon: '🧪',
    link: '/labs/lahore',
    accent: 'bg-violet-50 border-violet-100',
  },
  {
    title: 'Medicines',
    subtitle: 'Order from verified pharmacies',
    icon: '💊',
    link: '/medicines',
    accent: 'bg-amber-50 border-amber-100',
  },
  {
    title: 'Health Hub',
    subtitle: 'Articles & wellness tips',
    icon: '📰',
    link: '/auth/register',
    accent: 'bg-rose-50 border-rose-100',
  },
  {
    title: 'Hospitals',
    subtitle: 'Find hospitals by city',
    icon: '🏨',
    link: '/hospitals/lahore',
    accent: 'bg-cyan-50 border-cyan-100',
  },
  {
    title: 'Instant Relief',
    subtitle: 'Get help in a click',
    icon: '⚡',
    link: '/auth/login',
    accent: 'bg-orange-50 border-orange-100',
  },
  {
    title: 'Weight Loss Clinic',
    subtitle: 'Healthy lifestyle programs',
    icon: '🏃',
    link: '/auth/register',
    accent: 'bg-lime-50 border-lime-100',
  },
];

export const SYMPTOMS: SymptomItem[] = [
  { name: 'Fever', slug: 'fever', icon: '🌡️', specialtySlug: 'general-physician', description: 'High temperature & flu-like signs' },
  { name: 'Heart attack', slug: 'heart-attack', icon: '❤️', specialtySlug: 'cardiologist', description: 'Chest pain & cardiac symptoms' },
  { name: 'Pregnancy', slug: 'pregnancy', icon: '🤰', specialtySlug: 'gynecologist-obstetrician-obgyn', description: 'Prenatal care & maternity concerns' },
  { name: 'High blood pressure', slug: 'hypertension', icon: '🩺', specialtySlug: 'cardiologist', description: 'Hypertension management' },
  { name: 'Breathlessness', slug: 'breathlessness', icon: '💨', specialtySlug: 'general-physician', description: 'Shortness of breath & asthma' },
  { name: 'Diarrhea', slug: 'diarrhea', icon: '🤢', specialtySlug: 'gastroenterologist', description: 'Stomach & digestive issues' },
  { name: 'Hairfall', slug: 'hairfall', icon: '💇', specialtySlug: 'dermatologist', description: 'Hair loss & scalp problems' },
  { name: 'Anxiety / Depression', slug: 'anxiety', icon: '🧠', specialtySlug: 'general-physician', description: 'Mental health support' },
  { name: 'Back pain', slug: 'back-pain', icon: '🦴', specialtySlug: 'orthopedic-surgeon', description: 'Spine & joint discomfort' },
  { name: 'Skin rash', slug: 'skin-rash', icon: '🔴', specialtySlug: 'dermatologist', description: 'Allergies & skin irritation' },
  { name: 'Urinary infection', slug: 'uti', icon: '💧', specialtySlug: 'general-physician', description: 'Burning & frequent urination' },
  { name: 'Child fever', slug: 'child-fever', icon: '👶', specialtySlug: 'pediatrician', description: 'Pediatric fever & illness' },
];

export const DISEASES: SymptomItem[] = [
  { name: 'Dengue fever', slug: 'dengue', icon: '🦟', specialtySlug: 'general-physician', description: 'Fever, body aches & platelet drop' },
  { name: 'Typhoid Fever', slug: 'typhoid', icon: '🌡️', specialtySlug: 'general-physician', description: 'Prolonged fever & weakness' },
  { name: 'Piles', slug: 'piles', icon: '⭕', specialtySlug: 'general-physician', description: 'Hemorrhoids & rectal bleeding' },
  { name: 'Gastritis', slug: 'gastritis', icon: '🫃', specialtySlug: 'gastroenterologist', description: 'Acidity & stomach inflammation' },
  { name: 'Hernia', slug: 'hernia', icon: '🔧', specialtySlug: 'general-physician', description: 'Bulge & abdominal discomfort' },
  { name: 'Vaginal Infection', slug: 'vaginal-infection', icon: '🌸', specialtySlug: 'gynecologist-obstetrician-obgyn', description: 'Discharge & pelvic discomfort' },
  { name: 'Migraine', slug: 'migraine', icon: '🤕', specialtySlug: 'neurologist', description: 'Severe headaches & sensitivity' },
  { name: 'TB', slug: 'tb', icon: '🫁', specialtySlug: 'general-physician', description: 'Chronic cough & weight loss' },
  { name: 'Diabetes', slug: 'diabetes', icon: '🍬', specialtySlug: 'general-physician', description: 'Blood sugar management' },
  { name: 'Thyroid', slug: 'thyroid', icon: '🦋', specialtySlug: 'general-physician', description: 'Hormonal imbalance & fatigue' },
  { name: 'Kidney stones', slug: 'kidney-stones', icon: '💎', specialtySlug: 'general-physician', description: 'Flank pain & painful urination' },
  { name: 'Arthritis', slug: 'arthritis', icon: '🦵', specialtySlug: 'orthopedic-surgeon', description: 'Joint pain & stiffness' },
];

export const MEDICAL_QUESTIONS: MedicalQuestion[] = [
  {
    id: 'q1',
    question: 'I have had a mild fever and sore throat for 3 days. Should I take antibiotics?',
    answer: 'Most sore throats are viral. Rest, fluids, and paracetamol help. See a doctor if fever persists beyond 5 days, breathing worsens, or you have chronic conditions.',
    doctorName: 'Dr. Ayesha Khan',
    specialty: 'General Physician',
    specialtySlug: 'general-physician',
    askedAt: '2 days ago',
    views: 1240,
    category: 'Fever & Infections',
  },
  {
    id: 'q2',
    question: 'Can I travel by air during early pregnancy (8 weeks)?',
    answer: 'Air travel is generally safe in uncomplicated early pregnancy. Stay hydrated, move your legs periodically, and carry your antenatal records. Consult your gynecologist if you have bleeding or pain.',
    doctorName: 'Dr. Sana Malik',
    specialty: 'Gynecologist',
    specialtySlug: 'gynecologist-obstetrician-obgyn',
    askedAt: '4 days ago',
    views: 2180,
    category: 'Pregnancy',
  },
  {
    id: 'q3',
    question: 'My BP readings are 145/95 at home. Do I need medication?',
    answer: 'Repeated readings above 140/90 warrant evaluation. Lifestyle changes matter, but many patients need medication. Book a cardiologist visit for risk assessment and a tailored plan.',
    doctorName: 'Dr. Imran Hussain',
    specialty: 'Cardiologist',
    specialtySlug: 'cardiologist',
    askedAt: '1 week ago',
    views: 3420,
    category: 'Heart & BP',
  },
  {
    id: 'q4',
    question: 'Persistent hair fall after COVID — is this normal?',
    answer: 'Telogen effluvium after illness or stress is common and often temporary. If shedding continues beyond 6 months or you see patchy bald spots, see a dermatologist for evaluation.',
    doctorName: 'Dr. Hina Raza',
    specialty: 'Dermatologist',
    specialtySlug: 'dermatologist',
    askedAt: '1 week ago',
    views: 1890,
    category: 'Skin & Hair',
  },
  {
    id: 'q5',
    question: 'Child has loose stools 4 times today but is active. When to worry?',
    answer: 'If the child is drinking well and playful, oral rehydration and light diet may suffice. Seek urgent care for blood in stool, lethargy, no urine for 8+ hours, or persistent vomiting.',
    doctorName: 'Dr. Usman Ali',
    specialty: 'Pediatrician',
    specialtySlug: 'pediatrician',
    askedAt: '3 days ago',
    views: 2760,
    category: 'Child Health',
  },
  {
    id: 'q6',
    question: 'Feeling anxious and unable to sleep for two weeks. What should I do?',
    answer: 'Prolonged anxiety affecting sleep needs professional support. A psychiatrist can assess for anxiety or depression and recommend therapy, lifestyle changes, or medication if needed.',
    doctorName: 'Dr. Farah Noor',
    specialty: 'Psychiatrist',
    specialtySlug: 'general-physician',
    askedAt: '5 days ago',
    views: 1650,
    category: 'Mental Health',
  },
];

export const HEALTH_QUESTION_CATEGORIES = [
  'Fever & Infections',
  'Pregnancy',
  'Heart & BP',
  'Skin & Hair',
  'Child Health',
  'Mental Health',
  'General Health',
] as const;

export const ASK_DOCTOR_STATS = [
  { label: 'Questions answered', value: '50,000+' },
  { label: 'PMC verified doctors', value: '10,000+' },
  { label: 'Avg. response time', value: '< 24 hrs' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Umair Ali',
    text: 'I got late on my appointment, but after 10 minutes the doctor called me and prescribed medicines — far better than waiting at a clinic!',
    rating: 'Good',
  },
  {
    name: 'Misbah Khan',
    text: 'Very smooth experience. The skin specialist was helpful and professional. The facility is also very good.',
    rating: 'Satisfied',
  },
  {
    name: 'Irfan Muddassir',
    text: 'A great initiative to connect with healthcare professionals. The helpline team is supportive whenever you need help.',
    rating: 'Good',
  },
];

export const TRUST_BADGES: TrustBadge[] = [
  { number: '1', title: 'PMC Verified Doctors', subtitle: '10,000+ doctors available' },
  { number: '2', title: '24/7 Customer Support', subtitle: 'Well-trained & supportive team' },
  { number: '3', title: 'Secure Online Payments', subtitle: 'SSL-encrypted transactions' },
  { number: '4.5', title: 'Trusted by Patients', subtitle: 'Thousands of happy reviews' },
];

export const FOOTER_CITY_LINKS: FooterCityLinks[] = [
  {
    city: 'Lahore',
    links: [
      { label: 'Best Dermatologist in Lahore', specialtySlug: 'dermatologist', city: 'Lahore' },
      { label: 'Best Gynecologist in Lahore', specialtySlug: 'gynecologist-obstetrician-obgyn', city: 'Lahore' },
      { label: 'Best Psychiatrist in Lahore', specialtySlug: 'general-physician', city: 'Lahore' },
      { label: 'Best Urologist in Lahore', specialtySlug: 'general-physician', city: 'Lahore' },
      { label: 'Best Pediatrician in Lahore', specialtySlug: 'pediatrician', city: 'Lahore' },
    ],
  },
  {
    city: 'Karachi',
    links: [
      { label: 'Best Dermatologist in Karachi', specialtySlug: 'dermatologist', city: 'Karachi' },
      { label: 'Best Gynecologist in Karachi', specialtySlug: 'gynecologist-obstetrician-obgyn', city: 'Karachi' },
      { label: 'Best Psychiatrist in Karachi', specialtySlug: 'general-physician', city: 'Karachi' },
      { label: 'Best Urologist in Karachi', specialtySlug: 'general-physician', city: 'Karachi' },
      { label: 'Best Pediatrician in Karachi', specialtySlug: 'pediatrician', city: 'Karachi' },
    ],
  },
  {
    city: 'Islamabad',
    links: [
      { label: 'Best Dermatologist in Islamabad', specialtySlug: 'dermatologist', city: 'Islamabad' },
      { label: 'Best Gynecologist in Islamabad', specialtySlug: 'gynecologist-obstetrician-obgyn', city: 'Islamabad' },
      { label: 'Best Psychiatrist in Islamabad', specialtySlug: 'general-physician', city: 'Islamabad' },
      { label: 'Best Urologist in Islamabad', specialtySlug: 'general-physician', city: 'Islamabad' },
      { label: 'Best Pediatrician in Islamabad', specialtySlug: 'pediatrician', city: 'Islamabad' },
    ],
  },
  {
    city: 'Other Cities',
    links: [
      { label: 'Best Dermatologist in Multan', specialtySlug: 'dermatologist', city: 'Multan' },
      { label: 'Best Gynecologist in Peshawar', specialtySlug: 'gynecologist-obstetrician-obgyn', city: 'Peshawar' },
      { label: 'Best Psychiatrist in Quetta', specialtySlug: 'general-physician', city: 'Quetta' },
      { label: 'Best Pediatrician in Faisalabad', specialtySlug: 'pediatrician', city: 'Faisalabad' },
      { label: 'Best Urologist in Rawalpindi', specialtySlug: 'general-physician', city: 'Rawalpindi' },
    ],
  },
];

export const NAV_LINKS = [
  { label: 'Medicines', href: '/medicines' },
];
