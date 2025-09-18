// services/realtimeService.ts

// This is a mock realtime service.
// In a real application, this would use WebSockets, Socket.IO, or a service like Firebase Realtime Database.

type Callback = (data: any) => void;

class RealtimeService {
  private listeners: { [event: string]: Callback[] } = {};

  subscribe(event: string, callback: Callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    console.log(`Subscribed to event: ${event}`);
  }

  unsubscribe(event: string, callback: Callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      console.log(`Unsubscribed from event: ${event}`);
    }
  }

  // Method to simulate a server-pushed event
  mockPush(event: string, data: any) {
    console.log(`Mock pushing event: ${event}`, data);
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Simulate receiving a new message
  simulateNewMessage(conversationId: string, message: any) {
    this.mockPush(`new-message:${conversationId}`, message);
    this.mockPush('new-message', message); // Global event
  }
}

export const realtimeService = new RealtimeService();
