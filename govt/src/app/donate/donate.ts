import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceComponent } from '../maintenance/maintenance';

@Component({
  selector: 'app-donate',
  imports: [CommonModule, MaintenanceComponent],
  templateUrl: './donate.html',
  styleUrls: ['./donate.css']
})
export class DonateComponent {

}
