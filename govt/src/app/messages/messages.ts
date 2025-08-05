import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environments';
import { LoadingComponent } from '../loading/loading';  

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
  imports: [CommonModule, HttpClientModule, LoadingComponent],
  templateUrl: './messages.html',
  styleUrls: ['./messages.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Start loading state
    setTimeout(() => {
      this.loadMessages();
    }, 5000); // Simulate 5-second delay
  }

  loadMessages(): void {
    this.http
      .get<{ success: boolean; messages: Message[]; error?: string }>(
        `${environment.siteUrl}/api/get_messages.php`
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.messages = res.messages;
          } else {
            this.errorMessage = res.error || 'Failed to fetch messages.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error fetching messages:', err);
          this.errorMessage = 'Could not load messages.';
        }
      });
  }

  deleteMessage(id: number): void {
    if (!confirm('Are you sure you want to delete this message?')) return;

    this.http
      .post<{ success: boolean; error?: string }>(
        `${environment.siteUrl}/api/delete_message.php`,
        { id }
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.messages = this.messages.filter((m) => m.id !== id);
          } else {
            alert(res.error || 'Failed to delete message.');
          }
        },
        error: (err) => {
          console.error('Error deleting message:', err);
          alert('Something went wrong.');
        }
      });
  }
}
