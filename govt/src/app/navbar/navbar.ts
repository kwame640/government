import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ ADD THIS

@Component({
  selector: 'app-navbar',
  standalone: true, // ✅ Ensure it's standalone
  imports: [CommonModule, RouterModule], // ✅ Include CommonModule here
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  menuOpen = false;
}
