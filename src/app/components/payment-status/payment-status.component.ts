import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { PaymentService } from '../../services/payment.service';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.css'
})
export class PaymentStatusComponent implements OnInit, OnDestroy {
  isChecking = true;
  checkAttempts = 0;
  maxAttempts = 12; // Check for 2 minutes (12 * 10 seconds)
  pendingPlanId: number | null = null;
  pendingPlanName = '';
  
  private checkSubscription?: Subscription;

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private planService: PlanService
  ) {}

  ngOnInit() {
    // Get pending payment info from localStorage
    const pendingPayment = localStorage.getItem('pendingPayment');
    if (pendingPayment) {
      const paymentData = JSON.parse(pendingPayment);
      this.pendingPlanId = paymentData.planId;
      this.pendingPlanName = paymentData.planName;
      
      console.log('💳 PaymentStatus: Found pending payment:', paymentData);
      this.startPaymentCheck();
    } else {
      console.log('💳 PaymentStatus: No pending payment found');
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy() {
    if (this.checkSubscription) {
      this.checkSubscription.unsubscribe();
    }
  }

  private startPaymentCheck() {
    console.log('💳 PaymentStatus: Starting payment status check');
    
    // Check immediately first
    this.checkPaymentStatus();
    
    // Then check every 10 seconds
    this.checkSubscription = interval(10000).subscribe(() => {
      this.checkPaymentStatus();
    });
  }

  private checkPaymentStatus() {
    if (!this.pendingPlanId || this.checkAttempts >= this.maxAttempts) {
      this.handleTimeout();
      return;
    }

    this.checkAttempts++;
    console.log(`💳 PaymentStatus: Check attempt ${this.checkAttempts}/${this.maxAttempts}`);

    // For now, we'll simulate checking by looking for plan changes
    // In a real implementation, you'd call an API to check payment status
    this.simulatePaymentCheck();
  }

  private simulatePaymentCheck() {
    // Check if user manually updated their plan (for testing)
    const currentPlan = this.planService.getCurrentPlan();
    
    if (currentPlan && currentPlan.id === this.pendingPlanId) {
      console.log('✅ PaymentStatus: Payment confirmed - plan updated');
      this.handlePaymentSuccess();
    } else if (this.checkAttempts >= this.maxAttempts) {
      console.log('⏰ PaymentStatus: Timeout reached');
      this.handleTimeout();
    }
  }

  private handlePaymentSuccess() {
    this.isChecking = false;
    
    // Clear pending payment
    localStorage.removeItem('pendingPayment');
    
    // Stop checking
    if (this.checkSubscription) {
      this.checkSubscription.unsubscribe();
    }
    
    // Show success and redirect
    alert(`تم تفعيل باقة ${this.pendingPlanName} بنجاح! 🎉`);
    this.router.navigate(['/dashboard']);
  }

  private handleTimeout() {
    this.isChecking = false;
    
    // Stop checking
    if (this.checkSubscription) {
      this.checkSubscription.unsubscribe();
    }
    
    console.log('⏰ PaymentStatus: Payment check timeout');
  }

  /**
   * Manual plan activation for testing
   */
  activatePlanManually() {
    if (this.pendingPlanId) {
      console.log('🔧 PaymentStatus: Manual plan activation');
      const success = this.planService.setPlan(this.pendingPlanId);
      if (success) {
        this.handlePaymentSuccess();
      }
    }
  }

  /**
   * Cancel and go back
   */
  cancelAndGoBack() {
    localStorage.removeItem('pendingPayment');
    this.router.navigate(['/home']);
  }

  /**
   * Get remaining time
   */
  getRemainingTime(): number {
    return Math.max(0, this.maxAttempts - this.checkAttempts);
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    return (this.checkAttempts / this.maxAttempts) * 100;
  }
}
