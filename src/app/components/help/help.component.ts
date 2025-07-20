import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    // Show coming soon alert
    this.showComingSoonAlert();
  }

  private showComingSoonAlert() {
    setTimeout(() => {
      alert('❓ Help & Support - Coming Soon!\n\nWe\'re creating a comprehensive help center with tutorials, FAQs, and support resources to help you get the most out of our platform. Coming very soon!');
    }, 500);
  }
}
