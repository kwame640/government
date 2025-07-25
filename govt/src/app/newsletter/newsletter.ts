import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './newsletter.html',
  styleUrls: ['./newsletter.css']
})
export class NewsletterComponent implements OnInit {
  email: string = '';
  submitted: boolean = false;
  error: boolean = false;

  updates: string[] = [];
  showUpdates: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  subscribe(): void {
    // ✅ Basic email format check
    if (!this.email || !this.email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    const payload = { email: this.email };
    console.log('Sending payload:', payload);

    this.http.post<any>('http://localhost:8000/api/newsletter_subscribe.php', payload).subscribe({
      next: (res) => {
        console.log('Subscription successful:', res);
        this.submitted = true;
        this.error = false;
        this.email = '';
      },
      error: (err) => {
        console.error('Subscription failed:', err);
        this.error = true;
        this.submitted = false;
      }
    });
  }

  loadUpdates(): void {
    this.http.get<any[]>('http://localhost:8000/api/newsletter_list.php').subscribe({
      next: (data) => {
        console.log('Loaded updates:', data);
        this.updates = data.map(d => d.email);
        this.showUpdates = true;
      },
      error: (err) => {
        console.error('Failed to load updates:', err);
        this.error = true;
      }
    });
  }
}
