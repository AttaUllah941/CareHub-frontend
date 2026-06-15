import { createReducer, on } from '@ngrx/store';
import { ChatActions } from './chat.actions';
import { initialState } from './chat.state';

function upsertMessage(messages: typeof initialState.messagesByConversation[string], message: typeof initialState.messagesByConversation[string][number]) {
  if (messages.some((m) => m.id === message.id)) return messages;
  return [...messages, message];
}

function updateConversationPreview(conversations: typeof initialState.conversations, message: typeof initialState.messagesByConversation[string][number]) {
  return conversations.map((c) =>
    c.id === message.conversationId
      ? {
          ...c,
          lastMessageAt: message.createdAt,
          lastMessagePreview: message.messageType === 'ATTACHMENT' ? `📎 ${message.attachment?.originalFileName}` : message.content,
        }
      : c,
  );
}

export const chatReducer = createReducer(
  initialState,

  on(ChatActions.connectSocket, (state) => ({ ...state, socketConnected: true })),
  on(ChatActions.disconnectSocket, (state) => ({ ...state, socketConnected: false })),

  on(ChatActions.loadConversations, (state) => ({ ...state, loading: true, error: null })),
  on(ChatActions.loadConversationsSuccess, (state, { conversations, pagination, query }) => ({
    ...state,
    loading: false,
    conversations,
    conversationsPagination: pagination,
    conversationsQuery: query,
  })),
  on(ChatActions.loadConversationsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ChatActions.createConversationSuccess, (state, { conversation }) => {
    const exists = state.conversations.some((c) => c.id === conversation.id);
    return {
      ...state,
      conversations: exists ? state.conversations : [conversation, ...state.conversations],
      activeConversationId: conversation.id,
    };
  }),

  on(ChatActions.selectConversation, (state, { conversationId }) => ({
    ...state,
    activeConversationId: conversationId,
  })),

  on(ChatActions.loadMessages, (state) => ({ ...state, loading: true, error: null })),
  on(ChatActions.loadMessagesSuccess, (state, { conversationId, messages, pagination }) => ({
    ...state,
    loading: false,
    messagesByConversation: { ...state.messagesByConversation, [conversationId]: messages },
    messagesPagination: { ...state.messagesPagination, [conversationId]: pagination },
  })),
  on(ChatActions.loadMessagesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ChatActions.messageReceived, (state, { message, conversationId }) => {
    const convId = conversationId || message.conversationId;
    const existing = state.messagesByConversation[convId] || [];
    return {
      ...state,
      conversations: updateConversationPreview(state.conversations, message),
      messagesByConversation: {
        ...state.messagesByConversation,
        [convId]: upsertMessage(existing, message),
      },
    };
  }),

  on(ChatActions.typingUpdated, (state, event) => ({
    ...state,
    typingByConversation: {
      ...state.typingByConversation,
      [event.conversationId]: event.isTyping ? event.userId : null,
    },
  })),

  on(ChatActions.readReceiptReceived, (state, event) => {
    const messages = state.messagesByConversation[event.conversationId];
    if (!messages) return state;
    const updated = messages.map((m) =>
      m.senderUserId !== event.readerUserId && !m.readBy.some((r) => r.userId === event.readerUserId)
        ? { ...m, readBy: [...m.readBy, { userId: event.readerUserId, readAt: event.readAt }] }
        : m,
    );
    return {
      ...state,
      messagesByConversation: { ...state.messagesByConversation, [event.conversationId]: updated },
      conversations: state.conversations.map((c) =>
        c.id === event.conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    };
  }),

  on(ChatActions.deliveredReceiptReceived, (state, event) => {
    const updatedMap = { ...state.messagesByConversation };
    Object.keys(updatedMap).forEach((convId) => {
      updatedMap[convId] = updatedMap[convId].map((m) =>
        m.id === event.messageId && !m.deliveredTo.some((d) => d.userId === event.deliveredToUserId)
          ? { ...m, deliveredTo: [...m.deliveredTo, { userId: event.deliveredToUserId, deliveredAt: event.deliveredAt }] }
          : m,
      );
    });
    return { ...state, messagesByConversation: updatedMap };
  }),

  on(ChatActions.sendMessage, (state) => ({ ...state, sending: true, error: null })),
  on(ChatActions.sendMessageSuccess, (state, { message }) => ({
    ...state,
    sending: false,
    conversations: updateConversationPreview(state.conversations, message),
    messagesByConversation: {
      ...state.messagesByConversation,
      [message.conversationId]: upsertMessage(state.messagesByConversation[message.conversationId] || [], message),
    },
  })),
  on(ChatActions.sendMessageFailure, (state, { error }) => ({ ...state, sending: false, error })),

  on(ChatActions.uploadAttachment, (state) => ({ ...state, sending: true, error: null })),
  on(ChatActions.uploadAttachmentSuccess, (state, { message }) => ({
    ...state,
    sending: false,
    conversations: updateConversationPreview(state.conversations, message),
    messagesByConversation: {
      ...state.messagesByConversation,
      [message.conversationId]: upsertMessage(state.messagesByConversation[message.conversationId] || [], message),
    },
  })),
  on(ChatActions.uploadAttachmentFailure, (state, { error }) => ({ ...state, sending: false, error })),

  on(ChatActions.clearError, (state) => ({ ...state, error: null })),
);
