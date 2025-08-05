import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../loading/loading';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-executive',
  standalone: true,
  imports: [LoadingComponent, CommonModule],
  templateUrl: './executive.html',
  styleUrls: ['./executive.css']
})
export class ExecutiveComponent implements OnInit {
  isLoading: boolean = true;

  ngOnInit(): void {
    // ⏳ Show loading for 5 seconds
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }
}
