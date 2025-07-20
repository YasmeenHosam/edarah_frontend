import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from './notification.service';

export interface UserPlan {
  id: number;
  name: string;
  displayName: string;
  maxDatabases: number;
  color: string;
  badgeColor: string;
  features: string[];
  price: number;
  isActive: boolean;
}

export interface PlanLimits {
  maxDatabases: number;
  currentDatabases: number;
  remainingDatabases: number;
  canAddDatabase: boolean;
  usagePercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private currentPlanSubject = new BehaviorSubject<UserPlan | null>(null);
  public currentPlan$ = this.currentPlanSubject.asObservable();

  // Plan definitions
  private readonly plans: { [key: number]: UserPlan } = {
    1: { // Pro Plan
      id: 1,
      name: 'pro',
      displayName: 'Pro Plan',
      maxDatabases: 2,
      color: '#3b82f6',
      badgeColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      features: [
        'Detailed pricing suggestions',
        'AI assistant to guide your decisions',
        'Risk alerts for products losing money',
        'Smart promotional recommendations',
        'Access to dashboard & insights'
      ],
      price: 29,
      isActive: true
    },
    2: { // Free Plan
      id: 2,
      name: 'free',
      displayName: 'Free Plan',
      maxDatabases: 1,
      color: '#6b7280',
      badgeColor: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      features: [
        'Basic product recommendations',
        'Limited AI insights',
        'Alerts for risky products (basic)',
        'Access to dashboard'
      ],
      price: 0,
      isActive: true
    },
    3: { // Business Plan
      id: 3,
      name: 'business',
      displayName: 'Business Plan',
      maxDatabases: 3,
      color: '#10b981',
      badgeColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      features: [
        'All Pro features',
        'API access for automation',
        'Automatic integration to store',
        'Advanced reporting & CSV export',
        'Priority support'
      ],
      price: 70,
      isActive: true
    }
  };

  constructor(private notificationService: NotificationService) {
    this.loadCurrentPlan();
  }

  /**
   * Load current plan from localStorage
   */
  private loadCurrentPlan(): void {
    try {
      const savedPlan = localStorage.getItem('userPlan');
      if (savedPlan) {
        const planData = JSON.parse(savedPlan);
        const plan = this.plans[planData.id];
        if (plan) {
          this.currentPlanSubject.next(plan);
          console.log('📋 PlanService: Loaded plan from storage:', plan.displayName);
        } else {
          console.warn('📋 PlanService: Invalid plan ID in storage, setting default free plan');
          this.setDefaultFreePlan();
        }
      } else {
        console.log('📋 PlanService: No plan in storage, setting default free plan');
        this.setDefaultFreePlan();
      }
    } catch (error) {
      console.error('📋 PlanService: Error loading plan from storage:', error);
      this.setDefaultFreePlan();
    }
  }

  /**
   * Set default free plan
   */
  private setDefaultFreePlan(): void {
    const freePlan = this.plans[2];
    this.currentPlanSubject.next(freePlan);
    this.savePlanToStorage(freePlan);
  }

  /**
   * Save plan to localStorage
   */
  private savePlanToStorage(plan: UserPlan): void {
    try {
      localStorage.setItem('userPlan', JSON.stringify({ id: plan.id, name: plan.name }));
      console.log('📋 PlanService: Saved plan to storage:', plan.displayName);
    } catch (error) {
      console.error('📋 PlanService: Error saving plan to storage:', error);
    }
  }

  /**
   * Get current user plan
   */
  getCurrentPlan(): UserPlan | null {
    return this.currentPlanSubject.value;
  }

  /**
   * Set user plan after purchase or upgrade
   */
  setPlan(planId: number): boolean {
    const plan = this.plans[planId];
    if (plan) {
      const previousPlan = this.getCurrentPlan();
      this.currentPlanSubject.next(plan);
      this.savePlanToStorage(plan);

      console.log('📋 PlanService: Plan updated to:', plan.displayName);

      // Show notification if this is an upgrade (not initial load)
      if (previousPlan && previousPlan.id !== plan.id) {
        this.notificationService.showPlanUpgrade(plan.displayName);
      }

      return true;
    }
    console.error('📋 PlanService: Invalid plan ID:', planId);
    return false;
  }

  /**
   * Get plan by ID
   */
  getPlanById(planId: number): UserPlan | null {
    return this.plans[planId] || null;
  }

  /**
   * Get all available plans
   */
  getAllPlans(): UserPlan[] {
    return Object.values(this.plans);
  }

  /**
   * Check database limits for current plan
   */
  checkDatabaseLimits(currentDatabaseCount: number): PlanLimits {
    const currentPlan = this.getCurrentPlan();
    if (!currentPlan) {
      // Default to free plan limits if no plan is set
      const freePlan = this.plans[2];
      return this.calculateLimits(freePlan, currentDatabaseCount);
    }

    return this.calculateLimits(currentPlan, currentDatabaseCount);
  }

  /**
   * Calculate plan limits
   */
  private calculateLimits(plan: UserPlan, currentCount: number): PlanLimits {
    const remaining = Math.max(0, plan.maxDatabases - currentCount);
    const canAdd = remaining > 0;
    const usagePercentage = Math.min(100, (currentCount / plan.maxDatabases) * 100);

    return {
      maxDatabases: plan.maxDatabases,
      currentDatabases: currentCount,
      remainingDatabases: remaining,
      canAddDatabase: canAdd,
      usagePercentage: usagePercentage
    };
  }

  /**
   * Clear plan data (on logout)
   */
  clearPlanData(): void {
    localStorage.removeItem('userPlan');
    this.setDefaultFreePlan();
    console.log('📋 PlanService: Plan data cleared');
  }

  /**
   * Get upgrade suggestions based on current usage
   */
  getUpgradeSuggestions(currentDatabaseCount: number): UserPlan[] {
    const currentPlan = this.getCurrentPlan();
    if (!currentPlan) return [];

    return Object.values(this.plans).filter(plan => 
      plan.id !== currentPlan.id && 
      plan.maxDatabases > currentPlan.maxDatabases &&
      plan.maxDatabases >= currentDatabaseCount
    ).sort((a, b) => a.price - b.price);
  }

  /**
   * Check if user can perform action based on plan
   */
  canPerformAction(action: 'add_database' | 'api_access' | 'advanced_features', currentDatabaseCount?: number): boolean {
    const currentPlan = this.getCurrentPlan();
    if (!currentPlan) return false;

    switch (action) {
      case 'add_database':
        if (currentDatabaseCount === undefined) return false;
        return this.checkDatabaseLimits(currentDatabaseCount).canAddDatabase;
      
      case 'api_access':
        return currentPlan.id === 3; // Only Business plan
      
      case 'advanced_features':
        return currentPlan.id !== 2; // Not Free plan
      
      default:
        return false;
    }
  }
}
