import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      console.log('🔒 AuthGuard: User is already authenticated, redirecting to dashboard');
      // User is already logged in, redirect them away from auth pages
      this.router.navigate(['/dashboard']);
      return false;
    }

    console.log('🔓 AuthGuard: User is not authenticated, allowing access to auth page');
    // User is not authenticated, allow access to auth pages
    return true;
  }
}
