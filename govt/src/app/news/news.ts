import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading'; // Make sure this path is correct

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './news.html',
  styleUrls: ['./news.css']
})
export class NewsComponent implements OnInit {
  isLoading: boolean = true;

  ngOnInit(): void {
    // Simulate loading for 5 seconds
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }

  toggleReadMore(event: Event) {
    const button = event.target as HTMLElement;
    const moreText = button.previousElementSibling as HTMLElement;

    if (moreText.classList.contains('hidden')) {
      moreText.classList.remove('hidden');
      button.textContent = 'Read Less ↑';
    } else {
      moreText.classList.add('hidden');
      button.textContent = 'Read More →';
    }
  }
}
