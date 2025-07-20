import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ProtectedGuard } from './guards/protected.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-success',
    loadComponent: () => import('./components/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent)
  },
  {
    path: 'payment-status',
    loadComponent: () => import('./components/payment-status/payment-status.component').then(m => m.PaymentStatusComponent)
  },
  {
    path: 'product-analysis',
    loadComponent: () => import('./components/product-analysis/product-analysis.component').then(m => m.ProductAnalysisComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'suggestions',
    loadComponent: () => import('./components/suggestions/suggestions.component').then(m => m.SuggestionsComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'help',
    loadComponent: () => import('./components/help/help.component').then(m => m.HelpComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'dashboard/databases',
    loadComponent: () => import('./components/database-management/database-management.component').then(m => m.DatabaseManagementComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'dashboard/assistant',
    loadComponent: () => import('./components/ai-assistant/ai-assistant.component').then(m => m.AIAssistantComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'dashboard/marketing-plan',
    loadComponent: () => import('./components/marketing-plan/marketing-plan.component').then(m => m.MarketingPlanComponent),
    canActivate: [ProtectedGuard]
  },
  {
    path: 'dashboard/products',
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent),
    canActivate: [ProtectedGuard]
  },
  // Redirect old routes to new auth component
  {
    path: 'login',
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  {
    path: 'register',
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
