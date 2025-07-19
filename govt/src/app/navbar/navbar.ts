import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  // This component can be used to create a navigation bar for the application.
  // It can include links to different routes defined in the app.routes.ts file.
  // For example, links to 'signp' and 'news' components can be added here.

}
