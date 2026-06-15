import { ChatConversation, ChatMessage } from '../../../core/models/chat.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import { DEFAULT_CHAT_LIST_QUERY } from './chat.actions';

export const CHAT_FEATURE_KEY = 'chat';

export interface ChatState {
  conversations: ChatConversation[];
  conversationsPagination: PaginationMeta | null;
  conversationsQuery: typeof DEFAULT_CHAT_LIST_QUERY;
  activeConversationId: string | null;
  messagesByConversation: Record<string, ChatMessage[]>;
  messagesPagination: Record<string, PaginationMeta | null>;
  typingByConversation: Record<string, string | null>;
  loading: boolean;
  sending: boolean;
  error: string | null;
  socketConnected: boolean;
}

export const initialState: ChatState = {
  conversations: [],
  conversationsPagination: null,
  conversationsQuery: DEFAULT_CHAT_LIST_QUERY,
  activeConversationId: null,
  messagesByConversation: {},
  messagesPagination: {},
  typingByConversation: {},
  loading: false,
  sending: false,
  error: null,
  socketConnected: false,
};
