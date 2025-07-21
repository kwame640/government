import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Accept full user data and save it to localStorage
  login(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData));
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }

  // Retrieve and parse the user object
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
