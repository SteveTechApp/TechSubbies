import { API_BASE_URL } from './apiConfig';

type Callback = (data: any) => void;

const SERVER_EVENTS = [
  'realtime.connected',
  'message.created',
  'conversation.updated',
  'conversation.read',
  'notification.created',
  'notification.read',
] as const;

class RealtimeService {
  private listeners: Record<string, Callback[]> = {};
  private source: EventSource | null = null;

  subscribe(event: string, callback: Callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  unsubscribe(event: string, callback: Callback) {
    this.listeners[event] = (this.listeners[event] || []).filter(cb => cb !== callback);
  }

  connect() {
    if (this.source || typeof EventSource === 'undefined') return;
    const source = new EventSource(`${API_BASE_URL}/realtime/events`, { withCredentials: true });
    this.source = source;

    for (const eventName of SERVER_EVENTS) {
      source.addEventListener(eventName, (event: MessageEvent) => {
        try {
          this.emit(eventName, JSON.parse(event.data));
        } catch {
          this.emit('realtime.error', { error: 'Invalid realtime event payload.' });
        }
      });
    }
    source.onerror = () => this.emit('realtime.error', { error: 'Realtime connection interrupted.' });
  }

  disconnect() {
    this.source?.close();
    this.source = null;
  }

  private emit(event: string, data: any) {
    for (const callback of this.listeners[event] || []) callback(data);
  }

  // Retained for local/demo-only paths that do not have a backend session.
  mockPush(event: string, data: any) {
    this.emit(event, data);
  }

  simulateNewMessage(conversationId: string, message: any) {
    this.emit(`new-message:${conversationId}`, message);
    this.emit('new-message', message);
  }
}

export const realtimeService = new RealtimeService();
