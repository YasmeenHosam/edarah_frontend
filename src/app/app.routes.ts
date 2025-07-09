import { Routes } from '@angular/router';

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
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dashboard/databases',
    loadComponent: () => import('./components/database-management/database-management.component').then(m => m.DatabaseManagementComponent)
  },
  {
    path: 'dashboard/assistant',
    loadComponent: () => import('./components/ai-assistant/ai-assistant.component').then(m => m.AIAssistantComponent)
  },
  {
    path: 'dashboard/products',
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
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
