import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService, Product, AITableResponse } from '../../services/dashboard.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    ProgressSpinnerModule,
    CardModule,
    TooltipModule,
    SidebarComponent
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css', './dropdown-fix.css']
})
export class ProductsComponent implements OnInit {

  // Products data from API
  allProducts: Product[] = [];

  // Loading state
  isLoading: boolean = false;

  // Mock data for fallback (keeping original data as backup)
  mockProducts: Product[] = [
    {
      id: 'P001',
      name: 'Blueberry',
      category: 'Fruit',
      price: '55 L.E.',
      sales: 'Low',
      expiryDate: 'in 4 days',
      avgProfit: '+0.3%',
      warning: 'High'
    },
    {
      id: 'P002',
      name: 'Strawberry',
      category: 'Fruit',
      price: '45 L.E.',
      sales: 'Medium',
      expiryDate: 'in 2 days',
      avgProfit: '+1.2%',
      warning: 'Low'
    },
    {
      id: 'P003',
      name: 'Apple iPhone 14',
      category: 'Electronics',
      price: '25000 L.E.',
      sales: 'High',
      expiryDate: 'N/A',
      avgProfit: '+15.5%',
      warning: 'Low'
    },
    {
      id: 'P004',
      name: 'Samsung Galaxy S23',
      category: 'Electronics',
      price: '22000 L.E.',
      sales: 'High',
      expiryDate: 'N/A',
      avgProfit: '+12.8%',
      warning: 'Low'
    },
    {
      id: 'P005',
      name: 'Face Moisturizer',
      category: 'Beauty',
      price: '180 L.E.',
      sales: 'Medium',
      expiryDate: 'in 30 days',
      avgProfit: '+8.7%',
      warning: 'Low'
    },
    {
      id: 'P006',
      name: 'Organic Banana',
      category: 'Fruit',
      price: '25 L.E.',
      sales: 'Low',
      expiryDate: 'in 1 day',
      avgProfit: '-2.1%',
      warning: 'High'
    },
    {
      id: 'P007',
      name: 'Potato Chips',
      category: 'Snacks',
      price: '15 L.E.',
      sales: 'Medium',
      expiryDate: 'in 60 days',
      avgProfit: '+5.4%',
      warning: 'Low'
    },
    {
      id: 'P008',
      name: 'Cleaning Spray',
      category: 'Household',
      price: '35 L.E.',
      sales: 'Low',
      expiryDate: 'in 90 days',
      avgProfit: '+3.2%',
      warning: 'Low'
    },
    {
      id: 'P009',
      name: 'Orange Juice',
      category: 'Fruit',
      price: '20 L.E.',
      sales: 'Medium',
      expiryDate: 'in 3 days',
      avgProfit: '+2.8%',
      warning: 'High'
    },
    {
      id: 'P010',
      name: 'Wireless Mouse',
      category: 'Electronics',
      price: '450 L.E.',
      sales: 'Low',
      expiryDate: 'N/A',
      avgProfit: '+7.9%',
      warning: 'Low'
    },
    {
      id: 'P011',
      name: 'Shampoo',
      category: 'Beauty',
      price: '120 L.E.',
      sales: 'High',
      expiryDate: 'in 180 days',
      avgProfit: '+11.3%',
      warning: 'Low'
    },
    {
      id: 'P012',
      name: 'Chocolate Bar',
      category: 'Snacks',
      price: '12 L.E.',
      sales: 'High',
      expiryDate: 'in 45 days',
      avgProfit: '+6.7%',
      warning: 'Low'
    },
    {
      id: 'P013',
      name: 'Dish Soap',
      category: 'Household',
      price: '28 L.E.',
      sales: 'Medium',
      expiryDate: 'in 120 days',
      avgProfit: '+4.1%',
      warning: 'Low'
    },
    {
      id: 'P014',
      name: 'Mango',
      category: 'Fruit',
      price: '40 L.E.',
      sales: 'Low',
      expiryDate: 'in 2 days',
      avgProfit: '-1.5%',
      warning: 'High'
    },
    {
      id: 'P015',
      name: 'Laptop Stand',
      category: 'Electronics',
      price: '350 L.E.',
      sales: 'Low',
      expiryDate: 'N/A',
      avgProfit: '+9.2%',
      warning: 'Low'
    }
  ];

  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  // Filter properties
  searchTerm: string = '';
  selectedWarningType: string = '';
  selectedCategory: string = '';

