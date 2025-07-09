import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  sales: string;
  expiryDate: string;
  avgProfit: string;
  warning: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  // Mock data for products
  allProducts: Product[] = [
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

  ngOnInit() {
    this.filteredProducts = [...this.allProducts];
    this.updatePagination();
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
  }

  getSortClass(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection;
  }

  getProfitClass(profit: string): string {
    return profit.startsWith('+') ? 'positive' : 'negative';
  }

  getWarningClass(warning: string): string {
    return warning.toLowerCase();
  }

  analyzeProduct(productId: string) {
    console.log('Analyzing product:', productId);
    // Add analyze logic here
  }

  refreshData() {
    console.log('Refreshing products data...');
    // Add refresh logic here
    this.searchTerm = '';
    this.selectedWarningType = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
