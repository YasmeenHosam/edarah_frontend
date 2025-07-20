import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlanService } from './plan.service';

export interface PlanPurchaseRequest {
  plan: {
    id: number;
    name: string;
    amount: number;
  };
}

export interface PlanPurchaseResponse {
  success: boolean;
  data: {
    paymentUrl: string;
    clientSecret: string;
    publicKey: string;
  };
  message?: string;
}

export interface PaymentVerificationRequest {
  paymentId: string;
  planId: number;
}

export interface PaymentVerificationResponse {
  success: boolean;
  data: {
    verified: boolean;
    planId: number;
    planName: string;
    paymentStatus: string;
    transactionId?: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/api/plan/buy`;
  private verifyUrl = `${environment.apiUrl}/api/plan/verify`;

  constructor(
    private http: HttpClient,
    private planService: PlanService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('💳 PaymentService: Getting headers - Token exists:', !!token);
    
    if (!token) {
      console.error('❌ PaymentService: No authentication token found');
      throw new Error('Authentication required for payment');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Purchase a plan and get payment URL
   * @param planId - Plan ID (1: Pro, 2: Free, 3: Business)
   * @param planName - Plan name
   * @param amount - Plan amount
   */
  purchasePlan(planId: number, planName: string, amount: number): Observable<PlanPurchaseResponse> {
    console.log('💳 PaymentService: Purchasing plan:', { planId, planName, amount });

    const requestData: PlanPurchaseRequest = {
      plan: {
        id: planId,
        name: planName,
        amount: amount
      }
    };

    return this.http.post<PlanPurchaseResponse>(this.baseUrl, requestData, {
      headers: this.getHeaders()
    });
    // Note: Plan will be updated only after payment verification, not here
  }

  /**
   * Get predefined payment URLs for plans
   * @param planId - Plan ID
   */
  getPaymentUrl(planId: number): string {
    const paymentUrls: { [key: number]: string } = {
      1: 'https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_tFnNcPQq4qXekrtOmhO52Sow0QkrXB1U&clientSecret=egy_csk_test_75ba21980a5ee04f4cda19eba617eb84', // Pro
      3: 'https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_tFnNcPQq4qXekrtOmhO52Sow0QkrXB1U&clientSecret=egy_csk_test_b3a71bdc2e9db6dfe1019a4cf85dcf28'  // Business
    };

    return paymentUrls[planId] || '';
  }

  /**
   * Verify payment status after callback
   * @param paymentId - Payment ID from callback
   * @param planId - Plan ID that was purchased
   */
  verifyPayment(paymentId: string, planId: number): Observable<PaymentVerificationResponse> {
    console.log('💳 PaymentService: Verifying payment:', { paymentId, planId });

    const requestData: PaymentVerificationRequest = {
      paymentId,
      planId
    };

    return this.http.post<PaymentVerificationResponse>(this.verifyUrl, requestData, {
      headers: this.getHeaders()
    });
  }

  /**
   * Check if user is authenticated for payment
   */
  isAuthenticatedForPayment(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    return !!(token && user);
  }

  /**
   * Generate payment success URL with callback parameters
   */
  generateSuccessUrl(planId: number): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/payment-success?plan_id=${planId}&success=true&payment_id={payment_id}`;
  }

  /**
   * Generate payment failure URL
   */
  generateFailureUrl(): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/payment-success?success=false`;
  }
}
