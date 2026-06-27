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
  links: string[];
}

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
  { name: 'Fever', slug: 'fever' },
  { name: 'Heart attack', slug: 'heart-attack' },
  { name: 'Pregnancy', slug: 'pregnancy' },
  { name: 'High blood pressure', slug: 'hypertension' },
  { name: 'Breathlessness', slug: 'breathlessness' },
  { name: 'Diarrhea', slug: 'diarrhea' },
  { name: 'Hairfall', slug: 'hairfall' },
  { name: 'Anxiety / Depression', slug: 'anxiety' },
];

export const DISEASES: SymptomItem[] = [
  { name: 'Dengue fever', slug: 'dengue' },
  { name: 'Typhoid Fever', slug: 'typhoid' },
  { name: 'Piles', slug: 'piles' },
  { name: 'Gastritis', slug: 'gastritis' },
  { name: 'Hernia', slug: 'hernia' },
  { name: 'Vaginal Infection', slug: 'vaginal-infection' },
  { name: 'Migraine', slug: 'migraine' },
  { name: 'TB', slug: 'tb' },
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
  { number: '2', title: '15/7 Customer Support', subtitle: 'Well-trained & supportive team' },
  { number: '3', title: 'Secure Online Payments', subtitle: 'SSL-encrypted transactions' },
  { number: '4.5', title: 'Trusted by Patients', subtitle: 'Thousands of happy reviews' },
];

export const FOOTER_CITY_LINKS: FooterCityLinks[] = [
  {
    city: 'Lahore',
    links: [
      'Best Dermatologist in Lahore',
      'Best Gynecologist in Lahore',
      'Best Psychiatrist in Lahore',
      'Best Urologist in Lahore',
      'Best Pediatrician in Lahore',
    ],
  },
  {
    city: 'Karachi',
    links: [
      'Best Dermatologist in Karachi',
      'Best Gynecologist in Karachi',
      'Best Psychiatrist in Karachi',
      'Best Urologist in Karachi',
      'Best Pediatrician in Karachi',
    ],
  },
  {
    city: 'Islamabad',
    links: [
      'Best Dermatologist in Islamabad',
      'Best Gynecologist in Islamabad',
      'Best Psychiatrist in Islamabad',
      'Best Urologist in Islamabad',
      'Best Pediatrician in Islamabad',
    ],
  },
  {
    city: 'Other Cities',
    links: [
      'Best Dermatologist in Multan',
      'Best Gynecologist in Peshawar',
      'Best Psychiatrist in Quetta',
      'Best Pediatrician in Faisalabad',
      'Best Urologist in Rawalpindi',
    ],
  },
];

export const NAV_LINKS = [
  { label: 'Medicines', href: '/medicines' },
];
