import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AIAssistantService, MarketingPlanRequest, MarketingPlanResponse } from '../../services/ai-assistant.service';
import { DatabaseService, Database } from '../../services/database.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-marketing-plan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './marketing-plan.component.html',
  styleUrls: ['./marketing-plan.component.css']
})
export class MarketingPlanComponent implements OnInit {
  marketingForm: FormGroup;
  databases: Database[] = [];
  marketingPlan: MarketingPlanResponse | null = null;
  isLoading = false;
  isGenerating = false;
  isGeneratingPDF = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private aiAssistantService: AIAssistantService,
    private databaseService: DatabaseService
  ) {
    this.marketingForm = this.fb.group({
      databaseId: ['', Validators.required],
      generateImage: [false]
    });
  }

  ngOnInit() {
    this.loadDatabases();
  }

  loadDatabases() {
    this.isLoading = true;
    this.databaseService.getDatabases().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.databases = response;
        } else if (response && 'data' in response) {
          this.databases = response.data || [];
        } else if (response && 'databases' in response) {
          this.databases = (response as any).databases || [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading databases:', error);
        this.errorMessage = 'Failed to load databases. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.marketingForm.valid) {
      this.isGenerating = true;
      this.marketingPlan = null;
      this.errorMessage = '';
      
      const formData: MarketingPlanRequest = {
        databaseId: this.marketingForm.value.databaseId,
        generateImage: this.marketingForm.value.generateImage
      };

      this.aiAssistantService.getMarketingPlan(formData).subscribe({
        next: (response) => {
          this.marketingPlan = response;
          this.isGenerating = false;
        },
        error: (error) => {
          console.error('Error generating marketing plan:', error);
          this.errorMessage = error.error?.message || 'Error generating marketing plan. Please try again.';
          this.isGenerating = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.marketingForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${fieldName} is required`;
      }
    }
    return '';
  }

  markFormGroupTouched() {
    Object.keys(this.marketingForm.controls).forEach(key => {
      const control = this.marketingForm.get(key);
      control?.markAsTouched();
    });
  }

  formatPlanContent(content: string): string {
    if (!content) return '';

    // Clean up the content first
    let cleanContent = this.cleanSpecialChars(content);

    // Split content into lines for better processing
    const lines = cleanContent.split('\n');
    let formatted = '';
    let inTable = false;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Handle code blocks
      if (line.startsWith('```')) {
        if (inTable) {
          formatted += '</tbody></table></div>';
          inTable = false;
        }
        inCodeBlock = !inCodeBlock;
        formatted += inCodeBlock ? '<pre><code>' : '</code></pre>';
        continue;
      }

      if (inCodeBlock) {
        formatted += line + '\n';
        continue;
      }

      // Check if this is a table row (improved detection)
      if (this.isTableRow(line)) {
        if (!inTable) {
          formatted += '<div class="table-container"><table class="marketing-table">';
          inTable = true;
        }

        // Process table row
        const cells = this.extractTableCells(line);

        // Check if this is a header row
        const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
        const isHeader = this.isTableSeparator(nextLine);

        if (isHeader) {
          // This is a header row
          formatted += '<thead><tr>';
          cells.forEach(cell => {
            formatted += `<th>${this.formatCellContent(cell)}</th>`;
          });
          formatted += '</tr></thead><tbody>';
          i++; // Skip the separator line
        } else if (!this.isTableSeparator(line)) {
          // This is a regular row
          formatted += '<tr>';
          cells.forEach(cell => {
            formatted += `<td>${this.formatCellContent(cell)}</td>`;
          });
          formatted += '</tr>';
        }
      } else {
        // Close table if we were in one
        if (inTable) {
          formatted += '</tbody></table></div>';
          inTable = false;
        }

        // Process regular content
        if (line && !this.isTableSeparator(line)) {
          formatted += this.formatRegularLine(line) + '<br>';
        } else if (!line) {
          formatted += '<br>';
        }
      }
    }

    // Close table if still open
    if (inTable) {
      formatted += '</tbody></table></div>';
    }

    // Close code block if still open
    if (inCodeBlock) {
      formatted += '</code></pre>';
    }

    return formatted;
  }

  private cleanSpecialChars(content: string): string {
    return content
      // Remove ASCII art table borders and decorations
      .replace(/\+[-=\+]+\+/g, '')
      .replace(/\+[-=\+\s]*\+[-=\+\s]*\+/g, '')
      .replace(/^\s*\+[-=\+\s]*\+\s*$/gm, '')
      // Remove complex table separators
      .replace(/^\s*\|[-\s\|:=\+]*\|\s*$/gm, '')
      .replace(/^\s*\|[\s\|]*\|\s*$/gm, '')
      // Remove standalone decorative lines
      .replace(/^\s*[-\+\|:=]{3,}\s*$/gm, '')
      .replace(/^\s*[v\^<>]{1,}\s*$/gm, '') // Remove arrow-like chars
      // Clean up box drawing characters
      .replace(/[┌┐└┘├┤┬┴┼─│]/g, '')
      // Remove repeated special characters
      .replace(/[-\+\|]{4,}/g, '')
      // Clean up extra whitespace and empty lines
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s*\n/gm, '\n')
      .trim();
  }

  private isTableRow(line: string): boolean {
    // Check if line contains pipes and has actual content
    if (!line.includes('|')) return false;

    // Skip lines that are just separators
    if (this.isTableSeparator(line)) return false;

    // Must have at least 2 pipes and some content
    const pipes = (line.match(/\|/g) || []).length;
    const hasContent = line.replace(/[\|\-\+\s:=]/g, '').length > 0;

    return pipes >= 2 && hasContent;
  }

  private isTableSeparator(line: string): boolean {
    // Check if line is just a separator (dashes, pipes, colons, etc.)
    const cleanLine = line.replace(/\s/g, '');
    return /^[\|\-\+:=]+$/.test(cleanLine) && cleanLine.length > 2;
  }

  private extractTableCells(line: string): string[] {
    return line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0)
      .filter(cell => !/^[-\+:=\s]*$/.test(cell)); // Remove separator cells
  }

  private formatCellContent(cell: string): string {
    if (!cell) return '';

    let formatted = cell
      // Clean up table artifacts first
      .replace(/[\+\-\|]{2,}/g, '') // Remove table border artifacts
      .replace(/^[\+\-\|:\s]+/, '') // Remove leading table chars
      .replace(/[\+\-\|:\s]+$/, '') // Remove trailing table chars
      // Clean up box drawing and special chars
      .replace(/[┌┐└┘├┤┬┴┼─│]/g, '')
      .replace(/[v\^<>]/g, '') // Remove arrow chars
      .trim();

    if (!formatted) return '';

    // Handle multi-line content in cells (split by common separators)
    const lines = formatted.split(/[,;]/).map(line => line.trim()).filter(line => line);

    if (lines.length > 1) {
      // Multiple items - create a list
      const listItems = lines.map(line => {
        const cleanLine = this.cleanSingleLine(line);
        return cleanLine ? `<li>${cleanLine}</li>` : '';
      }).filter(item => item);

      return listItems.length > 0 ? `<ul class="cell-list">${listItems.join('')}</ul>` : '';
    } else {
      // Single item
      return this.cleanSingleLine(formatted);
    }
  }

  private cleanSingleLine(line: string): string {
    return line
      // Format markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Clean up list markers
      .replace(/^\s*[-\*•]\s*/, '') // Remove leading dashes/asterisks/bullets
      .replace(/^\s*\d+\.\s*/, '') // Remove numbered list markers
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  private formatRegularLine(line: string): string {
    // Skip empty lines and separator lines
    if (!line || this.isTableSeparator(line)) {
      return '';
    }

    // Clean the line first
    let cleanLine = line
      .replace(/^\s*[\+\-\|]{3,}.*$/, '') // Remove table separator lines
      .replace(/^\s*[\+\-\|:\s]+$/, '') // Remove pure separator lines
      .trim();

    if (!cleanLine) return '';

    // Handle headers
    if (cleanLine.startsWith('# ')) {
      return `<h2>${this.formatCellContent(cleanLine.substring(2))}</h2>`;
    } else if (cleanLine.startsWith('## ')) {
      return `<h3>${this.formatCellContent(cleanLine.substring(3))}</h3>`;
    } else if (cleanLine.startsWith('### ')) {
      return `<h4>${this.formatCellContent(cleanLine.substring(4))}</h4>`;
    } else if (cleanLine.startsWith('#### ')) {
      return `<h5>${this.formatCellContent(cleanLine.substring(5))}</h5>`;
    }

    // Handle lists
    if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
      return `<li>${this.formatCellContent(cleanLine.substring(2))}</li>`;
    }

    // Handle numbered lists
    if (/^\d+\.\s/.test(cleanLine)) {
      const content = cleanLine.replace(/^\d+\.\s/, '');
      return `<li>${this.formatCellContent(content)}</li>`;
    }

    // Handle regular text
    return this.formatCellContent(cleanLine);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  copyToClipboard() {
    if (this.marketingPlan?.plan) {
      navigator.clipboard.writeText(this.marketingPlan.plan).then(() => {
        // Show success message
        console.log('Marketing plan copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
    }
  }

  downloadPlan() {
    if (this.marketingPlan?.plan) {
      this.isGeneratingPDF = true;
      setTimeout(() => {
        this.generatePDF();
        this.isGeneratingPDF = false;
      }, 100);
    }
  }

  downloadAsText() {
    if (this.marketingPlan?.plan) {
      const blob = new Blob([this.marketingPlan.plan], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'marketing-plan.txt';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  private generatePDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Add header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Marketing Plan Report', margin, 30);

    // Add date and database info
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Generated on: ${currentDate}`, margin, 40);

    // Add database info if available
    const selectedDb = this.databases.find(db => db.id === this.marketingForm.value.databaseId);
    if (selectedDb) {
      pdf.text(`Database: ${selectedDb.name || selectedDb.databaseName}`, margin, 50);
    }

    // Add separator line
    pdf.setLineWidth(0.5);
    pdf.line(margin, 55, pageWidth - margin, 55);

    let yPosition = 65;

    // Add image if available
    if (this.marketingPlan?.imageUrl) {
      try {
        // Note: In a real implementation, you'd need to handle CORS and image loading
        // For now, we'll add a placeholder for the image
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text('Marketing Visual: Available in online version', margin, yPosition);
        yPosition += 15;
      } catch (error) {
        console.log('Could not add image to PDF:', error);
      }
    }

    if (this.marketingPlan?.plan) {
      // Process the marketing plan content
      const content = this.marketingPlan.plan;
      const lines = this.processContentForPDF(content);

      for (const line of lines) {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 30;
        }

        // Set font based on line type
        if (line.type === 'header') {
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          yPosition += 10;
        } else if (line.type === 'subheader') {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          yPosition += 8;
        } else if (line.type === 'table_start') {
          // Add some space before table
          yPosition += 5;
          continue;
        } else if (line.type === 'table_end') {
          // Add some space after table
          yPosition += 5;
          continue;
        } else if (line.type === 'table_header') {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          // Draw header with background
          pdf.setFillColor(26, 109, 192);
          pdf.rect(margin, yPosition - 4, maxWidth, 8, 'F');
          pdf.setTextColor(255, 255, 255);
        } else if (line.type === 'table_row') {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          // Draw alternating row background
          pdf.setFillColor(248, 249, 250);
          pdf.rect(margin, yPosition - 4, maxWidth, 6, 'F');
        } else {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
        }

        // Split long lines
        const splitText = pdf.splitTextToSize(line.text, maxWidth);
        pdf.text(splitText, margin, yPosition);
        yPosition += splitText.length * (line.type.startsWith('table') ? 4 : 5) + 3;
      }
    }

    // Add footer with page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
      pdf.text('Generated by Edarah AI Assistant', margin, pageHeight - 10);
    }

    // Save the PDF
    pdf.save('marketing-plan.pdf');
  }

  private processContentForPDF(content: string): Array<{text: string, type: string}> {
    const lines: Array<{text: string, type: string}> = [];

    // Clean the content first
    const cleanContent = this.cleanSpecialChars(content);
    const contentLines = cleanContent.split('\n');

    let inTable = false;
    let tableData: string[][] = [];

    for (let i = 0; i < contentLines.length; i++) {
      const trimmedLine = contentLines[i].trim();

      if (!trimmedLine) {
        if (inTable) {
          // End of table
          this.addTableToPDF(lines, tableData);
          inTable = false;
          tableData = [];
        }
        continue;
      }

      // Check if this is a table row using improved detection
      if (this.isTableRow(trimmedLine)) {
        const cells = this.extractTableCells(trimmedLine);

        if (cells.length > 0) {
          if (!inTable) {
            inTable = true;
            tableData = [];
          }

          // Clean cells for PDF
          const cleanCells = cells.map(cell => this.cleanCellForPDF(cell));
          tableData.push(cleanCells);
        }
      } else {
        // End table if we were in one
        if (inTable) {
          this.addTableToPDF(lines, tableData);
          inTable = false;
          tableData = [];
        }

        // Process regular content
        const processedLine = this.processLineForPDF(trimmedLine);
        if (processedLine) {
          lines.push(processedLine);
        }
      }
    }

    // Handle table at end of content
    if (inTable && tableData.length > 0) {
      this.addTableToPDF(lines, tableData);
    }

    return lines;
  }

  private cleanCellForPDF(cell: string): string {
    return cell
      .replace(/[\+\-\|]{2,}/g, '') // Remove table artifacts
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers
      .replace(/`(.*?)`/g, '$1')       // Remove code markers
      .replace(/^\s*[-\*]\s*/, '')     // Remove list markers
      .trim();
  }

  private processLineForPDF(line: string): {text: string, type: string} | null {
    if (!line || this.isTableSeparator(line)) {
      return null;
    }

    if (line.startsWith('# ')) {
      return {
        text: this.cleanCellForPDF(line.substring(2)),
        type: 'header'
      };
    } else if (line.startsWith('## ')) {
      return {
        text: this.cleanCellForPDF(line.substring(3)),
        type: 'subheader'
      };
    } else if (line.startsWith('### ')) {
      return {
        text: this.cleanCellForPDF(line.substring(4)),
        type: 'subheader'
      };
    } else {
      const cleanText = this.cleanCellForPDF(line)
        .replace(/^\- /, '• ')           // Convert dashes to bullets
        .replace(/^\* /, '• ');          // Convert asterisks to bullets

      if (cleanText) {
        return {
          text: cleanText,
          type: 'normal'
        };
      }
    }

    return null;
  }

  private addTableToPDF(lines: Array<{text: string, type: string}>, tableData: string[][]) {
    if (tableData.length === 0) return;

    // Add table header
    lines.push({
      text: '--- TABLE ---',
      type: 'table_start'
    });

    // Add table rows
    tableData.forEach((row, index) => {
      const rowText = row.join(' | ');
      lines.push({
        text: rowText,
        type: index === 0 ? 'table_header' : 'table_row'
      });
    });

    lines.push({
      text: '--- END TABLE ---',
      type: 'table_end'
    });
  }

  clearError() {
    this.errorMessage = '';
  }
}
