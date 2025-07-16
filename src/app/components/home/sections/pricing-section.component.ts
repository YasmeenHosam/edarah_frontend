import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  negativeFeatures?: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonClass: string;
}

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-section.component.html',
  styleUrl: './pricing-section.component.css'
})
export class PricingSectionComponent {
  @Output() selectPlan = new EventEmitter<PricingPlan>();

  pricingPlans: PricingPlan[] = [
    {
      name: 'Free Plan',
      price: 'Free',
      period: '',
      description: 'Perfect for small stores testing smart recommendations',
      features: [
        'Basic product recommendations',
        'Limited AI insights',
        'Alerts for risky products (basic)',
        'Access to dashboard'
      ],
      negativeFeatures: [
        'No AI assistant',
        'No advanced price suggestions',
        'No integrations'
      ],
      buttonText: 'Start Free Plan',
      buttonClass: 'btn-outline'
    },
    {
      name: 'Pro Plan',
      price: '$29',
      period: '/month',
      description: 'Advanced insights to grow your sales and profits',
      features: [
        'Detailed pricing suggestions',
        'AI assistant to guide your decisions',
        'Risk alerts for products losing money',
        'Smart promotional recommendations',
        'Access to dashboard & insights'
      ],
      negativeFeatures: [
        'No API access',
        'No store platform integrations'
      ],
      isPopular: true,
      buttonText: 'Get Pro Plan',
      buttonClass: 'btn-primary'
    },
    {
      name: 'Business Plan',
      price: '$70',
      period: '/month',
      description: 'Full control, automation, and advanced data tools',
      features: [
        'All Pro features',
        'API access for automation',
        'Automatic integration to store',
        'Advanced reporting & CSV export',
        'Priority support'
      ],
      negativeFeatures: [],
      buttonText: 'Get Pro Plan',
      buttonClass: 'btn-outline'
    }
  ];

  onSelectPlan(plan: PricingPlan) {
    this.selectPlan.emit(plan);
  }
}