  // Sorting properties
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // PrimeNG dropdown options
  warningOptions = [
    { label: 'All Warning Types', value: '' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  categoryOptions = [
    { label: 'All Categories', value: '' },
    { label: 'Smartphones', value: 'Smartphones' },
    { label: 'Laptops', value: 'Laptops' },
    { label: 'Tablets', value: 'Tablets' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Furniture', value: 'Furniture' },
    { label: 'Books', value: 'Books' },
    { label: 'Sports & Outdoors', value: 'Sports & Outdoors' },
    { label: 'Beauty & Health', value: 'Beauty & Health' },
    { label: 'Toys & Games', value: 'Toys & Games' },
    { label: 'Automotive', value: 'Automotive' },
    { label: 'Food & Beverages', value: 'Food & Beverages' },
    { label: 'Jewelry', value: 'Jewelry' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('🚀 Products Component initialized');
    console.log('🌐 Environment API URL:', 'http://13.38.195.203:3000');

    this.checkAuthenticationStatus();
    this.loadProductsFromAPI();
    // Re-enable animations now that we're using PrimeNG
    this.initializeAnimations();
  }

  private checkAuthenticationStatus() {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');

    console.log('🔐 Authentication Status Check:');
    console.log('🔑 Token exists:', !!token);
    console.log('🔑 Token length:', token ? token.length : 0);
    console.log('🔑 Token preview:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
    console.log('👤 Current user exists:', !!currentUser);
    console.log('👤 Current user:', currentUser ? JSON.parse(currentUser) : 'NO USER');
    console.log('📋 All localStorage keys:', Object.keys(localStorage));

    if (!token) {
      console.error('❌ CRITICAL: No authentication token found!');
      console.log('💡 User needs to login to access API endpoints');
      this.handleNoAuthentication();
    } else {
      console.log('✅ Authentication token found, proceeding with API calls');
    }
  }

  private handleNoAuthentication() {
    console.log('🚨 Handling no authentication scenario');

    // Show user-friendly message
    const shouldRedirect = confirm(
      'Authentication required!\n\n' +
      'You need to login to access products data.\n' +
      'Would you like to go to the login page now?'
    );

    if (shouldRedirect) {
      console.log('🔄 Redirecting to login page');
      this.router.navigate(['/auth']);
    } else {
      console.log('📦 User chose to stay, showing mock data');
      // Load mock data as fallback
      this.allProducts = [...this.mockProducts];
      this.filteredProducts = [...this.allProducts];
      this.updatePagination();
    }
  }

  private handleAuthenticationError() {
    console.log('🚨 Handling authentication error');
    this.isLoading = false;

    // Clear potentially invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    console.log('🗑️ Cleared invalid authentication data');

    const shouldRedirect = confirm(
      'Authentication Error!\n\n' +
      'Your session has expired or is invalid.\n' +
      'Please login again to access products data.\n\n' +
      'Would you like to go to the login page now?'
    );

    if (shouldRedirect) {
      console.log('🔄 Redirecting to login page due to auth error');
      this.router.navigate(['/auth']);
    } else {
      console.log('📦 User chose to stay, showing mock data after auth error');
      this.allProducts = [...this.mockProducts];
      this.filteredProducts = [...this.allProducts];
      this.updatePagination();
    }
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredProducts = this.allProducts.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesWarning = !this.selectedWarningType || 
        product.warning === this.selectedWarningType;
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;
      
      return matchesSearch && matchesWarning && matchesCategory;
    });
    
    this.currentPage = 1;
    this.updatePagination();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredProducts.sort((a, b) => {
      let aValue = a[column as keyof Product];
      let bValue = b[column as keyof Product];

      // Handle numeric values for profit
      if (column === 'avgProfit') {
        const aNum = parseFloat(aValue.replace(/[+%]/g, ''));
        const bNum = parseFloat(bValue.replace(/[+%]/g, ''));
        return this.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // String comparison
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.updatePagination();
  }

  getSortClass(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection;
  }

  getProfitClass(profit: string): string {
    return profit.startsWith('+') ? 'positive' : 'negative';
  }

  // PrimeNG severity methods
  getSalesSeverity(sales: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (sales?.toLowerCase()) {
      case 'high': return 'success';
      case 'medium': case 'mid': return 'warning';
      case 'low': return 'danger';
      default: return 'info';
    }
  }

  getProfitSeverity(profit: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    if (profit?.startsWith('+')) {
      const value = parseFloat(profit.replace(/[+%]/g, ''));
      if (value > 20) return 'success';
      if (value > 10) return 'warning';
      return 'info';
    }
    return 'danger';
  }

  getWarningSeverity(warning: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (warning?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': case 'mid': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  }

  // Summary methods
  getHighWarningCount(): number {
    return this.filteredProducts.filter(p => p.warning?.toLowerCase() === 'high').length;
  }

  getProfitableCount(): number {
    return this.filteredProducts.filter(p => p.avgProfit?.startsWith('+')).length;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
  }

  getWarningClass(warning: string): string {
    return warning.toLowerCase();
  }

  analyzeProduct(productId: string) {
    console.log('Analyzing product:', productId);

    this.dashboardService.analyzeProduct(productId).subscribe({
      next: (response) => {
        console.log('Product analysis result:', response);
        // You can add logic here to show analysis results in a modal or navigate to analysis page
        alert('Product analysis completed! Check console for details.');
      },
      error: (error) => {
        console.error('Error analyzing product:', error);
        alert('Error analyzing product. Please try again.');
      }
    });
  }

  refreshData() {
    console.log('🔄 Refreshing products data...');
    this.searchTerm = '';
    this.selectedWarningType = '';
    this.selectedCategory = '';

    // First try to refresh the AI table data
    this.dashboardService.refreshAITable().subscribe({
      next: (response) => {
        console.log('✅ AI Table refresh response:', response);
        // After refresh, reload the data
        this.loadProductsFromAPI();
      },
      error: (error) => {
        console.warn('⚠️ AI Table refresh failed, loading data anyway:', error);
        // Even if refresh fails, still try to load the data
        this.loadProductsFromAPI();
      }
    });
  }





  loadProductsFromAPI() {
    this.isLoading = true;

    const token = localStorage.getItem('token');
    if (!token) {
      this.allProducts = [...this.mockProducts];
      this.filteredProducts = [...this.allProducts];
      this.updatePagination();
      this.isLoading = false;
      return;
    }

    const filters = {
      search: this.searchTerm || undefined,
      warningType: this.selectedWarningType || undefined,
      category: this.selectedCategory || undefined
    };

    this.dashboardService.getAITableData(this.currentPage, this.itemsPerPage, filters)
      .subscribe({
        next: (response) => {
          let dataArray: any[] = [];

          if (response && response.success && response.data && Array.isArray(response.data)) {
            dataArray = response.data;
          } else if (response && response.data && Array.isArray(response.data)) {
            dataArray = response.data;
          } else if (response && Array.isArray(response)) {
            dataArray = response;
          } else {
            this.allProducts = [...this.mockProducts];
            this.filteredProducts = [...this.allProducts];
            this.updatePagination();
            this.isLoading = false;
            return;
          }

          this.allProducts = this.transformAPIData(dataArray);

          if (this.allProducts.length === 0) {
            this.allProducts = [...this.mockProducts];
          }

          this.filteredProducts = [...this.allProducts];
          this.updatePagination();
          this.isLoading = false;
        },
        error: (error) => {
          if (error.status === 401) {
            this.handleAuthenticationError();
            return;
          }

          this.allProducts = [...this.mockProducts];
          this.filteredProducts = [...this.allProducts];
          this.updatePagination();
          this.isLoading = false;
        }
      });
  }

  private transformAPIData(rawData: any[]): Product[] {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    return rawData.map((item, index) => ({
      id: item.id || item.productId || item.product_id || item._id || `P${String(index + 1).padStart(3, '0')}`,
      name: item.Name || item.name || item.productName || item.product_name || item.title || `Product ${index + 1}`,
      category: item.Category || item.category || item.productCategory || item.product_category || item.type || 'Unknown',
      price: this.formatPrice(item.Price || item.price || item.productPrice || item.product_price || item.cost || 0),
      sales: item.Sales || item.sales || item.salesLevel || item.sales_level || item.volume || 'Unknown',
      expiryDate: this.formatDate(item['Expiry date'] || item.expiryDate || item.expiry_date || item.expiration || item.expires_at),
      avgProfit: this.formatProfit(item['Avg. profit'] || item.avgProfit || item.avg_profit || item.profit || item.profitMargin || item.margin || 0),
      warning: this.formatWarning(item.Warning || item.warning || item.warningLevel || item.warning_level || item.risk || item.status)
    }));
  }

  private formatPrice(price: any): string {
    if (!price) return '0 L.E.';
    if (typeof price === 'string' && price.includes('L.E.')) return price;
    if (typeof price === 'string' && price.includes('$')) return price.replace('$', '') + ' L.E.';
    if (typeof price === 'number') return `${price} L.E.`;
    if (typeof price === 'string' && !isNaN(Number(price))) return `${price} L.E.`;
    return price?.toString() || '0 L.E.';
  }

  private formatDate(date: any): string {
    if (!date) return 'N/A';
    if (typeof date === 'string' && date.includes('in ')) return date;
    if (typeof date === 'string' && date.includes('days')) return date;
    // Try to parse as date and calculate days
    try {
      const dateObj = new Date(date);
      const now = new Date();
      const diffTime = dateObj.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) return `in ${diffDays} days`;
      if (diffDays === 0) return 'today';
      return `${Math.abs(diffDays)} days ago`;
    } catch {
      return date?.toString() || 'N/A';
    }
  }

  private formatProfit(profit: any): string {
    if (typeof profit === 'string' && profit.includes('%')) return profit;
    if (typeof profit === 'number') {
      return profit >= 0 ? `+${profit}%` : `${profit}%`;
    }
    if (typeof profit === 'string' && !isNaN(Number(profit))) {
      const num = Number(profit);
      return num >= 0 ? `+${num}%` : `${num}%`;
    }
    return profit?.toString() || '+0%';
  }

  private formatWarning(warning: any): string {
    if (!warning) return 'Low';
    const warningStr = warning.toString().toLowerCase();
    if (warningStr.includes('high') || warningStr.includes('critical') || warningStr.includes('urgent')) return 'High';
    if (warningStr.includes('mid') || warningStr.includes('medium') || warningStr.includes('moderate')) return 'Medium';
    return 'Low';
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

    // Calculate start and end indices for current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Update paginated products
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);

    console.log('📄 Pagination updated:', {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalItems: this.filteredProducts.length,
      itemsPerPage: this.itemsPerPage,
      startIndex,
      endIndex,
      paginatedCount: this.paginatedProducts.length
    });

    console.log('📄 Paginated products sample:', this.paginatedProducts.slice(0, 2));
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  private initializeAnimations() {
    setTimeout(() => {
      this.animateElementsOnLoad();
      this.animateTableRows();
    }, 100);
  }

  private animateElementsOnLoad() {
    // Animate main sections with staggered delays
    const elements = [
      { selector: '.products-header', delay: 100 },
      { selector: '.filters-section', delay: 200 },
      { selector: '.table-container', delay: 300 },
      { selector: '.pagination', delay: 400 }
    ];

    elements.forEach(({ selector, delay }) => {
      const element = document.querySelector(selector);
      if (element) {
        setTimeout(() => {
          element.classList.add('animated');
        }, delay);
      }
    });
  }

  private animateTableRows() {
    // Animate table rows with staggered delays
    const rows = document.querySelectorAll('.products-table tbody tr');
    rows.forEach((row, index) => {
      setTimeout(() => {
        row.classList.add('animated');
      }, 500 + (index * 50));
    });
  }

  // New filter helper methods
  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.selectedWarningType = '';
    this.selectedCategory = '';
    this.onFilterChange();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedWarningType || this.selectedCategory);
  }
}
