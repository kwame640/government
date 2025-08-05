import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environments';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../loading/loading';

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
  imports: [RouterModule, HttpClientModule, CommonModule, FormsModule, LoadingComponent],
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
  isLoading: boolean = true; // ✅ show loader initially

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
  this.isLoading = true; // ✅ Show loading spinner

  // ⏳ Simulate 5 seconds (5000ms) delay
  setTimeout(() => {
    this.http.get<Project[]>(`${environment.siteUrl}/api/get_projects.php`)
      .subscribe({
        next: data => {
          this.projects = data;
          this.isLoading = false; // ✅ Stop loading after data is fetched
        },
        error: err => {
          console.error('Failed to load projects', err);
          this.isLoading = false; // ✅ Stop loading even on error
        }
      });
  }, 5000); // ✅ 5 seconds
}

  filteredProjects(): Project[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.projects.filter(project =>
      (project.title?.toLowerCase() ?? '').includes(term) ||
      (project.year?.toString() ?? '').includes(term)
    );
  }

  toggleReadMore(title: string) {
    if (this.expandedProjects.has(title)) {
      this.expandedProjects.delete(title);
    } else {
      this.expandedProjects.add(title);
    }
  }

  isExpanded(title: string): boolean {
    return this.expandedProjects.has(title);
  }

  getShortDescription(description: string, title: string): string {
    const maxLength = 100;
    if (this.isExpanded(title) || description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }
}
