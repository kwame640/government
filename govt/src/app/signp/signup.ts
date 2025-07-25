import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environments'; // Adjust path if needed

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  // Two-way bound form data
  formData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const url = `${environment.siteUrl}/api/register.php`;

    this.http.post<any>(url, this.formData).subscribe({
      next: (data) => {
        alert(data.message || 'Registered!');
        if (data.success) {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
        alert('Something went wrong.');
      }
    });
  }
}
