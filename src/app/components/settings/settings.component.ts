import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    // Show coming soon alert
    this.showComingSoonAlert();
  }

  private showComingSoonAlert() {
    setTimeout(() => {
      alert('⚙️ Settings - Coming Soon!\n\nWe\'re building a comprehensive settings panel where you can customize your experience, manage preferences, and configure system options. Stay tuned!');
    }, 500);
  }
}
