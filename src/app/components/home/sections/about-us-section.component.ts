import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us-section.component.html',
  styleUrl: './about-us-section.component.css'
})
export class AboutUsSectionComponent {
  showMore = false;

  toggleReadMore() {
    this.showMore = !this.showMore;
  }
}
