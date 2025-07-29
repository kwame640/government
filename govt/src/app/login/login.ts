import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  formData = {
    email: '',
    password: ''
  };

  showPassword = false;

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    fetch(`${environment.siteUrl}/api/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.authService.login({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role
          });
          alert(data.message || '✅ Login successful!');
          this.router.navigate(['/dashboard']);
        } else {
          alert(data.message || '❌ Login failed.');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('Something went wrong.');
      });
  }
}
