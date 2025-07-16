import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-section.component.html',
  styleUrl: './preview-section.component.css'
})
export class PreviewSectionComponent {
  @Output() getStarted = new EventEmitter<void>();

  onGetStarted() {
    this.getStarted.emit();
  }
}
