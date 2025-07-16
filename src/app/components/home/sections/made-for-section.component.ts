import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-made-for-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './made-for-section.component.html',
  styleUrl: './made-for-section.component.css'
})
export class MadeForSectionComponent {
  @Output() getStarted = new EventEmitter<void>();

  onGetStarted() {
    this.getStarted.emit();
  }
}
