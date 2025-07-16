import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent {
  @Output() getStarted = new EventEmitter<void>();
  @Output() scrollToSection = new EventEmitter<string>();

  onGetStarted() {
    this.getStarted.emit();
  }

  onScrollToSection(sectionId: string) {
    this.scrollToSection.emit(sectionId);
  }
}
