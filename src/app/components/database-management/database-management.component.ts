import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService, Database, CreateDatabaseRequest, DatabaseResponse, CreateDatabaseResponse } from '../../services/database.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-database-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './database-management.component.html',
  styleUrls: ['./database-management.component.css']
})
export class DatabaseManagementComponent implements OnInit {
  databases: Database[] = [];
  createDatabaseForm: FormGroup;
  isLoading = false;
  isCreating = false;
  showCreateForm = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  databaseTypes = [
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'oracle', label: 'Oracle' },
    { value: 'sqlserver', label: 'SQL Server' }
  ];

  constructor(
    private databaseService: DatabaseService,
    private fb: FormBuilder
  ) {
    // Ensure databases is always an array
    this.databases = [];

    this.createDatabaseForm = this.fb.group({
      databaseType: ['mysql', Validators.required],
      connectionString: ['', Validators.required],
      databaseName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.loadDatabases();
  }

  loadDatabases() {
    this.isLoading = true;
    this.databaseService.getDatabases().subscribe({
      next: (response: DatabaseResponse | Database[]) => {
        console.log('API Response for getDatabases:', response);

        // Handle the API response format: {success: true, data: [...]}
        if (Array.isArray(response)) {
          this.databases = response;
        } else if (response && (response as DatabaseResponse).success && (response as DatabaseResponse).data) {
          this.databases = (response as DatabaseResponse).data;
        } else if (response && (response as DatabaseResponse).databases && Array.isArray((response as DatabaseResponse).databases)) {
          this.databases = (response as DatabaseResponse).databases!;
        } else {
          this.databases = [];
        }

        console.log('Final databases array:', this.databases);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading databases:', error);
        this.showMessage('Error loading databases', 'error');
        this.databases = [];
        this.isLoading = false;
      }
    });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.createDatabaseForm.reset({
        databaseType: 'mysql',
        connectionString: '',
        databaseName: ''
      });
      this.clearMessage();
    }
  }

  onSubmit() {
    if (this.createDatabaseForm.valid) {
      this.isCreating = true;
      const formData: CreateDatabaseRequest = this.createDatabaseForm.value;

      this.databaseService.createDatabase(formData).subscribe({
        next: (response: CreateDatabaseResponse | Database) => {
          console.log('API Response for createDatabase:', response);

          // Handle the response properly - API returns {success: true, data: {...}}
          let newDatabase: Database;
          if (response && (response as CreateDatabaseResponse).success && (response as CreateDatabaseResponse).data) {
            newDatabase = (response as CreateDatabaseResponse).data;
          } else if (response && (response as CreateDatabaseResponse).database) {
            newDatabase = (response as CreateDatabaseResponse).database!;
          } else {
            newDatabase = response as Database;
          }

          // Ensure databases is an array before pushing
          if (!Array.isArray(this.databases)) {
            this.databases = [];
          }

          this.databases.push(newDatabase);
          console.log('Updated databases array:', this.databases);

          this.showMessage('Database created successfully!', 'success');
          this.createDatabaseForm.reset({
            databaseType: 'mysql',
            connectionString: '',
            databaseName: ''
          });
          this.showCreateForm = false;
          this.isCreating = false;
        },
        error: (error) => {
          console.error('Error creating database:', error);
          this.showMessage(
            error.error?.message || 'Error creating database. Please try again.',
            'error'
          );
          this.isCreating = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }



  private markFormGroupTouched() {
    Object.keys(this.createDatabaseForm.controls).forEach(key => {
      this.createDatabaseForm.get(key)?.markAsTouched();
    });
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  private clearMessage() {
    this.message = '';
    this.messageType = '';
  }

  getFieldError(fieldName: string): string {
    const field = this.createDatabaseForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
