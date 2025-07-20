import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  negativeFeatures?: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonClass: string;
  amount: number;
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

  isProcessingPayment = false;
  paymentError = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  pricingPlans: PricingPlan[] = [
    {
      id: 2, // Free plan ID
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
      buttonClass: 'btn-outline',
      amount: 0
    },
    {
      id: 1, // Pro plan ID
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
      buttonText: 'Buy Pro Plan',
      buttonClass: 'btn-primary',
      amount: 29
    },
    {
      id: 3, // Business plan ID
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
      buttonText: 'Buy Business Plan',
      buttonClass: 'btn-outline',
      amount: 70
    }
  ];

  onSelectPlan(plan: PricingPlan) {
    console.log('🎯 Plan selected:', plan);

    // Clear any previous error
    this.paymentError = '';

    // Handle free plan
    if (plan.id === 2) {
      console.log('📦 Free plan selected - redirecting to dashboard');
      this.selectPlan.emit(plan);
      return;
    }

    // Check if user is authenticated for paid plans
    if (!this.paymentService.isAuthenticatedForPayment()) {
      console.log('🔒 User not authenticated - redirecting to login');
      alert('يجب تسجيل الدخول أولاً لشراء الخطة');
      this.router.navigate(['/auth']);
      return;
    }

    // Process payment for paid plans
    this.processPlanPurchase(plan);
  }

  private processPlanPurchase(plan: PricingPlan) {
    console.log('💳 Processing plan purchase:', plan);
    this.isProcessingPayment = true;

    // Call the API endpoint
    this.paymentService.purchasePlan(plan.id, plan.name, plan.amount).subscribe({
      next: (response) => {
        console.log('✅ Payment API response:', response);
        this.isProcessingPayment = false;

        if (response.success && response.data?.paymentUrl) {
          // Save pending payment info
          this.savePendingPayment(plan);

          // Redirect to payment URL from API response
          console.log('🔗 Redirecting to payment URL:', response.data.paymentUrl);
          window.open(response.data.paymentUrl, '_blank');

          // Navigate to payment status page
          this.router.navigate(['/payment-status']);
        } else {
          // Fallback to predefined URLs
          const paymentUrl = this.paymentService.getPaymentUrl(plan.id);
          if (paymentUrl) {
            // Save pending payment info
            this.savePendingPayment(plan);

            console.log('🔗 Using fallback payment URL:', paymentUrl);
            window.open(paymentUrl, '_blank');

            // Navigate to payment status page
            this.router.navigate(['/payment-status']);
          } else {
            this.paymentError = 'رابط الدفع غير متوفر لهذه الخطة';
          }
        }
      },
      error: (error) => {
        console.error('❌ Payment API error:', error);
        this.isProcessingPayment = false;

        // Fallback to predefined URLs on API error
        const paymentUrl = this.paymentService.getPaymentUrl(plan.id);
        if (paymentUrl) {
          // Save pending payment info
          this.savePendingPayment(plan);

          console.log('🔗 API failed, using fallback payment URL:', paymentUrl);
          window.open(paymentUrl, '_blank');

          // Navigate to payment status page
          this.router.navigate(['/payment-status']);
        } else {
          this.paymentError = error.error?.message || 'حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.';
        }
      }
    });
  }

  /**
   * Save pending payment information for status tracking
   */
  private savePendingPayment(plan: PricingPlan) {
    const pendingPayment = {
      planId: plan.id,
      planName: plan.name,
      amount: plan.amount,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('pendingPayment', JSON.stringify(pendingPayment));
    console.log('💳 Saved pending payment:', pendingPayment);
  }
}
