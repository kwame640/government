import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  images: string[] = [
    'assets/images/m2.png',
    'assets/images/m3.png',
    'assets/images/m5.png',
  ];
  activeIndex: number = 0;

  ngOnInit() {
    setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    }, 5000);
  }
}
