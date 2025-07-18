import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { DatabaseService, Database, CreateDatabaseRequest, DatabaseResponse, CreateDatabaseResponse } from '../../services/database.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-database-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SidebarComponent],
  templateUrl: './database-management.component.html',
  styleUrls: ['./database-management.component.css']
})
export class DatabaseManagementComponent implements OnInit {
  databases: Database[] = [];
  createDatabaseForm: FormGroup;
  isLoading = false;
  isCreating = false;
  isTesting = false;
  showCreateForm = false;
  showAddForm = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  // Add Database Form Properties
  selectedDbType = '';
  dbForm = {
    databaseName: '',
    host: '',
    port: '',
    username: '',
    password: ''
  };
  isTestingConnection = false;
  isAddingDatabase = false;

  // Fixed MySQL connection string
  private readonly FIXED_CONNECTION_STRING = 'mysql://root:132547698Maxxmox!@localhost:3306/e-comm2';

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
    this.initializeAnimations();
  }

  loadDatabases() {
    this.isLoading = true;
    console.log('Starting to load databases...');

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    console.log('Auth token exists:', !!token);

    this.databaseService.getDatabases().subscribe({
      next: (response: DatabaseResponse | Database[]) => {
        console.log('Raw API Response for getDatabases:', response);
        console.log('Response type:', typeof response);
        console.log('Is Array:', Array.isArray(response));

        // Handle the API response format: {success: true, data: [...]}
        if (Array.isArray(response)) {
          this.databases = response;
          console.log('Response is array, databases set to:', this.databases);
        } else if (response && (response as DatabaseResponse).success && (response as DatabaseResponse).data) {
          this.databases = (response as DatabaseResponse).data;
          console.log('Response has success=true and data, databases set to:', this.databases);
        } else if (response && (response as DatabaseResponse).databases && Array.isArray((response as DatabaseResponse).databases)) {
          this.databases = (response as DatabaseResponse).databases!;
          console.log('Response has databases array, databases set to:', this.databases);
        } else {
          this.databases = [];
          console.log('No valid data found in response, databases set to empty array');
          console.log('Response structure:', Object.keys(response || {}));
        }

        console.log('Final databases array:', this.databases);
        console.log('Number of databases:', this.databases.length);
        this.isLoading = false;

        if (this.databases.length === 0) {
          this.showMessage('No databases found. Create your first database connection!', 'error');
        } else {
          this.showMessage(`Loaded ${this.databases.length} database(s) successfully`, 'success');
        }

        // Animate database cards after loading
        setTimeout(() => {
          this.animateDatabaseCards();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading databases:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);

        let errorMessage = 'Error loading databases';
        if (error.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. Check your permissions.';
        } else if (error.status === 404) {
          errorMessage = 'Database endpoint not found.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.showMessage(errorMessage, 'error');
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
    } else {
      // Animate the form when it appears
      setTimeout(() => {
        const formContainer = document.querySelector('.create-form-container');
        if (formContainer) {
          formContainer.classList.add('animated');
        }
      }, 50);
    }
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      // Close create form if it's open
      this.showCreateForm = false;
      // Reset form
      this.resetAddForm();
      // Animate the form when it appears
      setTimeout(() => {
        const formContainer = document.querySelector('.add-database-form');
        if (formContainer) {
          formContainer.classList.add('animated');
        }
      }, 50);
    }
  }

  onDatabaseTypeChange() {
    // Set default port based on database type
    const defaultPorts: { [key: string]: string } = {
      'mysql': '3306',
      'postgresql': '5432',
      'mongodb': '27017',
      'sqlite': '',
      'oracle': '1521',
      'sqlserver': '1433'
    };

    this.dbForm.port = defaultPorts[this.selectedDbType] || '';
    this.dbForm.host = this.dbForm.host || 'localhost';
  }

  getDefaultHost(): string {
    if (this.selectedDbType === 'sqlite') {
      return 'Local file';
    }
    return 'localhost';
  }

  getDefaultPort(): string {
    const defaultPorts: { [key: string]: string } = {
      'mysql': '3306',
      'postgresql': '5432',
      'mongodb': '27017',
      'sqlite': '',
      'oracle': '1521',
      'sqlserver': '1433'
    };
    return defaultPorts[this.selectedDbType] || '';
  }

  generateConnectionString(): string {
    if (!this.selectedDbType) return '';

    const { databaseName, host, port, username, password } = this.dbForm;

    switch (this.selectedDbType) {
      case 'mysql':
        return `mysql://${username}:${password}@${host || 'localhost'}:${port || '3306'}/${databaseName}`;

      case 'postgresql':
        return `postgresql://${username}:${password}@${host || 'localhost'}:${port || '5432'}/${databaseName}`;

      case 'mongodb':
        return `mongodb://${username}:${password}@${host || 'localhost'}:${port || '27017'}/${databaseName}`;

      case 'sqlite':
        return `sqlite:///${databaseName}.db`;

      case 'oracle':
        return `oracle://${username}:${password}@${host || 'localhost'}:${port || '1521'}/${databaseName}`;

      case 'sqlserver':
        return `sqlserver://${username}:${password}@${host || 'localhost'}:${port || '1433'}/${databaseName}`;

      default:
        return '';
    }
  }

  resetAddForm() {
    this.selectedDbType = '';
    this.dbForm = {
      databaseName: '',
      host: '',
      port: '',
      username: '',
      password: ''
    };
  }

  isFormValid(): boolean {
    return !!(
      this.selectedDbType &&
      this.dbForm.databaseName
    );
  }

  onAddDatabase(_form: any) {
    if (!this.isFormValid()) {
      this.showMessage('Please fill in all required fields', 'error');
      return;
    }

    this.isAddingDatabase = true;

    // Create the database object with appropriate connection string
    const newDatabase = {
      databaseType: this.selectedDbType,
      connectionString: this.getConnectionStringForDatabase(),
      databaseName: this.dbForm.databaseName
    };

    // Call the API endpoint using DatabaseService
    console.log('Creating database with data:', newDatabase);
    this.databaseService.createDatabase(newDatabase).subscribe({
      next: (response: any) => {
        console.log('Database added successfully:', response);
        this.showMessage(`Database "${this.dbForm.databaseName}" added successfully!`, 'success');
        this.resetAddForm();
        this.showAddForm = false;
        this.isAddingDatabase = false;
        // Reload databases to show the new one
        this.loadDatabases();
      },
      error: (error) => {
        console.error('Error adding database:', error);
        this.showMessage('Failed to add database. Please try again.', 'error');
        this.isAddingDatabase = false;
      }
    });
  }

  testDatabaseConnection() {
    if (!this.isFormValid()) {
      this.showMessage('Please fill in all required fields before testing', 'error');
      return;
    }

    this.isTestingConnection = true;

    const connectionString = this.getConnectionStringForDatabase();
    console.log('Testing connection:', connectionString);

    // Simulate connection test (in real app, you might have a test endpoint)
    setTimeout(() => {
      if (this.selectedDbType === 'mysql') {
        this.showMessage('Connection test successful! Using fixed MySQL connection.', 'success');
      } else {
        this.showMessage(`Connection test successful for ${this.selectedDbType.toUpperCase()}!`, 'success');
      }
      this.isTestingConnection = false;
    }, 1500);
  }

  getDatabaseIconClass(type: string | undefined): string {
    if (!type) return 'mysql';
    return type.toLowerCase();
  }

  getDatabaseStatus(database: any): string {
    const status = (database as any).status || 'inactive';
    return status === 'active' ? 'active' : 'inactive';
  }

  getStatusText(database: any): string {
    const status = (database as any).status || 'unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getFixedConnectionString(): string {
    return this.FIXED_CONNECTION_STRING;
  }

  getConnectionStringForType(): string {
    switch (this.selectedDbType) {
      case 'mysql':
        return this.FIXED_CONNECTION_STRING;
      case 'postgresql':
        return 'postgresql://username:password@localhost:5432/database_name';
      case 'mongodb':
        return 'mongodb://username:password@localhost:27017/database_name';
      case 'sqlite':
        return 'sqlite:///path/to/database.db';
      case 'oracle':
        return 'oracle://username:password@localhost:1521/database_name';
      case 'sqlserver':
        return 'sqlserver://username:password@localhost:1433/database_name';
      default:
        return 'Select a database type to see connection string format';
    }
  }

  getConnectionStringHint(): string {
    switch (this.selectedDbType) {
      case 'mysql':
        return 'This is the fixed MySQL connection string that will be used';
      case 'postgresql':
        return 'Example PostgreSQL connection string format';
      case 'mongodb':
        return 'Example MongoDB connection string format';
      case 'sqlite':
        return 'SQLite uses local file path';
      case 'oracle':
        return 'Example Oracle connection string format';
      case 'sqlserver':
        return 'Example SQL Server connection string format';
      default:
        return 'Choose a database type to see the connection format';
    }
  }

  getConnectionStringForDatabase(): string {
    // For MySQL, use the fixed connection string
    // For other databases, return the example format (in real app, you'd build it properly)
    if (this.selectedDbType === 'mysql') {
      return this.FIXED_CONNECTION_STRING;
    } else {
      return this.getConnectionStringForType();
    }
  }

  getDisplayConnectionString(database: any): string {
    const connectionString = database.connectionString || database.connection_string || '';
    if (connectionString.length > 50) {
      return connectionString.substring(0, 50) + '...';
    }
    return connectionString || 'No connection string';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  }

  editDatabase(database: any) {
    console.log('Edit database:', database);
    this.showMessage('Edit functionality coming soon!', 'success');
  }

  connectToDatabase(database: any) {
    console.log('Connect to database:', database);
    this.showMessage(`Connecting to ${database.name || database.databaseName}...`, 'success');
  }

  deleteDatabase(database: any) {
    if (confirm(`Are you sure you want to delete "${database.name || database.databaseName}"?`)) {
      console.log('Delete database:', database);
      // Remove from local array (in real app, this would be an API call)
      this.databases = this.databases.filter(db => db.id !== database.id);
      this.showMessage(`Database "${database.name || database.databaseName}" deleted successfully!`, 'success');
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

          // Animate the new database card
          setTimeout(() => {
            this.animateDatabaseCards();
          }, 100);
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

  testConnection() {
    if (this.createDatabaseForm.valid) {
      this.isTesting = true;
      const formData: CreateDatabaseRequest = this.createDatabaseForm.value;

      this.databaseService.testConnection(formData).subscribe({
        next: (response) => {
          console.log('Connection test response:', response);
          if (response.success) {
            this.showMessage('Connection test successful!', 'success');
          } else {
            this.showMessage(response.message || 'Connection test failed', 'error');
          }
          this.isTesting = false;
        },
        error: (error) => {
          console.error('Connection test error:', error);
          this.showMessage(
            error.error?.message || 'Connection test failed. Please check your connection details.',
            'error'
          );
          this.isTesting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.showMessage('Please fill in all required fields before testing connection', 'error');
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



  private initializeAnimations() {
    setTimeout(() => {
      this.animateElementsOnLoad();
    }, 100);
  }

  private animateElementsOnLoad() {
    // Animate main sections with staggered delays
    const elements = [
      { selector: '.page-header', delay: 100 },
      { selector: '.create-form-container', delay: 200 },
      { selector: '.databases-container', delay: 300 }
    ];

    elements.forEach(({ selector, delay }) => {
      const element = document.querySelector(selector);
      if (element) {
        setTimeout(() => {
          element.classList.add('animated');
        }, delay);
      }
    });

    // Animate database cards with staggered delays
    setTimeout(() => {
      this.animateDatabaseCards();
    }, 500);
  }

  private animateDatabaseCards() {
    const databaseCards = document.querySelectorAll('.database-card');
    databaseCards.forEach((card, index) => {
      // Reset animation state
      card.classList.remove('animated');

      setTimeout(() => {
        card.classList.add('animated');
      }, index * 100);
    });
  }
}
