import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.css'
})
export class FeaturesSectionComponent {
  @Output() getStarted = new EventEmitter<void>();

  onGetStarted() {
    this.getStarted.emit();
  }
}
