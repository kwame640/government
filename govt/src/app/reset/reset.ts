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

  showNewPassword = false;
  showConfirmPassword = false;
  isToggling = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  togglePassword(field: 'new' | 'confirm') {
    if (this.isToggling) return;
    this.isToggling = true;

    if (field === 'new') {
      this.showNewPassword = true;
      setTimeout(() => {
        this.showNewPassword = false;
        this.isToggling = false;
      }, 3000);
    } else {
      this.showConfirmPassword = true;
      setTimeout(() => {
        this.showConfirmPassword = false;
        this.isToggling = false;
      }, 3000);
    }
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
