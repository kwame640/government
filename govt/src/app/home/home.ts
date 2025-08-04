import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environments';
import { FormsModule } from '@angular/forms';

interface Project {
  title: string;
  year: number;
  image: string;
  description: string;
  [key: string]: any;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  images: string[] = [
    'assets/images/m2.jpg',
    'assets/images/m3.png',
    'assets/images/m5.png',
  ];
  activeIndex: number = 0;
  projects: Project[] = [];
  searchTerm: string = '';

  // ✅ Track multiple expanded projects
  expandedProjects = new Set<string>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.startImageSlider();
    this.loadProjects();
  }

  startImageSlider() {
    setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    }, 5000);
  }

  loadProjects() {
    this.http.get<Project[]>(`${environment.siteUrl}/api/get_projects.php`)
      .subscribe({
        next: data => {
          console.log('Fetched projects:', data);
          this.projects = data;
        },
        error: err => {
          console.error('Failed to load projects', err);
        }
      });
  }

  filteredProjects(): Project[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.projects.filter(project =>
      (project.title?.toLowerCase() ?? '').includes(term) ||
      (project.year?.toString() ?? '').includes(term)
    );
  }

  // ✅ Toggle single project expansion without affecting others
  toggleReadMore(title: string) {
    if (this.expandedProjects.has(title)) {
      this.expandedProjects.delete(title);
    } else {
      this.expandedProjects.add(title);
    }
  }

  // ✅ Check if project is expanded
  isExpanded(title: string): boolean {
    return this.expandedProjects.has(title);
  }

  // ✅ Show full or trimmed description
  getShortDescription(description: string, title: string): string {
    const maxLength = 100;
    if (this.isExpanded(title) || description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }
}
