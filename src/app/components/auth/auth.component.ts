import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  activeTab: 'signin' | 'signup' = 'signin';
  
  // Sign In Form
  signinForm!: FormGroup;
  isSigninSubmitting = false;
  showSigninPassword = false;

  // Sign Up Form
  signupForm!: FormGroup;
  isSignupSubmitting = false;
  showSignupPassword = false;
  showConfirmPassword = false;

  // Password Strength
  passwordStrength = 0;
  hasLowercase = false;
  hasUppercase = false;
  hasNumber = false;
  hasMinLength = false;

  // Messages
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    // Check for query parameters to determine initial tab
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'signup') {
        this.activeTab = 'signup';
      } else if (params['tab'] === 'signin') {
        this.activeTab = 'signin';
      }
    });
  }

  private initializeForms() {
    // Sign In Form
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Sign Up Form
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    // Listen to password changes for strength calculation
    this.signupForm.get('password')?.valueChanges.subscribe(password => {
      if (password) {
        this.checkPasswordStrength(password);
      } else {
        this.passwordStrength = 0;
        this.hasLowercase = false;
        this.hasUppercase = false;
        this.hasNumber = false;
        this.hasMinLength = false;
      }
    });
  }

  // Tab switching
  switchTab(tab: 'signin' | 'signup') {
    this.activeTab = tab;
    // Reset forms when switching tabs
    this.signinForm.reset();
    this.signupForm.reset();
    this.resetFormStates();
    // Clear messages
    this.clearMessages();
  }

  private resetFormStates() {
    this.isSigninSubmitting = false;
    this.isSignupSubmitting = false;
    this.showSigninPassword = false;
    this.showSignupPassword = false;
    this.showConfirmPassword = false;
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Password visibility toggles
  toggleSigninPasswordVisibility() {
    this.showSigninPassword = !this.showSigninPassword;
  }

  toggleSignupPasswordVisibility() {
    this.showSignupPassword = !this.showSignupPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Password strength calculation
  checkPasswordStrength(password: string) {
    this.hasLowercase = /[a-z]/.test(password);
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasMinLength = password.length >= 8;

    const requirements = [this.hasLowercase, this.hasUppercase, this.hasNumber, this.hasMinLength];
    this.passwordStrength = requirements.filter(req => req).length;
  }

  // Form getters for Sign In
  get signinEmail() { return this.signinForm.get('email'); }
  get signinPassword() { return this.signinForm.get('password'); }

  // Form getters for Sign Up
  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get signupEmail() { return this.signupForm.get('email'); }
  get phoneNumber() { return this.signupForm.get('phoneNumber'); }
  get signupPassword() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get agreeToTerms() { return this.signupForm.get('agreeToTerms'); }

  // Password validator
  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;
    if (!valid) {
      return { passwordStrength: true };
    }
    return null;
  }

  // Password match validator
  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Get field error messages
  getFieldError(fieldName: string, formType: 'signin' | 'signup' = 'signup'): string {
    const form = formType === 'signin' ? this.signinForm : this.signupForm;
    const field = form.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
      if (field.errors['passwordStrength']) return 'Password must contain uppercase, lowercase, number and special character';
      if (field.errors['requiredTrue']) return 'You must agree to the terms and conditions';
    }
    
    if (fieldName === 'confirmPassword' && this.signupForm.errors?.['passwordMismatch'] && field?.touched) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phoneNumber: 'Phone number',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Sign In submission
  onSigninSubmit() {
    if (this.signinForm.valid) {
      this.isSigninSubmitting = true;
      this.clearMessages();
      const { rememberMe, ...credentials } = this.signinForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.isSigninSubmitting = false;
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.isSigninSubmitting = false;
          this.errorMessage = err.error?.message || 'Login failed. Please check your credentials and try again.';
        }
      });
    } else {
      this.signinForm.markAllAsTouched();
    }
  }

  // Sign Up submission
  onSignupSubmit() {
    if (this.signupForm.valid) {
      this.isSignupSubmitting = true;
      this.clearMessages();
      const { confirmPassword, agreeToTerms, ...userData } = this.signupForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.isSignupSubmitting = false;
          this.successMessage = 'Account created successfully! You can now sign in.';
          // Switch to sign in tab after successful registration
          setTimeout(() => {
            this.switchTab('signin');
            this.successMessage = 'Account created successfully! Please sign in with your credentials.';
          }, 2000);
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.isSignupSubmitting = false;
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
