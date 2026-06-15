import { PaginationMeta } from './appointment.model';

export type ChatMessageType = 'TEXT' | 'ATTACHMENT' | 'SYSTEM';

export interface ChatParticipant {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: string;
}

export interface ChatConversation {
  id: string;
  doctorUserId: string;
  patientUserId: string;
  appointmentId?: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  doctorUnreadCount: number;
  patientUnreadCount: number;
  unreadCount: number;
  doctor?: ChatParticipant;
  patient?: ChatParticipant;
  otherParticipant?: ChatParticipant;
}

export interface ChatAttachment {
  storedFileName: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  relativePath: string;
}

export interface ChatReadReceipt {
  userId: string;
  readAt: string;
}

export interface ChatDeliveryReceipt {
  userId: string;
  deliveredAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderUserId: string;
  content?: string;
  messageType: ChatMessageType;
  attachment?: ChatAttachment;
  readBy: ChatReadReceipt[];
  deliveredTo: ChatDeliveryReceipt[];
  sender?: ChatParticipant;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateConversationRequest {
  doctorUserId?: string;
  patientUserId?: string;
  appointmentId?: string;
}

export interface ChatTypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface ChatReadReceiptEvent {
  conversationId: string;
  readerUserId: string;
  messageId?: string | null;
  readAt: string;
}

export interface ChatDeliveredReceiptEvent {
  messageId: string;
  deliveredToUserId: string;
  deliveredAt: string;
}

export interface ChatListQuery {
  page: number;
  limit: number;
}

export const DEFAULT_CHAT_LIST_QUERY: ChatListQuery = { page: 1, limit: 30 };

export interface ChatMessagesQuery {
  page: number;
  limit: number;
  before?: string;
}

export const DEFAULT_CHAT_MESSAGES_QUERY: ChatMessagesQuery = { page: 1, limit: 50 };
