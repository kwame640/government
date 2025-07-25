import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './member.html',
  styleUrls: ['./member.css']
})
export class MemberComponent implements OnInit {
  users: any[] = [];
  adminEmail: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('user_email');
    if (storedEmail) {
      this.adminEmail = storedEmail;
      this.fetchUsers();
    } else {
      this.errorMessage = 'Admin email not found in local storage.';
    }
  }

  // Fetch all users from the backend
  fetchUsers(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.siteUrl}/api/get_users.php`)
      .subscribe({
        next: (data) => {
          this.users = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to fetch users:', err);
          this.errorMessage = 'Failed to load users.';
          this.isLoading = false;
        }
      });
  }

  // Promote a user to admin
  promoteToAdmin(userId: number): void {
    if (!this.adminEmail) {
      alert('Admin email is not available.');
      return;
    }

    const body = {
      admin_email: this.adminEmail,
      user_id: userId
    };

    this.http.post<any>(`${environment.siteUrl}/api/make_admin.php`, body)
      .subscribe({
        next: (response) => {
          if (response.success) {
            alert(response.message);
            this.fetchUsers(); // Refresh the user list after promotion
          } else {
            alert(response.message || 'Something went wrong');
          }
        },
        error: (err) => {
          console.error('Promotion failed:', err);
          alert('Failed to promote user.');
        }
      });
  }

  // Optional: Format status for display
  getStatusLabel(status: string): string {
    return status === 'pending' ? '⏳ Pending' :
           status === 'approved' ? '✅ Approved' :
           status;
  }

  // Optional: Check if the user is promotable
  canPromote(user: any): boolean {
    return user.role !== 'admin' && user.status !== 'approved';
  }
}
