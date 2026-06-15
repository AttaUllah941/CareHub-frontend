import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ChatConversation,
  ChatDeliveredReceiptEvent,
  ChatListQuery,
  ChatMessage,
  ChatReadReceiptEvent,
  ChatTypingEvent,
  CreateConversationRequest,
  DEFAULT_CHAT_LIST_QUERY,
  DEFAULT_CHAT_MESSAGES_QUERY,
} from '../../../core/models/chat.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const ChatActions = createActionGroup({
  source: 'Chat',
  events: {
    'Connect Socket': emptyProps(),
    'Disconnect Socket': emptyProps(),

    'Load Conversations': props<{ query?: Partial<ChatListQuery> }>(),
    'Load Conversations Success': props<{
      conversations: ChatConversation[];
      pagination: PaginationMeta;
      query: ChatListQuery;
    }>(),
    'Load Conversations Failure': props<{ error: string }>(),

    'Create Conversation': props<{ payload: CreateConversationRequest }>(),
    'Create Conversation Success': props<{ conversation: ChatConversation }>(),
    'Create Conversation Failure': props<{ error: string }>(),

    'Select Conversation': props<{ conversationId: string | null }>(),

    'Load Messages': props<{ conversationId: string; query?: Partial<typeof DEFAULT_CHAT_MESSAGES_QUERY> }>(),
    'Load Messages Success': props<{
      conversationId: string;
      messages: ChatMessage[];
      pagination: PaginationMeta;
    }>(),
    'Load Messages Failure': props<{ error: string }>(),

    'Message Received': props<{ message: ChatMessage; conversationId?: string }>(),
    'Typing Updated': props<ChatTypingEvent>(),
    'Read Receipt Received': props<ChatReadReceiptEvent>(),
    'Delivered Receipt Received': props<ChatDeliveredReceiptEvent>(),

    'Send Message': props<{ conversationId: string; content: string }>(),
    'Send Message Success': props<{ message: ChatMessage }>(),
    'Send Message Failure': props<{ error: string }>(),

    'Upload Attachment': props<{ conversationId: string; file: File; caption?: string }>(),
    'Upload Attachment Success': props<{ message: ChatMessage }>(),
    'Upload Attachment Failure': props<{ error: string }>(),

    'Mark Read': props<{ conversationId: string; messageId?: string }>(),

    'Clear Error': emptyProps(),
  },
});

export { DEFAULT_CHAT_LIST_QUERY, DEFAULT_CHAT_MESSAGES_QUERY };
