import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectedGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      console.log('🔓 ProtectedGuard: User is authenticated, allowing access to protected route');
      // User is authenticated, allow access to protected routes
      return true;
    }

    console.log('🔒 ProtectedGuard: User is not authenticated, redirecting to auth page');
    // User is not authenticated, redirect to auth page
    this.router.navigate(['/auth']);
    return false;
  }
}
