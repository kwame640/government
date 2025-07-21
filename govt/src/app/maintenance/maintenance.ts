// src/app/maintenance/maintenance.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  standalone: true, // ✅ IMPORTANT
  templateUrl: './maintenance.html',
  styleUrls: ['./maintenance.css'] // ✅ Corrected to plural
})
export class MaintenanceComponent {}
