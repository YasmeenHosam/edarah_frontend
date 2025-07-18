import { Component, OnInit } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AIAssistantService, AnalysisRequest, AnalysisResponse, RecommendationExplainRequest, RecommendationExplainResponse } from '../../services/ai-assistant.service';
import { DatabaseService, Database } from '../../services/database.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KeyValuePipe, SidebarComponent],
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css']
})
export class AIAssistantComponent implements OnInit {
  questionForm: FormGroup;
  databases: Database[] = [];
  selectedDatabase: Database | null = null;
  isLoading = false;
  isAnalyzing = false;
  analysisResult: AnalysisResponse | null = null;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  expandedRecommendations: { [key: number]: RecommendationExplainResponse | null } = {};
  loadingRecommendations: { [key: number]: boolean } = {};

  // Predefined questions for quick access
  quickQuestions = [
    'Show me products with the lowest sales this month',
    'Which items are at risk of expiring soon?',
    'Which products are causing losses?',
    "What's the best price to stay competitive?",
    'What are the most urgent risks today?',
    "Give me a quick summary of today's product performance",
    'Which products are dropping in performance?',
    'Which branch should get the promotion?',
    "What's my average profit margin this week?"
  ];

  constructor(
    private fb: FormBuilder,
    private aiAssistantService: AIAssistantService,
    private databaseService: DatabaseService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      databaseId: ['', Validators.required],
      question: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    this.loadDatabases();
  }

  loadDatabases() {
    this.isLoading = true;
    this.databaseService.getDatabases().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.databases = response;
        } else if (response && response.success && response.data) {
          this.databases = response.data;
        } else {
          this.databases = [];
        }
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

  onDatabaseChange(event: any) {
    const databaseId = event.target.value;
    this.selectedDatabase = this.databases.find(db => db.id === databaseId) || null;
  }

  selectQuickQuestion(question: string) {
    this.questionForm.patchValue({ question });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      this.isAnalyzing = true;
      this.analysisResult = null;
      
      const formData: AnalysisRequest = {
        databaseId: this.questionForm.value.databaseId,
        question: this.questionForm.value.question,
        conversationLanguage: 'false'
      };

      this.aiAssistantService.analyzeData(formData).subscribe({
        next: (response) => {
          this.analysisResult = response;
          this.showMessage('Analysis completed successfully!', 'success');
          this.isAnalyzing = false;
        },
        error: (error) => {
          console.error('Error analyzing data:', error);
          this.showMessage(
            error.error?.message || 'Error analyzing data. Please try again.',
            'error'
          );
          this.isAnalyzing = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.questionForm.controls).forEach(key => {
      this.questionForm.get(key)?.markAsTouched();
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
    const field = this.questionForm.get(fieldName);
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

  goToMarketingPlan() {
    this.router.navigate(['/dashboard/marketing-plan']);
  }

  expandRecommendation(recommendation: string, index: number) {
    // Check if already expanded
    if (this.expandedRecommendations[index]) {
      this.expandedRecommendations[index] = null;
      return;
    }

    this.loadingRecommendations[index] = true;

    const request: RecommendationExplainRequest = {
      recommendation: recommendation
    };

    this.aiAssistantService.explainRecommendation(request).subscribe({
      next: (response) => {
        this.expandedRecommendations[index] = response;
        this.loadingRecommendations[index] = false;
      },
      error: (error) => {
        console.error('Error explaining recommendation:', error);
        this.showMessage(
          error.error?.message || 'Error explaining recommendation. Please try again.',
          'error'
        );
        this.loadingRecommendations[index] = false;
      }
    });
  }

  isRecommendationExpanded(index: number): boolean {
    return !!this.expandedRecommendations[index];
  }

  isRecommendationLoading(index: number): boolean {
    return !!this.loadingRecommendations[index];
  }
}
