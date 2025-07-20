import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAnalysisResponse } from '../../../services/dashboard.service';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-product-analysis-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    CardModule,
    TagModule,
    ChartModule,
    ProgressSpinnerModule,
    DividerModule
  ],
  templateUrl: './product-analysis-modal.component.html',
  styleUrls: ['./product-analysis-modal.component.css']
})
export class ProductAnalysisModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() analysisData: ProductAnalysisResponse | null = null;
  @Input() productName: string = '';
  @Input() isLoading: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();

  salesChartData: any;
  salesChartOptions: any;

  ngOnInit() {
    this.initializeChartOptions();
  }

  ngOnChanges() {
    if (this.analysisData && this.analysisData.success) {
      this.setupSalesChart();
    }
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.closeModal.emit();
  }

  private initializeChartOptions() {
    this.salesChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#495057',
            font: {
              family: 'Inter, sans-serif',
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#1A6DC0',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#6c757d',
            font: {
              family: 'Inter, sans-serif',
              size: 11
            }
          },
          grid: {
            color: '#e9ecef'
          }
        },
        y: {
          ticks: {
            color: '#6c757d',
            font: {
              family: 'Inter, sans-serif',
              size: 11
            }
          },
          grid: {
            color: '#e9ecef'
          }
        }
      }
    };
  }

  private setupSalesChart() {
    if (!this.analysisData?.data?.salesChart) return;

    const salesChart = this.analysisData.data.salesChart;
    
    this.salesChartData = {
      labels: salesChart.months,
      datasets: [
        {
          label: 'Sales',
          data: salesChart.sales,
          backgroundColor: 'rgba(26, 109, 192, 0.2)',
          borderColor: '#1A6DC0',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Profit/Loss',
          data: salesChart.profit_loss,
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          borderColor: '#28a745',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

  getWarningIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'inventory warning':
        return 'pi pi-exclamation-triangle';
      case 'stock warning':
        return 'pi pi-box';
      case 'price warning':
        return 'pi pi-dollar';
      default:
        return 'pi pi-info-circle';
    }
  }

  getWarningSeverity(type: string): string {
    switch (type.toLowerCase()) {
      case 'inventory warning':
        return 'warning';
      case 'stock warning':
        return 'danger';
      case 'price warning':
        return 'info';
      default:
        return 'secondary';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getSuggestedPrice(price: any): number | null {
    // Handle both suggestedPrice and suggested_price properties
    if (price.suggestedPrice) {
      return typeof price.suggestedPrice === 'string' ? parseFloat(price.suggestedPrice) : price.suggestedPrice;
    }
    if (price.suggested_price) {
      return typeof price.suggested_price === 'string' ? parseFloat(price.suggested_price) : price.suggested_price;
    }
    return null;
  }

  getCurrentPrice(price: any): number {
    return typeof price.price === 'string' ? parseFloat(price.price) : price.price;
  }
}
