import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  menuOpen = false;
  dropdownOpen = false;
  dropdownLocked = false; // ✅ Tracks click locking

  constructor(
    private authService: AuthService,
    private router: Router,
    private eRef: ElementRef
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  /** ✅ Hover Mode */
  onHover(isOver: boolean) {
    if (!this.dropdownLocked) {
      this.dropdownOpen = isOver;
    }
  }

  /** ✅ Click locks the dropdown */
  toggleDropdown(lock: boolean) {
    this.dropdownLocked = lock ? !this.dropdownLocked : false;
    this.dropdownOpen = this.dropdownLocked || !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.dropdownOpen = false;
    this.dropdownLocked = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.dropdownLocked = false;
    }
  }
}
