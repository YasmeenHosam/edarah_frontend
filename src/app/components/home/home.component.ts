import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonClass: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  features: Feature[] = [
    {
      icon: 'brain',
      title: 'Advanced AI Models',
      description: 'Access cutting-edge AI models for various tasks including text generation, image processing, and data analysis.'
    },
    {
      icon: 'zap',
      title: 'Lightning Fast',
      description: 'Get results in seconds with our optimized infrastructure and high-performance computing resources.'
    },
    {
      icon: 'shield',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy measures. We never store your sensitive information.'
    },
    {
      icon: 'code',
      title: 'Easy Integration',
      description: 'Simple APIs and SDKs make it easy to integrate our AI services into your existing applications and workflows.'
    },
    {
      icon: 'users',
      title: 'Team Collaboration',
      description: 'Work together with your team members, share projects, and manage access controls efficiently.'
    },
    {
      icon: 'chart',
      title: 'Analytics & Insights',
      description: 'Track usage, monitor performance, and gain insights into your AI-powered applications with detailed analytics.'
    }
  ];

  pricingPlans: PricingPlan[] = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals and small projects',
      features: [
        '10,000 API calls/month',
        'Basic AI models',
        'Email support',
        'Standard processing speed',
        'Basic analytics'
      ],
      buttonText: 'Get Started',
      buttonClass: 'btn-outline'
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing businesses and teams',
      features: [
        '100,000 API calls/month',
        'Advanced AI models',
        'Priority support',
        'Fast processing speed',
        'Advanced analytics',
        'Team collaboration',
        'Custom integrations'
      ],
      isPopular: true,
      buttonText: 'Start Free Trial',
      buttonClass: 'btn-primary'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with specific needs',
      features: [
        'Unlimited API calls',
        'All AI models',
        'Dedicated support',
        'Fastest processing',
        'Custom analytics',
        'Advanced team features',
        'On-premise deployment',
        'SLA guarantee'
      ],
      buttonText: 'Contact Sales',
      buttonClass: 'btn-outline'
    }
  ];

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onGetStarted() {
    // Navigate to registration or login
    console.log('Get started clicked');
  }

  onContactUs() {
    // Handle contact form or navigation
    console.log('Contact us clicked');
  }

  onSelectPlan(plan: PricingPlan) {
    console.log('Selected plan:', plan.name);
    // Handle plan selection
  }
}
