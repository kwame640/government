import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Recheck token and update login status when service is created
    this.updateLoginStatus();
  }

  // Called during login to save user and notify status
  login(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData));
    this.isLoggedInSubject.next(true);
  }

  // Called during logout to clear data and notify status
  logout() {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
  }

  // Helper: Check if user is stored in local storage
  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }

  // Get current user object from storage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ✅ Check if user is admin based on their role
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role?.toLowerCase() === 'admin';
  }

  // Optional: Allow other components to force-refresh status
  updateLoginStatus() {
    this.isLoggedInSubject.next(this.hasToken());
  }
}
