import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environments';
import { LoadingComponent } from '../loading/loading';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, LoadingComponent],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
})
export class ProjectComponent implements OnInit {
  project = { title: '', description: '', year: '' };
  years: number[] = [];
  selectedFile: File | null = null;
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize years and simulate loading
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 20; i--) {
      this.years.push(i);
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (!this.selectedFile || !this.project.title || !this.project.description || !this.project.year) {
      alert('Please fill all fields and select a file.');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('title', this.project.title);
    formData.append('description', this.project.description);
    formData.append('year', this.project.year);
    formData.append('file', this.selectedFile);

    this.http.post(`${environment.siteUrl}/upload.php`, formData).subscribe({
      next: () => {
        alert('Project uploaded!');
        this.project = { title: '', description: '', year: '' };
        this.selectedFile = null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed. Check console.');
        this.isLoading = false;
      }
    });
  }
}
