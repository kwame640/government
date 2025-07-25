import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';
  submitting: boolean = false;
  success: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  submitContact() {
    this.submitting = true;
    this.success = '';
    this.error = '';
    const payload = {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message
    };
    this.http.post<any>(`${environment.siteUrl}/api/contact_submit.php`, payload).subscribe({
      next: (res) => {
        this.success = res.message || 'Message sent successfully.';
        this.name = '';
        this.email = '';
        this.subject = '';
        this.message = '';
        this.submitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to send message.';
        this.submitting = false;
      }
    });
  }
}
