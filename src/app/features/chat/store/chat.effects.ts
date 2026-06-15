import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, from, map, of, tap, withLatestFrom } from 'rxjs';
import { ChatApiService } from '../services/chat-api.service';
import { ChatSocketService } from '../services/chat-socket.service';
import { ChatActions, DEFAULT_CHAT_LIST_QUERY } from './chat.actions';
import { selectConversationsQuery } from './chat.selectors';

@Injectable()
export class ChatEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ChatApiService);
  private readonly socket = inject(ChatSocketService);
  private readonly store = inject(Store);
  private socketListenersBound = false;

  connectSocket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatActions.connectSocket),
        tap(() => {
          this.socket.connect();
          if (this.socketListenersBound) return;
          this.socketListenersBound = true;

          this.socket.onMessage().subscribe((payload) => {
            this.store.dispatch(ChatActions.messageReceived(payload));
          });
          this.socket.onTyping().subscribe((event) => {
            this.store.dispatch(ChatActions.typingUpdated(event));
          });
          this.socket.onReadReceipt().subscribe((event) => {
            this.store.dispatch(ChatActions.readReceiptReceived(event));
          });
          this.socket.onDeliveredReceipt().subscribe((event) => {
            this.store.dispatch(ChatActions.deliveredReceiptReceived(event));
          });
        }),
      ),
    { dispatch: false },
  );

  disconnectSocket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatActions.disconnectSocket),
        tap(() => this.socket.disconnect()),
      ),
    { dispatch: false },
  );

  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadConversations),
      withLatestFrom(this.store.select(selectConversationsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_CHAT_LIST_QUERY, ...current, ...query };
        return this.api.getConversations(merged).pipe(
          map((res) =>
            ChatActions.loadConversationsSuccess({
              conversations: res.data.conversations,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(ChatActions.loadConversationsFailure({ error: err.error?.message ?? 'Failed to load conversations' })),
          ),
        );
      }),
    ),
  );

  createConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.createConversation),
      exhaustMap(({ payload }) =>
        this.api.createConversation(payload).pipe(
          map((res) => ChatActions.createConversationSuccess({ conversation: res.data.conversation })),
          catchError((err) =>
            of(ChatActions.createConversationFailure({ error: err.error?.message ?? 'Failed to start conversation' })),
          ),
        ),
      ),
    ),
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadMessages),
      exhaustMap(({ conversationId, query }) =>
        this.api.getMessages(conversationId, query).pipe(
          map((res) =>
            ChatActions.loadMessagesSuccess({
              conversationId,
              messages: res.data.messages,
              pagination: res.data.pagination,
            }),
          ),
          catchError((err) =>
            of(ChatActions.loadMessagesFailure({ error: err.error?.message ?? 'Failed to load messages' })),
          ),
        ),
      ),
    ),
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      exhaustMap(({ conversationId, content }) =>
        from(this.socket.sendMessage(conversationId, content)).pipe(
          map((result) =>
            result.success && result.message
              ? ChatActions.sendMessageSuccess({ message: result.message })
              : ChatActions.sendMessageFailure({ error: result.error ?? 'Failed to send message' }),
          ),
        ),
      ),
    ),
  );

  uploadAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.uploadAttachment),
      exhaustMap(({ conversationId, file, caption }) =>
        this.api.uploadAttachment(conversationId, file, caption).pipe(
          map((res) => ChatActions.uploadAttachmentSuccess({ message: res.data.message })),
          catchError((err) =>
            of(ChatActions.uploadAttachmentFailure({ error: err.error?.message ?? 'Failed to upload attachment' })),
          ),
        ),
      ),
    ),
  );

  markRead$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatActions.markRead),
        tap(({ conversationId, messageId }) => {
          this.socket.markRead(conversationId, messageId);
          this.api.markRead(conversationId, messageId).subscribe();
        }),
      ),
    { dispatch: false },
  );

  afterCreateConversation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatActions.createConversationSuccess),
        tap(({ conversation }) => {
          this.store.dispatch(ChatActions.loadConversations({}));
          this.store.dispatch(ChatActions.selectConversation({ conversationId: conversation.id }));
          this.socket.joinConversation(conversation.id);
          this.store.dispatch(ChatActions.loadMessages({ conversationId: conversation.id }));
        }),
      ),
    { dispatch: false },
  );
}
