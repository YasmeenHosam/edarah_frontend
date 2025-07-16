import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  activeMenuItem: string = 'dashboard';
  isSidebarCollapsed = false;

  // Mock data for dashboard
  productsAtRisk = [
    {
      id: 'GH3456/RBC/Spe4',
      name: 'Robot Roomba Robot Vacuum',
      warningType: 'Loss Risk',
      warningLevel: 'warning',
      notice: 'Product is being sold at a loss (-3% margin)',
      suggestion: 'Raise price to 3% LSP to maintain 10% margin, or mark as loss leader',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center',
      fallbackImage: 'https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Robot+Vacuum'
    },
    {
      id: 'GH3456/RBC/Spe4',
      name: 'Matte Blackhead Pore Spray',
      warningType: 'Expiry risk',
      warningLevel: 'danger',
      notice: 'Product is about to expire in 4 days',
      suggestion: 'Launch "Buy 2 Get 1" limited-time offer before July 14',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop&crop=center',
      fallbackImage: 'https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Pore+Spray'
    },
    {
      id: 'GH7890/ELC/Pro2',
      name: 'Wireless Bluetooth Headphones',
      warningType: 'Low Sales',
      warningLevel: 'warning',
      notice: 'Only 3 units sold in the last 30 days',
      suggestion: 'Consider promotional pricing or bundle deals to increase sales velocity',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center',
      fallbackImage: 'https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Headphones'
    },
    {
      id: 'GH2468/SNK/Chp1',
      name: 'Organic Potato Chips',
      warningType: 'Dead Stock',
      warningLevel: 'danger',
      notice: 'No sales recorded in the last 45 days',
      suggestion: 'Implement clearance sale or donate to avoid total loss',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop&crop=center',
      fallbackImage: 'https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Chips'
    }
  ];

  insightData = [
    { type: 'loss', title: 'Loss', period: 'Weekly', trend: 'down', data: [10, 15, 12, 18, 14, 16, 13] },
    { type: 'expired', title: 'Expired', period: 'Weekly', trend: 'down', data: [5, 8, 6, 10, 7, 9, 6] },
    { type: 'low-sales', title: 'Low Sales', period: 'Weekly', trend: 'down', data: [20, 25, 22, 28, 24, 26, 23] },
    { type: 'dead-stock', title: 'Dead Stock', period: 'Weekly', trend: 'down', data: [8, 12, 10, 15, 11, 13, 10] }
  ];

  performanceData = {
    value1: [80, 85, 78, 92, 88, 95, 90, 87, 93, 89, 96, 91],
    value2: [70, 75, 68, 82, 78, 85, 80, 77, 83, 79, 86, 81],
    labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
  };

  miniStats = {
    lastSale: '17 days ago',
    remainingStock: '24 units',
    urgencyLevel: 'High',
    actionTime: 'Within 3 days'
  };

  warningsData = [
    { label: 'Loss', value: 35, color: '#ef4444' },
    { label: 'Almost Expired', value: 35, color: '#f59e0b' },
    { label: 'Low Sales', value: 35, color: '#3b82f6' },
    { label: 'Dead Stock', value: 35, color: '#6b7280' },
    { label: 'Low Prices', value: 35, color: '#8b5cf6' }
  ];

  profitData = {
    averageProfit: 12.5,
    comparisonLastMonth: 3.2,
    bestCategory: { name: 'Snacks', percentage: 23 },
    worstCategory: { name: 'Household', percentage: -7 },
    weeklyMargin: 11.2
  };

  activeTab = 'profit';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeCharts();
    this.initializeAnimations();
  }

  setActiveMenuItem(itemId: string) {
    this.activeMenuItem = itemId;
  }

  logout() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Dashboard specific methods
  confirmProduct(productId: string) {
    console.log('Confirming product:', productId);
    // Add confirmation logic here
  }

  editProduct(productId: string) {
    console.log('Editing product:', productId);
    // Add edit logic here
  }

  onImageError(event: any) {
    // Handle image loading errors by showing fallback
    const img = event.target;
    const fallbackSrc = img.getAttribute('data-fallback');
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    }
  }

  refreshData() {
    console.log('Refreshing dashboard data...');
    // Add refresh logic here
  }

  askAIHelp() {
    console.log('Opening AI assistant...');
    // Navigate to AI assistant or open modal
  }

  askBot() {
    console.log('Opening bot chat...');
    // Open bot chat interface
  }

  private initializeCharts() {
    // Initialize charts after view init
    setTimeout(() => {
      this.createMiniCharts();
      this.createPerformanceChart();
      this.createDonutChart();
      this.setupTabHandlers();
    }, 100);
  }

  private initializeAnimations() {
    // Initialize animations with intersection observer
    setTimeout(() => {
      this.setupIntersectionObserver();
      this.animateElementsOnLoad();
    }, 200);
  }

  private setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('animated');
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
      '.product-card, .insight-card, .warnings-card, .profit-panel, .performance-section, .analytics-section'
    );

    animatableElements.forEach(element => {
      observer.observe(element);
    });
  }

  private animateElementsOnLoad() {
    // Animate header immediately
    const header = document.querySelector('.dashboard-header');
    if (header) {
      setTimeout(() => {
        header.classList.add('animated');
      }, 100);
    }

    // Animate sections with staggered delays
    const sections = [
      '.products-section',
      '.insights-section',
      '.performance-section',
      '.analytics-section'
    ];

    sections.forEach((selector, index) => {
      const section = document.querySelector(selector);
      if (section) {
        setTimeout(() => {
          section.classList.add('animated');
        }, 200 + (index * 150));
      }
    });

    // Animate cards with staggered delays
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animated');
      }, 400 + (index * 100));
    });

    const insightCards = document.querySelectorAll('.insight-card');
    insightCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animated');
      }, 600 + (index * 80));
    });
  }

  private createMiniCharts() {
    // Create mini charts for insight panels
    this.insightData.forEach((insight, index) => {
      const canvas = document.querySelector(`[data-chart="${insight.type}"]`) as HTMLCanvasElement;
      if (canvas) {
        this.drawMiniChart(canvas, insight.data, this.getChartColor(insight.type));
      }
    });
  }

  private createPerformanceChart() {
    const canvas = document.querySelector('[data-chart="performance"]') as HTMLCanvasElement;
    if (canvas) {
      this.drawPerformanceChart(canvas);
    }
  }

  private drawMiniChart(canvas: HTMLCanvasElement, data: number[], color: string) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 5;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((value - min) / range) * (height - 2 * padding);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Add area fill
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = color;
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
  }

  private drawPerformanceChart(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Draw background grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw data lines
    this.drawDataLine(ctx, this.performanceData.value1, '#ef4444', width, height, padding);
    this.drawDataLine(ctx, this.performanceData.value2, '#3b82f6', width, height, padding);

    // Draw bars (simplified)
    ctx.fillStyle = '#93c5fd';
    const barWidth = (width - 2 * padding) / this.performanceData.value1.length;
    this.performanceData.value1.forEach((value, index) => {
      const x = padding + index * barWidth;
      const barHeight = (value / 100) * (height - 2 * padding) * 0.3;
      ctx.fillRect(x + barWidth * 0.1, height - padding - barHeight, barWidth * 0.8, barHeight);
    });
  }

  private drawDataLine(ctx: CanvasRenderingContext2D, data: number[], color: string, width: number, height: number, padding: number) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const max = 100;
    const min = 0;

    data.forEach((value, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((value - min) / (max - min)) * (height - 2 * padding);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }

  private getChartColor(type: string): string {
    const colors = {
      'loss': '#ef4444',
      'expired': '#f59e0b',
      'low-sales': '#3b82f6',
      'dead-stock': '#6b7280'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  }

  private createDonutChart() {
    const canvas = document.querySelector('[data-chart="warnings"]') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 10;
    const innerRadius = outerRadius * 0.6;

    let currentAngle = -Math.PI / 2; // Start from top

    this.warningsData.forEach((segment) => {
      const sliceAngle = (segment.value / 100) * 2 * Math.PI;

      // Draw segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();

      currentAngle += sliceAngle;
    });
  }

  private setupTabHandlers() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const tab = target.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
        }
      });
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;

    // Update active tab styling
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`[data-tab="${tab}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // Update content based on tab
    this.updateTabContent(tab);
  }

  private updateTabContent(tab: string) {
    const content = document.querySelector('.profit-content');
    if (!content) return;

    // Here you can update the content based on the selected tab
    // For now, we'll keep the profit content as default
    console.log(`Switched to ${tab} tab`);

    // You can add different content for each tab:
    // - profit: current profit data
    // - expiry: expiry-related data
    // - needs: inventory needs
    // - stock: stock levels
  }
}
