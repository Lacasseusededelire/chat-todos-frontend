import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/chat';
  private socket: Socket;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000', {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket'], // Force WebSocket pour éviter polling
    });

    this.socket.on('connect', () => console.log('Connecté à Socket.IO')); // Debug
    this.socket.on('connect_error', (err) => console.error('Erreur connexion:', err)); // Debug
    this.socket.on('receiveMessage', (message) => {
      console.log('Message reçu:', message); // Debug
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });
  }

  getMessages(chatId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${chatId}/messages`);
  }

  sendMessage(chatId: number, content: string, taskId?: number, fileUrl?: string) {
    console.log('Émission sendMessage:', { chatId, content, taskId, fileUrl }); // Debug
    this.socket.emit('sendMessage', { chatId, content, taskId, fileUrl });
  }

  sendToGemini(chatId: number, message: string) {
    console.log('Émission sendToGemini:', { chatId, message }); // Debug
    this.socket.emit('sendToGemini', { chatId, message });
  }

  joinChat(chatId: number) {
    console.log('Rejoint chat:', chatId); // Debug
    this.socket.emit('joinChat', { chatId });
  }

  setMessages(messages: any[]) {
    this.messagesSubject.next(messages);
  }
}