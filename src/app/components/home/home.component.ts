import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Import section components
import { HeroSectionComponent } from './sections/hero-section.component';
import { WhyUsSectionComponent } from './sections/why-us-section.component';
import { FeaturesSectionComponent } from './sections/features-section.component';
import { PreviewSectionComponent } from './sections/preview-section.component';
import { MadeForSectionComponent } from './sections/made-for-section.component';
import { AboutUsSectionComponent } from './sections/about-us-section.component';
import { PricingSectionComponent } from './sections/pricing-section.component';
import { ContactSectionComponent } from './sections/contact-section.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeroSectionComponent,
    WhyUsSectionComponent,
    FeaturesSectionComponent,
    PreviewSectionComponent,
    MadeForSectionComponent,
    AboutUsSectionComponent,
    PricingSectionComponent,
    ContactSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private router: Router) {}

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onGetStarted() {
    // Navigate to auth page with signup tab
    this.router.navigate(['/auth'], { queryParams: { tab: 'signup' } });
  }

  onContactUs() {
    // Handle contact form or navigation
    console.log('Contact us clicked');
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.setupMadeForAnimations();
    }, 100);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, options);

    // Observe all animation elements
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => this.observer.observe(el));
  }

  private setupMadeForAnimations() {
    // Setup specific animations for Made For section
    const madeForItems = document.querySelectorAll('.made-for-item');

    const madeForObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger animations for child elements with delays
          const featurePoints = entry.target.querySelectorAll('.feature-point');
          featurePoints.forEach((point, index) => {
            setTimeout(() => {
              (point as HTMLElement).style.animationDelay = `${0.2 + index * 0.1}s`;
              point.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    madeForItems.forEach(item => madeForObserver.observe(item));

    // About Us animations
    const aboutUsItems = document.querySelectorAll('.about-us .fade-in-left, .about-us .fade-in-right');
    const aboutUsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    aboutUsItems.forEach(item => aboutUsObserver.observe(item));
  }

  onSelectPlan(plan: any) {
    console.log('Selected plan:', plan.name);
    // Navigate to auth page or handle plan selection
    this.router.navigate(['/auth']);
  }

  onSubmitContact(contactData: any) {
    console.log('Contact form submitted:', contactData);
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    alert('Thank you for your message! We\'ll get back to you soon.');
  }
}
