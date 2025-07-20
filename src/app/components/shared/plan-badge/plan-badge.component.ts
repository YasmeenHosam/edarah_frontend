import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanService, UserPlan } from '../../../services/plan.service';

@Component({
  selector: 'app-plan-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-badge.component.html',
  styleUrl: './plan-badge.component.css'
})
export class PlanBadgeComponent implements OnInit, OnDestroy {
  currentPlan: UserPlan | null = null;
  private planSubscription?: Subscription;

  constructor(
    private planService: PlanService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to plan changes
    this.planSubscription = this.planService.currentPlan$.subscribe(plan => {
      this.currentPlan = plan;
      console.log('🏷️ PlanBadge: Plan updated:', plan?.displayName);
    });
  }

  ngOnDestroy() {
    if (this.planSubscription) {
      this.planSubscription.unsubscribe();
    }
  }

  /**
   * Navigate to pricing page for upgrades
   */
  onUpgradeClick() {
    console.log('🏷️ PlanBadge: Upgrade clicked');
    this.router.navigate(['/home'], { fragment: 'pricing' });
  }

  /**
   * Get plan icon based on plan type
   */
  getPlanIcon(): string {
    if (!this.currentPlan) return 'free';
    
    switch (this.currentPlan.id) {
      case 1: return 'pro';
      case 2: return 'free';
      case 3: return 'business';
      default: return 'free';
    }
  }

  /**
   * Check if plan is upgradeable
   */
  isUpgradeable(): boolean {
    return this.currentPlan?.id !== 3; // Business plan is the highest
  }
}
