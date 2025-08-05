import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent implements OnInit {
  isLoading = true;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 5000); // ⏳ show loading for 5 seconds
  }
}
