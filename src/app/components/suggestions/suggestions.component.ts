import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    // Show coming soon alert
    this.showComingSoonAlert();
  }

  private showComingSoonAlert() {
    setTimeout(() => {
      alert('💡 Smart Suggestions - Coming Soon!\n\nWe\'re developing intelligent suggestion algorithms that will provide personalized recommendations for your business. Get ready for AI-powered insights!');
    }, 500);
  }
}
