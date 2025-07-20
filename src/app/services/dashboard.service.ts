import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  sales: string;
  expiryDate: string;
  avgProfit: string;
  warning: string;
}

export interface AITableResponse {
  success: boolean;
  data: Product[];
  message?: string;
  totalCount?: number;
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalProducts: number;
  highRiskProducts: number;
  lowStockProducts: number;
  expiringSoon: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message?: string;
}

export interface ProductAnalysisResponse {
  success: boolean;
  data: {
    salesChart: {
      months: string[];
      sales: number[];
      profit_loss: number[];
    };
    prices: Array<{
      price: number | string;
      date: string;
      suggested_price?: number;
      suggestedPrice?: number | string;
    }>;
    expectedSales: {
      total_expected_revenue: number;
      expected_rate: string;
      most_likely_sales_time: string;
      expected_units_sold: number;
    };
    warning: {
      type: string;
      short_notice: string;
      suggestion: string;
    };
    smartSuggestions: Array<{
      title: string;
      description: string;
      benefits: string[];
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {
    console.log('🏗️ DashboardService initialized');
    console.log('🌐 Environment API URL:', environment.apiUrl);
    console.log('🎯 Dashboard Base URL:', this.baseUrl);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔑 Getting headers - Token exists:', !!token);
    console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

    if (!token) {
      console.error('❌ No authentication token found in localStorage');
      console.log('💡 Available localStorage keys:', Object.keys(localStorage));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    console.log('📋 Headers created:', {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'NO AUTH HEADER'
    });

    return headers;
  }

  /**
   * Get AI Table data for products
   * @param page - Page number (optional)
   * @param limit - Items per page (optional)
   * @param filters - Filter parameters (optional)
   */
  getAITableData(page?: number, limit?: number, filters?: any): Observable<AITableResponse> {
    let url = `${this.baseUrl}/ai-table`;
    const params = new URLSearchParams();

    console.log('🌐 Dashboard Service - Building AI Table request');
    console.log('🔗 Base URL:', this.baseUrl);
    console.log('📄 Page:', page, 'Limit:', limit);
    console.log('🔍 Filters:', filters);

    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
          console.log(`🏷️ Added filter: ${key} = ${filters[key]}`);
        }
      });
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log('🎯 Final API URL:', url);
    console.log('🔑 Headers:', this.getHeaders());

    return this.http.get<AITableResponse>(url, { headers: this.getHeaders() });
  }

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${this.baseUrl}/stats`, { 
      headers: this.getHeaders() 
    });
  }

  /**
   * Analyze specific product
   * @param productName - Product name to analyze
   */
  analyzeProduct(productName: string): Observable<ProductAnalysisResponse> {
    return this.http.post<ProductAnalysisResponse>(`${this.baseUrl}/product-analysis`,
      { productName },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get product recommendations
   * @param productId - Product ID (optional)
   * @param category - Product category (optional)
   */
  getProductRecommendations(productId?: string, category?: string): Observable<any> {
    const body: any = {};
    if (productId) body.productId = productId;
    if (category) body.category = category;

    return this.http.post<any>(`${this.baseUrl}/recommendations`, 
      body, 
      { headers: this.getHeaders() }
    );
  }

  /**
   * Refresh AI Table data
   */
  refreshAITable(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ai-table/refresh`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }
}
