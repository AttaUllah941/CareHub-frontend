import { PaginationMeta } from '../../../core/models/api.model';
import { ChatConversation } from '../models/chat.models';

export interface PaginatedConversations {
  conversations: ChatConversation[];
  pagination: PaginationMeta;
}
