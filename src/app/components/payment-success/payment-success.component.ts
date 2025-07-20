import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
  isVerifying = true;
  verificationSuccess = false;
  verificationError = '';
  planName = '';
  redirectCountdown = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private planService: PlanService
  ) {}

  ngOnInit() {
    // Get payment parameters from URL
    this.route.queryParams.subscribe(params => {
      console.log('💳 Payment Success: Received params:', params);
      
      const paymentId = params['payment_id'];
      const planId = params['plan_id'];
      const success = params['success'];
      
      if (success === 'true' && paymentId && planId) {
        this.verifyPayment(paymentId, parseInt(planId));
      } else {
        this.handleVerificationError('معاملات الدفع غير صحيحة');
      }
    });
  }

  private verifyPayment(paymentId: string, planId: number) {
    console.log('💳 Verifying payment:', { paymentId, planId });
    
    this.paymentService.verifyPayment(paymentId, planId).subscribe({
      next: (response) => {
        console.log('✅ Payment verification response:', response);
        
        if (response.success && response.data?.verified) {
          this.handleVerificationSuccess(planId, response.data.planName);
        } else {
          this.handleVerificationError(response.message || 'فشل في التحقق من الدفع');
        }
      },
      error: (error) => {
        console.error('❌ Payment verification error:', error);
        this.handleVerificationError('حدث خطأ أثناء التحقق من الدفع');
      }
    });
  }

  private handleVerificationSuccess(planId: number, planName: string) {
    this.isVerifying = false;
    this.verificationSuccess = true;
    this.planName = planName;
    
    // Update user plan
    const planUpdated = this.planService.setPlan(planId);
    if (planUpdated) {
      console.log('✅ Plan updated successfully to:', planName);
    }
    
    // Start countdown for redirect
    this.startRedirectCountdown();
  }

  private handleVerificationError(errorMessage: string) {
    this.isVerifying = false;
    this.verificationSuccess = false;
    this.verificationError = errorMessage;
  }

  private startRedirectCountdown() {
    const interval = setInterval(() => {
      this.redirectCountdown--;
      
      if (this.redirectCountdown <= 0) {
        clearInterval(interval);
        this.redirectToDashboard();
      }
    }, 1000);
  }

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
