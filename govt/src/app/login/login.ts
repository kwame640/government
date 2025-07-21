import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth'; // Adjust path as needed

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

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    fetch('http://localhost:8000/api/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message || '✅ Login successful!');

        // ✅ Pass full user object to login()
        this.authService.login({
          id: data.id,
          name: data.name,
          email: data.email
        });

        this.router.navigate(['/dashboard']);
      } else {
        alert(data.message || '❌ Login failed.');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Something went wrong.');
    });
  }
}
