import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Add this
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer';
import { NavbarComponent } from './navbar/navbar';
import { MaintenanceComponent } from './maintenance/maintenance';

@Component({
  selector: 'app-root',
  standalone: true,
  // ✅ Add CommonModule here
  imports: [CommonModule, RouterOutlet, FooterComponent, NavbarComponent, MaintenanceComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('govt');
  isMaintenanceMode = false; // Toggle for maintenance
}
