import { Component, OnInit } from '@angular/core';
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
export class SidebarComponent implements OnInit {
  currentUser: any = null;
  activeMenuItem: string = 'dashboard';
  isSidebarCollapsed = false;

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
      route: '/dashboard/analysis'
    },
    {
      id: 'suggestions',
      label: 'Suggestions',
      icon: 'suggestions',
      route: '/dashboard/suggestions'
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
      route: '/dashboard/settings'
    },
    {
      id: 'help',
      label: 'Help',
      icon: 'help',
      route: '/dashboard/help'
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
  }

  setActiveMenuItem(itemId: string) {
    this.activeMenuItem = itemId;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}
