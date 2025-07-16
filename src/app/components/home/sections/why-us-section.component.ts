import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-us-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-us-section.component.html',
  styleUrl: './why-us-section.component.css'
})
export class WhyUsSectionComponent {
  @Output() getStarted = new EventEmitter<void>();

  onGetStarted() {
    this.getStarted.emit();
  }
}
