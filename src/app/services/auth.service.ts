import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://13.38.195.203:3000/api/auth';
  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser$: Observable<any | null>;

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any | null>(user ? JSON.parse(user) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  register(user: any): Observable<any> {
    console.log('AuthService: Sending registration request to:', `${this.baseUrl}/register`);
    console.log('AuthService: Registration data:', user);

    const headers = {
      'Content-Type': 'application/json'
    };

    return this.http.post(`${this.baseUrl}/register`, user, { headers });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.user && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout() {
    // In a real app, you might want to call a logout endpoint on the server
    // For this example, we'll just clear local storage and update the subject
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getCurrentUser(): any | null {
    return this.currentUserValue;
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.baseUrl}/refresh`, {});
  }
} 