/** Contracts for the CareHub AI chat API (`/api/v1/ai/*`). */

export type ChatRole = 'user' | 'assistant';

export interface ChatDoctor {
  id: string;
  name: string;
  specialties: string[];
  city: string;
  consultationFee: number;
  currency: string;
  averageRating: number;
  reviewCount: number;
  yearsOfExperience: number;
  profileImageUrl?: string;
  clinic?: { name: string; address: string } | null;
}

export interface ChatAppointment {
  id: string;
  bookingRef: string | null;
  doctorId: string;
  doctorName: string;
  scheduledAt: string;
  scheduledLabel: string;
  status: string;
  consultationType: string;
  cancellable: boolean;
}

export interface ChatLab {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  timings: string;
  slug: string;
  citySlug: string;
}

export interface ChatLabTest {
  id: string;
  name: string;
  price: number;
  currency: string;
  homeCollectionAvailable: boolean;
}

export interface ChatPriceRow extends ChatLabTest {
  labId: string;
  labName: string;
  city: string;
}

export interface ChatMedicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  currency: string;
  requiresPrescription: boolean;
  inStock: boolean;
  stock: number;
  pharmacy: { id: string; name: string; city: string };
}

export interface ChatPharmacy {
  id: string;
  name: string;
  city: string;
  address: string;
  timings: string;
  rating: number;
  isHomeDelivery: boolean;
  deliveryFee: number;
  deliveryTime: string;
  slug: string;
  citySlug: string;
}

export interface ChatProcedure {
  id: string;
  name: string;
  category: string;
  estimatedCostRange: { min: number; max: number };
  currency: string;
  hospitalCount: number;
}

export interface ChatHospital {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  offersSurgeries: boolean;
  slug: string;
  citySlug: string;
}

export interface ChatConsultationRequest {
  id: string;
  status: string;
  procedure: string;
  hospital: string;
  createdAt: string;
}

export interface ChatHealthItem {
  id: string;
  question: string;
  answer: string;
  answeredBy: string;
  specialty: string;
}

export type ChatKnowledgeKind = 'article' | 'policy' | 'doctor_answer';

export interface ChatKnowledgePassage {
  id: string;
  title: string;
  section: string;
  excerpt: string;
  kind: ChatKnowledgeKind;
  source: string;
}

export interface ChatConfirmationData {
  actionId: string;
  tool: string;
  summary: string;
  /** Extra lines to review before confirming (e.g. a prescription draft). */
  details?: { label: string; value: string }[];
  expiresAt: string;
}

/** Generic blocks used by the Doctor and Admin assistants. */
export interface ChatStat {
  label: string;
  value: string;
  hint?: string;
}

export interface ChatStatsData {
  title: string;
  stats: ChatStat[];
}

export interface ChatTableData {
  title: string;
  columns: string[];
  rows: string[][];
}

export type ChatTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface ChatListItem {
  id: string;
  title: string;
  subtitle: string;
  badge: { text: string; tone: ChatTone } | null;
  lines: string[];
  /** Buttons only send a chat message; the confirmation step still applies to any change. */
  actions: { label: string; message: string }[];
}

export interface ChatListData {
  title: string;
  items: ChatListItem[];
}

export interface ChatActionResultData {
  kind: string;
  title: string;
  lines: string[];
  link?: string;
}

export interface ChatAvailabilityData {
  doctorId: string;
  doctorName: string;
  date: string;
  dateLabel: string;
  slots: { time: string; consultationType: string }[];
}

export type ChatAction =
  | { type: 'DOCTOR_RESULTS'; data: { doctors: ChatDoctor[] } }
  | { type: 'AVAILABILITY'; data: ChatAvailabilityData }
  | { type: 'APPOINTMENTS'; data: { appointments: ChatAppointment[]; heading?: string } }
  | { type: 'LAB_RESULTS'; data: { labs: ChatLab[] } }
  | { type: 'LAB_TESTS'; data: { labId: string; tests: ChatLabTest[] } }
  | { type: 'LAB_PRICE_COMPARISON'; data: { testName: string; rows: ChatPriceRow[] } }
  | { type: 'MEDICINE_RESULTS'; data: { medicines: ChatMedicine[] } }
  | { type: 'PHARMACY_RESULTS'; data: { pharmacies: ChatPharmacy[] } }
  | { type: 'SURGERY_RESULTS'; data: { procedures: ChatProcedure[] } }
  | { type: 'HOSPITAL_RESULTS'; data: { hospitals: ChatHospital[] } }
  | { type: 'CONSULTATION_REQUESTS'; data: { requests: ChatConsultationRequest[] } }
  | { type: 'HEALTH_ANSWERS'; data: { items: ChatHealthItem[] } }
  | { type: 'KNOWLEDGE'; data: { topic: string; passages: ChatKnowledgePassage[] } }
  | { type: 'STATS'; data: ChatStatsData }
  | { type: 'TABLE'; data: ChatTableData }
  | { type: 'LIST'; data: ChatListData }
  | { type: 'CONFIRMATION'; data: ChatConfirmationData }
  | { type: 'ACTION_RESULT'; data: ChatActionResultData };

export interface ChatMessage {
  /** Server id, or a local `tmp-…` id until the server confirms. */
  id: string;
  role: ChatRole;
  content: string;
  actions: ChatAction[];
  createdAt: string;
  failed?: boolean;
}

export interface ChatConversation {
  id: string;
  agent: string;
  title: string;
  lastMessageAt: string;
}

export interface ChatCapabilities {
  available: boolean;
  configured: boolean;
  agent?: string;
  label?: string;
  tagline?: string;
  welcome?: string;
  reason?: string;
  suggestions?: string[];
}

export interface ChatReply {
  conversationId: string;
  agent: string;
  title: string;
  messageId: string;
  message: string;
  actions: ChatAction[];
  createdAt: string;
}

export interface ChatActionResponse {
  conversationId: string;
  status: 'executed' | 'cancelled';
  message: ChatMessage;
}

export type ChatActionStatus = 'confirming' | 'cancelling' | 'done' | 'cancelled' | 'error';

export interface ChatActionState {
  status: ChatActionStatus;
  error?: string;
}
