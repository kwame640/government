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
    if (!this.email || !this.email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    const payload = { email: this.email };
    console.log('Sending payload:', payload);

    this.http.post<any>('http://localhost:8000/api/newsletter_subscribe.php', payload).subscribe({
      next: (res) => {
        console.log('Subscription successful:', res);

        if (res.success) {
          this.submitted = true;
          this.error = false;
          this.email = '';

          // ✅ Hide success message after 5 seconds
          setTimeout(() => {
            this.submitted = false;
          }, 5000);
        } else {
          this.error = true;

          // ✅ Hide error message after 5 seconds
          setTimeout(() => {
            this.error = false;
          }, 5000);
        }
      },
      error: (err) => {
        console.error('Subscription failed:', err);
        this.error = true;
        this.submitted = false;

        // ✅ Hide error message after 5 seconds
        setTimeout(() => {
          this.error = false;
        }, 5000);
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

        // ✅ Hide error message after 5 seconds
        setTimeout(() => {
          this.error = false;
        }, 5000);
      }
    });
  }
}
