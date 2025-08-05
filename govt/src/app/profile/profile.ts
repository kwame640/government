import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environments';

// ✅ Import the loading component
import { LoadingComponent } from '../loading/loading'; // adjust this path to match your project

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    LoadingComponent // ✅ added here
  ],
  providers: [AuthService],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  isLoading = true;

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

    setTimeout(() => {
      this.http.get(`${environment.siteUrl}/api/profile.php`, {
        params: { email: this.user.email }
      }).subscribe({
        next: (data) => {
          this.user = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Profile error:', err);
          this.isLoading = false;
        }
      });
    }, 5000); // 5 seconds delay to simulate loading
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
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      alert('All fields are required!');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    if (!this.isPasswordStrong(this.newPassword)) {
      alert(
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    if (this.oldPassword === this.newPassword) {
      alert('New password cannot be the same as the old password!');
      return;
    }

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
