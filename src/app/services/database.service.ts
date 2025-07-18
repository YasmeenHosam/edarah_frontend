import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Database {
  id?: string;
  name: string;
  type: string;
  createdAt?: string;
  lastSchemaUpdate?: string;
  // Keep old properties for backward compatibility
  databaseType?: string;
  connectionString?: string;
  databaseName?: string;
  updatedAt?: string;
}

export interface CreateDatabaseRequest {
  databaseType: string;
  connectionString: string;
  databaseName: string;
}

export interface DatabaseResponse {
  success: boolean;
  data: Database[];
  databases?: Database[];
  [key: string]: any;
}

export interface CreateDatabaseResponse {
  success: boolean;
  data: Database;
  database?: Database;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private baseUrl = `${environment.apiUrl}/api/rag/databases`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // GET /api/rag/databases - Get all databases
  getDatabases(): Observable<DatabaseResponse | Database[]> {
    return this.http.get<DatabaseResponse | Database[]>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }

  // POST /api/rag/databases - Create new database
  createDatabase(database: CreateDatabaseRequest): Observable<CreateDatabaseResponse | Database> {
    console.log('DatabaseService: Making POST request to:', this.baseUrl);
    console.log('DatabaseService: Request data:', database);
    return this.http.post<CreateDatabaseResponse | Database>(this.baseUrl, database, {
      headers: this.getHeaders()
    });
  }

  // POST /api/rag/databases/test - Test database connection
  testConnection(database: CreateDatabaseRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/test`, database, {
      headers: this.getHeaders()
    });
  }

  // DELETE /api/rag/databases/:id - Delete database
  deleteDatabase(databaseId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${databaseId}`, {
      headers: this.getHeaders()
    });
  }
}
