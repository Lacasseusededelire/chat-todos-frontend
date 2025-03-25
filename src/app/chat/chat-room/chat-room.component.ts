import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {
  @Input() chatId!: number;
  messages: any[] = [];
  messageForm: FormGroup;
  currentUserId: number | null;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  showEmojiPicker = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private chatService: ChatService,
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required],
    });
    this.currentUserId = this.authService.getCurrentUserId();
  }

  ngOnInit() {
    if (!this.chatId) {
      console.error('Chat ID manquant');
      return;
    }
    this.chatService.joinChat(this.chatId);
    this.chatService.getMessages(this.chatId).subscribe({
      next: (data) => {
        this.messages = data;
        this.chatService.setMessages(data);
      },
      error: (err) => console.error('Erreur chargement messages:', err),
    });
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
      console.log('Messages mis à jour:', messages);
    });
  }

  sendMessage(fileUrl?: string) {
    if (this.messageForm.valid || fileUrl) {
      const content = this.messageForm.value.content || '';
      console.log('Envoi message:', content, fileUrl);
      this.chatService.sendMessage(this.chatId, content, undefined, fileUrl);
      this.messageForm.reset();
    } else {
      console.warn('Formulaire invalide');
    }
  }

  sendToGemini() {
    if (this.messageForm.valid) {
      const content = this.messageForm.value.content;
      console.log('Envoi à Gemini:', content);
      this.chatService.sendToGemini(this.chatId, content);
      this.messageForm.reset();
    } else {
      console.warn('Formulaire invalide');
    }
  }

  isCurrentUser(message: any): boolean {
    if (this.currentUserId === null) return false;
    return message.sender?.id === this.currentUserId;
  }

  getUserColor(userId: number): string {
    const colors = [
      '#FFD1DC',
      '#D4A5A5',
      '#AEC6CF',
      '#C3E6CB',
      '#F5C6CB',
    ];
    return colors[userId % colors.length];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      this.http.post('http://localhost:3000/chat/upload', formData).subscribe({
        next: (res: any) => {
          const fileUrl = `http://localhost:3000${res.fileUrl}`; // Ajout de l'URL complète
          console.log('Fichier uploadé, URL:', fileUrl);
          this.sendMessage(fileUrl);
        },
        error: (err) => console.error('Erreur upload fichier:', err),
      });
    }
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = event => this.audioChunks.push(event.data);
      this.mediaRecorder.onstop = () => this.saveAudio();
      this.mediaRecorder.start();
      this.isRecording = true;
    }).catch(err => console.error('Erreur enregistrement:', err));
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.isRecording = false;
    }
  }

  saveAudio() {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    this.http.post('http://localhost:3000/chat/upload', formData).subscribe({
      next: (res: any) => {
        const fileUrl = `http://localhost:3000${res.fileUrl}`; // Ajout de l'URL complète
        console.log('Audio uploadé, URL:', fileUrl);
        this.sendMessage(fileUrl);
      },
      error: (err) => console.error('Erreur upload audio:', err),
    });
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string) {
    const currentContent = this.messageForm.get('content')?.value || '';
    this.messageForm.get('content')?.setValue(currentContent + emoji);
    this.showEmojiPicker = false;
  }

  getFileType(fileUrl: string | undefined): string {
    if (!fileUrl) return 'file';
    const ext = fileUrl.split('.').pop()?.toLowerCase();
    if (!ext) return 'file';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['mp4', 'webm'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'webm', 'ogg'].includes(ext)) return 'audio';
    if (ext === 'pdf') return 'pdf';
    return 'file';
  }
}