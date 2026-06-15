import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CHAT_FEATURE_KEY, ChatState } from './chat.state';

export const selectChatState = createFeatureSelector<ChatState>(CHAT_FEATURE_KEY);

export const selectConversations = createSelector(selectChatState, (s) => s.conversations);
export const selectConversationsQuery = createSelector(selectChatState, (s) => s.conversationsQuery);
export const selectActiveConversationId = createSelector(selectChatState, (s) => s.activeConversationId);
export const selectChatLoading = createSelector(selectChatState, (s) => s.loading);
export const selectChatSending = createSelector(selectChatState, (s) => s.sending);
export const selectChatError = createSelector(selectChatState, (s) => s.error);
export const selectSocketConnected = createSelector(selectChatState, (s) => s.socketConnected);

export const selectActiveConversation = createSelector(
  selectConversations,
  selectActiveConversationId,
  (conversations, id) => conversations.find((c) => c.id === id) ?? null,
);

export const selectActiveMessages = createSelector(
  selectChatState,
  selectActiveConversationId,
  (state, id) => (id ? state.messagesByConversation[id] || [] : []),
);

export const selectTypingUserId = createSelector(
  selectChatState,
  selectActiveConversationId,
  (state, id) => (id ? state.typingByConversation[id] || null : null),
);

export const selectTotalUnread = createSelector(selectConversations, (conversations) =>
  conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
);
