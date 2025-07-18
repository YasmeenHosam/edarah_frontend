import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AnalysisRequest {
  databaseId: string;
  question: string;
  conversationLanguage: string;
}

export interface MarketingPlanRequest {
  databaseId: string;
  generateImage: boolean;
}

export interface KeyMetrics {
  totalReviews?: number;
  averageRating?: number;
  fiveStarProducts?: number;
  fourStarProducts?: number;
  verifiedReviewRate?: string;
  reviewVelocity?: string;
  [key: string]: any;
}

export interface DataSummary {
  totalRecords: number;
  keyMetrics: KeyMetrics;
}

export interface DatabaseInfo {
  name: string;
  type: string;
}

export interface RateLimit {
  remaining: number;
  resetTime: string;
}

export interface AnalysisData {
  insights: string;
  recommendations: string[];
  dataSummary: DataSummary;
  confidence: number;
  query: string;
  databaseInfo: DatabaseInfo;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  data: AnalysisData;
  rateLimit: RateLimit;
}

export interface MarketingPlanResponse {
  success: boolean;
  plan: string;
  imageUrl: string;
  query: string;
  rateLimit: RateLimit;
}

export interface RecommendationExplainRequest {
  recommendation: string;
}

export interface RecommendationExplainResponse {
  success: boolean;
  message: string;
  data: {
    insights: string;
    availableActions: string[];
    reasoning: string;
    confidence: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AIAssistantService {
  private apiUrl = `${environment.apiUrl}/api/rag`;

  constructor(private http: HttpClient) {}

  analyzeData(request: AnalysisRequest): Observable<AnalysisResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<AnalysisResponse>(`${this.apiUrl}/analyze`, request, { headers });
  }

  getMarketingPlan(request: MarketingPlanRequest): Observable<MarketingPlanResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<MarketingPlanResponse>(`${this.apiUrl}/marketing-plan`, request, { headers });
  }

  explainRecommendation(request: RecommendationExplainRequest): Observable<RecommendationExplainResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<RecommendationExplainResponse>(`${this.apiUrl}/recommendation/explain`, request, { headers });
  }
}
