import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  providers: [AuthService],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Password toggle
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get(`${environment.siteUrl}/api/profile.php`, {
      params: { email: this.user.email }
    }).subscribe({
      next: (data) => (this.user = data),
      error: (err: any) => console.error('Profile error:', err)
    });
  }

  togglePassword(field: string) {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private isPasswordStrong(password: string): boolean {
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  changePassword() {
    // Ensure all fields filled
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      alert('All fields are required!');
      return;
    }

    // Confirm password match
    if (this.newPassword !== this.confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    // Strong password check
    if (!this.isPasswordStrong(this.newPassword)) {
      alert(
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    // Prevent old == new
    if (this.oldPassword === this.newPassword) {
      alert('New password cannot be the same as the old password!');
      return;
    }

    // Send update request
    this.http
      .post<any>(`${environment.siteUrl}/api/change_password.php`, {
        email: this.user.email,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      })
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            alert('Password updated successfully!');
            this.oldPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
          } else {
            alert(res.error || 'Password update failed.');
          }
        },
        error: (err: any) => {
          console.error('Error updating password:', err);
          alert('Something went wrong.');
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
