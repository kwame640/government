import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
})
export class ProjectComponent {
  project = {
    title: '',
    description: '',
    year: '',
  };

  years: number[] = [];
  selectedFile: File | null = null;
  projects: any[] = [];

  constructor() {
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
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageBase64 = reader.result as string;

      this.projects.push({
        title: this.project.title,
        description: this.project.description,
        year: this.project.year,
        image: imageBase64
      });

      // Clear form
      this.project = { title: '', description: '', year: '' };
      this.selectedFile = null;
    };

    reader.readAsDataURL(this.selectedFile);
  }
}
