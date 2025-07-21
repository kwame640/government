import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
})
export class ProjectComponent {
  project = { title: '', description: '', year: '' };
  years: number[] = [];
  selectedFile: File | null = null;
  projects: any[] = [];

  constructor(private http: HttpClient) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 20; i--) {
      this.years.push(i);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  onSubmit() {
    if (!this.selectedFile || !this.project.title || !this.project.description || !this.project.year) {
      alert('Please fill all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.project.title);
    formData.append('description', this.project.description);
    formData.append('year', this.project.year);
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8000/api/upload.php', formData).subscribe({
      next: (res: any) => {
        alert('Project uploaded!');
        // Optional: Push project to the local list if needed
        this.projects.push({
          ...this.project,
          image: URL.createObjectURL(this.selectedFile!)
        });
        this.project = { title: '', description: '', year: '' };
        this.selectedFile = null;
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed. Check console.');
      }
    });
  }
}
