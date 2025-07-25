import { Component } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.html',
  styleUrls: ['./news.css'], // ✅ corrected from `styleUrl` to `styleUrls` (Angular expects an array)
  standalone: true // ✅ added if using standalone component setup
})
export class NewsComponent {
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
