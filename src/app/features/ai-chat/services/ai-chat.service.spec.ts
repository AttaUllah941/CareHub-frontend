import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AiChatService } from './ai-chat.service';
import { environment } from '../../../../environments/environment';

const API = environment.apiUrl.replace(/\/$/, '');

describe('AiChatService', () => {
  let service: AiChatService;
  let http: HttpTestingController;

  const enable = (): void => {
    service.capabilities.set({ available: true, configured: true, suggestions: ['hi'] });
  };

  const reply = (overrides: object = {}) => ({
    success: true,
    data: {
      conversationId: 'c1',
      agent: 'PATIENT',
      title: 'Find a doctor',
      messageId: 'm1',
      message: 'Here you go',
      actions: [],
      createdAt: '2026-01-01T10:00:00.000Z',
      ...overrides,
    },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AiChatService);
    http = TestBed.inject(HttpTestingController);
  });

  it('does not send when the assistant is not configured', () => {
    service.capabilities.set({ available: true, configured: false });
    service.send('hello');
    http.expectNone(`${API}/ai/chat`);
    expect(service.messages()).toHaveLength(0);
  });

  it('adds the user message optimistically, then the reply, and tracks the conversation', () => {
    enable();
    service.send('  Find a cardiologist  ');

    expect(service.messages()).toHaveLength(1);
    expect(service.sending()).toBe(true);

    const req = http.expectOne(`${API}/ai/chat`);
    expect(req.request.body).toEqual({ message: 'Find a cardiologist', conversationId: null });
    req.flush(reply());

    expect(service.messages().map((m) => m.role)).toEqual(['user', 'assistant']);
    expect(service.conversationId()).toBe('c1');
    expect(service.conversations()[0].title).toBe('Find a doctor');
    expect(service.sending()).toBe(false);
  });

  it('continues the same conversation on the next message', () => {
    enable();
    service.send('first');
    http.expectOne(`${API}/ai/chat`).flush(reply());
    service.send('second');
    expect(http.expectOne(`${API}/ai/chat`).request.body.conversationId).toBe('c1');
  });

  it('marks the message as failed on error and retry resends it without duplicating', () => {
    enable();
    service.send('hello');
    http.expectOne(`${API}/ai/chat`).flush({ message: 'Too busy' }, { status: 503, statusText: 'Unavailable' });

    expect(service.messages()[0].failed).toBe(true);
    expect(service.error()).toBe('Too busy');

    service.retry();
    expect(service.messages()).toHaveLength(1);
    expect(service.messages()[0].failed).toBe(false);
    http.expectOne(`${API}/ai/chat`).flush(reply());
    expect(service.messages()).toHaveLength(2);
  });

  it('ignores a late reply after the user starts a new chat', () => {
    enable();
    service.send('hello');
    const req = http.expectOne(`${API}/ai/chat`);
    service.newChat();
    req.flush(reply());

    expect(service.messages()).toHaveLength(0);
    expect(service.conversationId()).toBeNull();
  });

  it('confirms an action once and appends the server message', () => {
    enable();
    service.confirmAction('a1');
    service.confirmAction('a1'); // double click is ignored while in flight

    const req = http.expectOne(`${API}/ai/actions/a1/confirm`);
    expect(service.actionStates()['a1'].status).toBe('confirming');
    req.flush({
      data: {
        conversationId: 'c1',
        status: 'executed',
        message: { id: 'm2', role: 'assistant', content: 'Booked', actions: [], createdAt: '2026-01-01T10:01:00.000Z' },
      },
    });

    expect(service.actionStates()['a1'].status).toBe('done');
    expect(service.messages().at(-1)?.content).toBe('Booked');
  });

  it('surfaces a confirmation failure on the card', () => {
    enable();
    service.confirmAction('a2');
    http.expectOne(`${API}/ai/actions/a2/confirm`).flush({ message: 'Expired' }, { status: 400, statusText: 'Bad Request' });
    expect(service.actionStates()['a2']).toEqual({ status: 'error', error: 'Expired' });
  });

  it('clears everything on sign-out so chats never leak between users', () => {
    enable();
    service.send('private');
    http.expectOne(`${API}/ai/chat`).flush(reply());
    service.reset();

    expect(service.messages()).toHaveLength(0);
    expect(service.conversations()).toHaveLength(0);
    expect(service.capabilities()).toBeNull();
    expect(service.isOpen()).toBe(false);
  });
});
