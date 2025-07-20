import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanService, UserPlan, PlanLimits } from '../../../services/plan.service';

@Component({
  selector: 'app-database-usage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './database-usage.component.html',
  styleUrl: './database-usage.component.css'
})
export class DatabaseUsageComponent implements OnInit, OnDestroy, OnChanges {
  @Input() currentDatabaseCount: number = 0;
  @Output() upgradeRequested = new EventEmitter<void>();

  currentPlan: UserPlan | null = null;
  planLimits: PlanLimits | null = null;
  upgradeSuggestions: UserPlan[] = [];
  
  private planSubscription?: Subscription;

  constructor(
    private planService: PlanService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to plan changes
    this.planSubscription = this.planService.currentPlan$.subscribe(plan => {
      this.currentPlan = plan;
      this.updateLimits();
    });
  }

  ngOnDestroy() {
    if (this.planSubscription) {
      this.planSubscription.unsubscribe();
    }
  }

  ngOnChanges() {
    this.updateLimits();
  }

  private updateLimits() {
    if (this.currentDatabaseCount !== undefined) {
      this.planLimits = this.planService.checkDatabaseLimits(this.currentDatabaseCount);
      this.upgradeSuggestions = this.planService.getUpgradeSuggestions(this.currentDatabaseCount);
      console.log('📊 DatabaseUsage: Updated limits:', this.planLimits);
    }
  }

  /**
   * Get usage status color
   */
  getUsageColor(): string {
    if (!this.planLimits) return '#6b7280';
    
    if (this.planLimits.usagePercentage >= 100) return '#ef4444'; // Red - at limit
    if (this.planLimits.usagePercentage >= 80) return '#f59e0b';  // Orange - near limit
    if (this.planLimits.usagePercentage >= 60) return '#eab308';  // Yellow - moderate usage
    return '#10b981'; // Green - low usage
  }

  /**
   * Get usage status text
   */
  getUsageStatusText(): string {
    if (!this.planLimits) return 'Loading...';
    
    if (this.planLimits.usagePercentage >= 100) return 'Limit Reached';
    if (this.planLimits.usagePercentage >= 80) return 'Near Limit';
    if (this.planLimits.usagePercentage >= 60) return 'Moderate Usage';
    return 'Good';
  }

  /**
   * Get progress bar width
   */
  getProgressWidth(): number {
    return this.planLimits?.usagePercentage || 0;
  }

  /**
   * Check if upgrade is needed
   */
  isUpgradeNeeded(): boolean {
    return !this.planLimits?.canAddDatabase && this.upgradeSuggestions.length > 0;
  }

  /**
   * Handle upgrade click
   */
  onUpgradeClick() {
    console.log('📊 DatabaseUsage: Upgrade requested');
    this.upgradeRequested.emit();
    this.router.navigate(['/home'], { fragment: 'pricing' });
  }

  /**
   * Get warning message
   */
  getWarningMessage(): string {
    if (!this.planLimits) return '';
    
    if (!this.planLimits.canAddDatabase) {
      return `You've reached your ${this.currentPlan?.displayName} limit of ${this.planLimits.maxDatabases} database${this.planLimits.maxDatabases > 1 ? 's' : ''}. Upgrade to add more.`;
    }
    
    if (this.planLimits.usagePercentage >= 80) {
      return `You're using ${this.planLimits.currentDatabases} of ${this.planLimits.maxDatabases} databases. Consider upgrading soon.`;
    }
    
    return '';
  }

  /**
   * Get next suggested plan
   */
  getNextPlan(): UserPlan | null {
    return this.upgradeSuggestions.length > 0 ? this.upgradeSuggestions[0] : null;
  }
}
