import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-forget',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './forget.html',
  styleUrls: ['./forget.css']
})
export class ForgetComponent {
  email = '';
  message = '';
  error = '';
  isLoading = false; // ✅ show loading state

  constructor(private http: HttpClient) {}

  submit(): void {
    // ✅ Basic email validation before calling API
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      this.message = '';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.message = '';

    this.http.post<{ success: boolean; message: string }>(
      `${environment.siteUrl}/api/forgot_password.php`,
      { email: this.email }
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.message = res.message;
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error:', err);
        this.error = 'Something went wrong. Please try again.';
      }
    });
  }
}
