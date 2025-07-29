import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reset.html',
  styleUrls: ['./reset.css']
})
export class ResetComponent {
  newPassword = '';
  confirmPassword = '';
  token = '';
  message = '';
  error = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    // ✅ Get token from query string
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  submit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      this.message = '';
      return;
    }

    this.http.post<any>(`${environment.siteUrl}/api/reset_password.php`, {
      token: this.token,
      password: this.newPassword
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = res.message;
          this.error = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.error = res.message;
          this.message = '';
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Something went wrong.';
      }
    });
  }
}
