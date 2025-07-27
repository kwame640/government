import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environments'; // Adjust path if needed

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './messages.html',
  styleUrls: ['./messages.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.http.get<{ success: boolean; messages: Message[]; error?: string }>(
      `${environment.siteUrl}/api/get_messages.php`
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.messages = res.messages;
        } else {
          this.errorMessage = res.error || 'Failed to fetch messages.';
        }
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
        this.errorMessage = 'Could not load messages.';
      }
    });
  }
}
