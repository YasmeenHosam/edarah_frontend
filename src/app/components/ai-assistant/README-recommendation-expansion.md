# AI Assistant - Recommendation Expansion Feature

## Overview
This feature allows users to expand individual recommendations in the AI Assistant page to get detailed explanations, insights, and actionable steps.

## Implementation Details

### API Endpoint
- **URL**: `/api/rag/recommendation/explain`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`

### Request Format
```json
{
  "recommendation": "Conduct targeted customer feedback and market research to understand reasons behind the decline in Nike Running Shoes sales."
}
```

### Response Format
```json
{
  "success": true,
  "message": "Recommendation expanded successfully",
  "data": {
    "insights": "Conducting targeted customer feedback and market research to understand reasons behind the decline in Nike Running Shoes sales involves systematically gathering insights directly from current and potential customers, as well as analyzing broader market trends...",
    "availableActions": [
      "Survey current customers about their experience with Nike Running Shoes",
      "Conduct focus groups with target demographics",
      "Analyze competitor pricing and features",
      "Review online reviews and social media sentiment"
    ],
    "reasoning": "This approach enables the business to uncover nuanced reasons why their product may no longer be meeting customer needs or expectations...",
    "confidence": 9
  }
}
```

## Features

### 1. Expand/Collapse Functionality
- Each recommendation has an "Expand Recommendation" button
- Clicking expands the recommendation with detailed information
- Clicking again collapses the expanded content
- Button text changes to "Collapse" when expanded

### 2. Loading States
- Shows "Loading..." text with spinner animation while fetching data
- Button is disabled during loading to prevent multiple requests

### 3. Expanded Content Sections
- **Insights**: Detailed explanation of the recommendation
- **Reasoning**: Why this recommendation is suggested
- **Available Actions**: List of actionable steps
- **Confidence**: Confidence score out of 10

### 4. Responsive Design
- Mobile-friendly layout
- Button becomes full-width on mobile devices
- Optimized spacing and typography for different screen sizes

## Code Structure

### Service Layer (`ai-assistant.service.ts`)
```typescript
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

explainRecommendation(request: RecommendationExplainRequest): Observable<RecommendationExplainResponse>
```

### Component Layer (`ai-assistant.component.ts`)
```typescript
// State management
expandedRecommendations: { [key: number]: RecommendationExplainResponse | null } = {};
loadingRecommendations: { [key: number]: boolean } = {};

// Methods
expandRecommendation(recommendation: string, index: number): void
isRecommendationExpanded(index: number): boolean
isRecommendationLoading(index: number): boolean
```

### Template (`ai-assistant.component.html`)
- Uses `*ngFor` with index to track individual recommendations
- Conditional rendering for expanded content
- Loading states and button text management

## Styling

### Key CSS Classes
- `.recommendation-item`: Main recommendation container
- `.recommendation-content`: Recommendation text
- `.recommendation-actions`: Button container
- `.expand-btn`: Expand/collapse button
- `.expanded-recommendation`: Expanded content container
- `.expanded-section`: Individual sections within expanded content
- `.confidence-section`: Confidence score display

### Animations
- Fade-in animation for expanded content
- Button hover effects
- Loading spinner animation

## Usage Example

1. User sees recommendations in AI Assistant results
2. User clicks "Expand Recommendation" button
3. System calls `/api/rag/recommendation/explain` endpoint
4. Expanded content appears with detailed information
5. User can click "Collapse" to hide the expanded content

## Error Handling
- Network errors are caught and displayed as error messages
- Loading states are properly reset on error
- User-friendly error messages are shown

## Future Enhancements
- Add ability to save expanded recommendations
- Implement recommendation rating system
- Add sharing functionality for recommendations
- Cache expanded recommendations to avoid repeated API calls
