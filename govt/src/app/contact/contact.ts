import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environments';
import { LoadingComponent } from '../loading/loading';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LoadingComponent],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent implements OnInit {
  isLoading: boolean = true;

  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';
  submitting: boolean = false;
  success: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Simulate loading for 5 seconds
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }

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
