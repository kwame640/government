import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environments';
import { LoadingComponent } from '../loading/loading'; // 👈 Import your reusable loading spinner

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserResponse {
  users?: User[];
  message?: string;
}

interface ActionResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, LoadingComponent], // 👈 Register component here
  templateUrl: './member.html',
  styleUrls: ['./member.css']
})
export class MemberComponent implements OnInit {
  users: User[] = [];
  adminEmail = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  isAddUserModalOpen = false;
  newUser = { name: '', email: '', password: '', role: 'viewer' };

  constructor(private http: HttpClient) {}

 ngOnInit(): void {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    this.adminEmail = user.email.trim().toLowerCase();
    console.info('🔍 Admin email used for fetch:', this.adminEmail);

    // 👇 Start loading and delay fetchUsers by 5 seconds
    this.isLoading = true;
    setTimeout(() => {
      this.fetchUsers();
    }, 5000); // 5 seconds delay
  } else {
    this.errorMessage = '⚠️ User not found in local storage.';
    console.warn('🚫 No user object found in localStorage.');
  }
}

  fetchUsers(): void {
    this.resetMessages();
    this.isLoading = true;

    const apiUrl = `${environment.siteUrl}/api/get_users.php`;
    const payload = { admin_email: this.adminEmail };

    console.log('📡 Requesting users from:', apiUrl);
    console.log('📤 Payload:', payload);

    this.http.post<UserResponse>(apiUrl, payload).subscribe({
      next: (response) => {
        console.log('📦 Server response:', response);
        const fetchedUsers = response.users || [];
        this.users = fetchedUsers.filter(user => user.role !== 'admin');
        console.info(`✅ Loaded ${this.users.length} non-admin user(s).`);
      },
      error: (error) => {
        console.error('❌ API error during fetchUsers():', error);
        this.errorMessage = '❌ Failed to fetch users.';
        this.users = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  promoteToAdmin(userId: number): void {
    if (!this.ensureAdminEmail()) return;

    const apiUrl = `${environment.siteUrl}/api/make_admin.php`;
    const payload = { admin_email: this.adminEmail, user_id: userId };

    console.log('🚀 Promoting user with payload:', payload);

    this.http.post<ActionResponse>(apiUrl, payload).subscribe({
      next: (response) => {
        console.log('✅ Promotion response:', response);
        if (response.success) {
          this.successMessage = `✅ ${response.message}`;
          this.fetchUsers();
        } else {
          alert(response.message || '⚠️ Could not promote user.');
        }
      },
      error: (err) => {
        console.error('❌ Error promoting user:', err);
        alert('❌ Failed to promote user.');
      }
    });
  }

  deleteUser(userId: number): void {
    if (!this.ensureAdminEmail()) return;
    if (!confirm('❗ Are you sure you want to delete this user?')) return;

    const apiUrl = `${environment.siteUrl}/api/delete_user.php`;
    const payload = { admin_email: this.adminEmail, user_id: userId };

    console.log('🗑️ Deleting user with payload:', payload);

    this.http.post<ActionResponse>(apiUrl, payload).subscribe({
      next: (response) => {
        console.log('🗑️ Delete response:', response);
        if (response.success) {
          this.successMessage = `🗑️ ${response.message}`;
          this.fetchUsers();
        } else {
          alert(response.message || '⚠️ Could not delete user.');
        }
      },
      error: (err) => {
        console.error('❌ Error deleting user:', err);
        alert('❌ Failed to delete user.');
      }
    });
  }

  openAddUserModal(): void {
    this.isAddUserModalOpen = true;
  }

  closeAddUserModal(): void {
    this.isAddUserModalOpen = false;
    this.newUser = { name: '', email: '', password: '', role: 'viewer' };
  }

  addUser(): void {
    if (!this.ensureAdminEmail()) return;

    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      alert('⚠️ All fields are required.');
      return;
    }

    const apiUrl = `${environment.siteUrl}/api/add_user.php`;
    const payload = { admin_email: this.adminEmail, ...this.newUser };

    console.log('➕ Adding user with payload:', payload);

    this.http.post<ActionResponse>(apiUrl, payload).subscribe({
      next: (response) => {
        console.log('✅ Add User response:', response);
        if (response.success) {
          this.successMessage = `✅ ${response.message}`;
          this.fetchUsers();
          this.closeAddUserModal();
        } else {
          alert(response.message || '⚠️ Could not add user.');
        }
      },
      error: (err) => {
        console.error('❌ Error adding user:', err);
        alert('❌ Failed to add user.');
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'approved': return '✅ Approved';
      default: return status;
    }
  }

  canPromote(user: User): boolean {
    return user.role !== 'admin' && user.status === 'pending';
  }

  private ensureAdminEmail(): boolean {
    if (!this.adminEmail) {
      alert('⚠️ Admin email is not available.');
      return false;
    }
    return true;
  }

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
