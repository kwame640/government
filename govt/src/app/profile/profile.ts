import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, provideHttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule], // ✅ add modules used
  providers: [AuthService], // ✅ needed only if not using `providedIn: 'root'`
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;

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

    this.http.get(`http://localhost:8000/api/profile.php`, {
      params: { email: this.user.email }
    }).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Profile error:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
