import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalysisRequest {
  databaseId: string;
  question: string;
  conversationLanguage: string;
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

@Injectable({
  providedIn: 'root'
})
export class AIAssistantService {
  private apiUrl = 'http://13.38.195.203:3000/api/rag';

  constructor(private http: HttpClient) {}

  analyzeData(request: AnalysisRequest): Observable<AnalysisResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<AnalysisResponse>(`${this.apiUrl}/analyze`, request, { headers });
  }
}
