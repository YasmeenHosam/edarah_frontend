import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  @Output() loadingComplete = new EventEmitter<void>();
  
  isVisible = true;
  logoLoaded = false;
  textVisible = false;
  isExiting = false;
  
  private loadingDuration = 1500; // Exactly 1.5 seconds
  private startTime = 0;
  private contentReadyTime = 0;
  private timeoutId?: number;

  ngOnInit() {
    this.startTime = Date.now();
    this.initializeLoadingSequence();
    this.simulateContentLoading();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private initializeLoadingSequence() {
    // Logo fade in with scale effect
    setTimeout(() => {
      this.logoLoaded = true;
    }, 100);

    // Loading text appears after logo
    setTimeout(() => {
      this.textVisible = true;
    }, 500);
  }

  private simulateContentLoading() {
    // Set exact loading duration of 1.5 seconds
    this.timeoutId = window.setTimeout(() => {
      this.hideLoadingScreen();
    }, this.loadingDuration);
  }

  // Removed checkIfReadyToHide method as we now use fixed duration

  private hideLoadingScreen() {
    this.isExiting = true;
    
    // Wait for exit animation to complete
    setTimeout(() => {
      this.isVisible = false;
      this.loadingComplete.emit();
    }, 400); // Exit animation duration
  }

  // Method to be called when actual content is ready (for real implementation)
  // Note: With fixed 1.5s duration, this method doesn't affect timing
  onContentReady() {
    this.contentReadyTime = Date.now();
    // Content ready signal received, but loading screen will still show for full 1.5s
  }
}
