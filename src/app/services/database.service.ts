import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private baseUrl = 'http://13.38.195.203:3000/api/rag/databases';

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
    return this.http.post<CreateDatabaseResponse | Database>(this.baseUrl, database, {
      headers: this.getHeaders()
    });
  }


}
