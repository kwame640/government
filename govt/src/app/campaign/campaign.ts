import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading'; // ✅ Make sure this path is correct

@Component({
  selector: 'app-campaign',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './campaign.html',
  styleUrls: ['./campaign.css'] // ✅ Corrected "styleUrl" to "styleUrls"
})
export class CampaignComponent implements OnInit {
  isLoading = true;

  ngOnInit(): void {
    // Simulate loading delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1500); // 1.5 seconds
  }
}