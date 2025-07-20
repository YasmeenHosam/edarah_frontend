import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  activeMenuItem: string = 'dashboard';
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isMobile = false;
  private resizeListener?: () => void;

  menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      id: 'products',
      label: 'Products',
      icon: 'products',
      route: '/dashboard/products'
    },
    {
      id: 'databases',
      label: 'Databases',
      icon: 'databases',
      route: '/dashboard/databases'
    },
    {
      id: 'analysis',
      label: 'Product analysis',
      icon: 'analysis',
      route: '/product-analysis'
    },
    {
      id: 'suggestions',
      label: 'Suggestions',
      icon: 'suggestions',
      route: '/suggestions'
    },
    {
      id: 'assistant',
      label: 'AI Assistant',
      icon: 'assistant',
      route: '/dashboard/assistant'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      route: '/settings'
    },
    {
      id: 'help',
      label: 'Help',
      icon: 'help',
      route: '/help'
    }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    // Set active menu item based on current route
    const currentRoute = this.router.url;
    const activeItem = this.menuItems.find(item => currentRoute.startsWith(item.route));
    if (activeItem) {
      this.activeMenuItem = activeItem.id;
    }

    this.checkScreenSize();
    this.initializeAnimations();

    // Listen for window resize
    this.resizeListener = () => {
      this.checkScreenSize();
    };
    window.addEventListener('resize', this.resizeListener);
  }

  setActiveMenuItem(itemId: string) {
    this.activeMenuItem = itemId;

    // Close mobile menu when item is selected
    if (this.isMobile && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.toggleMobileMenu();
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Prevent body scroll when mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 767;

    // Close mobile menu if screen becomes larger
    if (!this.isMobile && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }

    // Reset collapsed state on mobile
    if (this.isMobile) {
      this.isSidebarCollapsed = false;
    }
  }

  goToHome() {
    this.activeMenuItem = 'home';
    this.router.navigate(['/home']);

    // Close mobile menu when home is selected
    if (this.isMobile && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    // Clean up event listeners
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }

    // Reset body overflow
    document.body.style.overflow = '';
  }

  private initializeAnimations() {
    setTimeout(() => {
      this.animateMenuItems();
    }, 300);
  }

  private animateMenuItems() {
    const menuItems = document.querySelectorAll('.nav-item');
    menuItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animated');
      }, index * 100);
    });
  }
}
