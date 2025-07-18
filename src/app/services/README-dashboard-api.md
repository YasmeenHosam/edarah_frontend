# Dashboard API Integration

## Overview
This document describes the integration with the `/api/dashboard/ai-table` endpoint and related dashboard APIs.

## Dashboard Service

The `DashboardService` provides methods to interact with dashboard-related endpoints:

### Main Endpoints

#### 1. AI Table Data
- **Endpoint**: `GET /api/dashboard/ai-table`
- **Method**: `getAITableData(page?, limit?, filters?)`
- **Description**: Fetches products data from the AI table
- **Parameters**:
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of items per page
  - `filters` (optional): Filter object with search, warningType, category

#### 2. Dashboard Statistics
- **Endpoint**: `GET /api/dashboard/stats`
- **Method**: `getDashboardStats()`
- **Description**: Gets dashboard statistics and metrics

#### 3. Product Analysis
- **Endpoint**: `POST /api/dashboard/analyze-product`
- **Method**: `analyzeProduct(productId)`
- **Description**: Analyzes a specific product

#### 4. Product Recommendations
- **Endpoint**: `POST /api/dashboard/recommendations`
- **Method**: `getProductRecommendations(productId?, category?)`
- **Description**: Gets AI-powered product recommendations

#### 5. Refresh AI Table
- **Endpoint**: `POST /api/dashboard/ai-table/refresh`
- **Method**: `refreshAITable()`
- **Description**: Refreshes the AI table data

## Usage in Products Component

The Products component (`src/app/components/products/products.component.ts`) now uses the Dashboard Service:

### Key Features:
1. **Loading State**: Shows spinner while fetching data
2. **Error Handling**: Falls back to mock data if API fails
3. **Filtering**: Supports search, warning type, and category filters
4. **Pagination**: Supports server-side pagination
5. **Real-time Analysis**: Analyze products using AI
6. **Data Refresh**: Refresh AI table data

### Example Usage:

```typescript
// Load products with filters
const filters = {
  search: 'iPhone',
  warningType: 'High',
  category: 'Electronics'
};

this.dashboardService.getAITableData(1, 10, filters).subscribe({
  next: (response) => {
    if (response.success) {
      this.products = response.data;
    }
  },
  error: (error) => {
    console.error('Error loading products:', error);
  }
});
```

## Data Models

### Product Interface
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  sales: string;
  expiryDate: string;
  avgProfit: string;
  warning: string;
}
```

### API Response Interface
```typescript
interface AITableResponse {
  success: boolean;
  data: Product[];
  message?: string;
  totalCount?: number;
  page?: number;
  limit?: number;
}
```

## Authentication

All API calls include Bearer token authentication:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

## Error Handling

The service implements comprehensive error handling:
- Network errors fall back to mock data
- API errors are logged and user-friendly messages are shown
- Loading states are properly managed

## Environment Configuration

API base URL is configured in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://13.38.195.203:3000'
};
```

## Testing

To test the integration:
1. Navigate to `/dashboard/products`
2. Check browser console for API calls
3. Verify loading states and error handling
4. Test filtering and pagination
5. Try the "Analyze" button on products
6. Use the "Refresh" button to update data
