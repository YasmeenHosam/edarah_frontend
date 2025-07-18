# Testing Recommendation Expansion Feature

## Manual Testing Steps

### Prerequisites
1. Ensure you have a valid authentication token
2. Have access to a database with data
3. AI Assistant page is accessible

### Test Scenario 1: Basic Expansion
1. Navigate to AI Assistant page
2. Select a database from dropdown
3. Ask a question that generates recommendations
4. Wait for results to load
5. Click "Expand Recommendation" button on any recommendation
6. Verify:
   - Button shows "Loading..." during API call
   - Button is disabled during loading
   - Expanded content appears with all sections
   - Button text changes to "Collapse"

### Test Scenario 2: Collapse Functionality
1. Follow steps 1-5 from Test Scenario 1
2. Click "Collapse" button
3. Verify:
   - Expanded content disappears
   - Button text changes back to "Expand Recommendation"

### Test Scenario 3: Multiple Recommendations
1. Generate results with multiple recommendations
2. Expand different recommendations
3. Verify:
   - Each recommendation can be expanded independently
   - Multiple recommendations can be expanded simultaneously
   - Each maintains its own state

### Test Scenario 4: Error Handling
1. Disconnect from internet or block API endpoint
2. Try to expand a recommendation
3. Verify:
   - Error message is displayed
   - Loading state is properly reset
   - Button becomes clickable again

### Test Scenario 5: Mobile Responsiveness
1. Open AI Assistant on mobile device or resize browser
2. Generate recommendations and try expanding
3. Verify:
   - Button is full-width on mobile
   - Expanded content is properly formatted
   - All text is readable

## API Testing with Postman/Insomnia

### Request Setup
```
POST http://13.38.195.203:3000/api/rag/recommendation/explain
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "recommendation": "Conduct targeted customer feedback and market research to understand reasons behind the decline in Nike Running Shoes sales."
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Recommendation expanded successfully",
  "data": {
    "insights": "Detailed explanation...",
    "availableActions": ["Action 1", "Action 2"],
    "reasoning": "Reasoning explanation...",
    "confidence": 9
  }
}
```

## Browser Console Testing

### Check Network Requests
1. Open browser developer tools
2. Go to Network tab
3. Expand a recommendation
4. Verify:
   - POST request to `/api/rag/recommendation/explain`
   - Correct request payload
   - Successful response (200 status)

### Check for JavaScript Errors
1. Open browser console
2. Expand recommendations
3. Verify no JavaScript errors appear

## Performance Testing

### Load Time
- Measure time from button click to content display
- Should be under 3 seconds for good user experience

### Memory Usage
- Check for memory leaks when expanding/collapsing multiple recommendations
- Monitor browser memory usage

## Accessibility Testing

### Keyboard Navigation
1. Use Tab key to navigate to expand buttons
2. Press Enter or Space to activate
3. Verify screen reader compatibility

### Screen Reader Testing
1. Use screen reader software
2. Verify button labels are announced correctly
3. Verify expanded content is accessible

## Common Issues and Solutions

### Issue: Button doesn't respond
**Solution**: Check if API endpoint is accessible and authentication token is valid

### Issue: Expanded content doesn't appear
**Solution**: Verify API response format matches expected interface

### Issue: Loading state doesn't clear
**Solution**: Check error handling in component and ensure loading state is reset

### Issue: Multiple clicks cause multiple requests
**Solution**: Verify button is properly disabled during loading

## Test Data Examples

### Sample Recommendations for Testing
1. "Increase marketing budget for underperforming products"
2. "Implement dynamic pricing strategy based on competitor analysis"
3. "Focus on customer retention programs for high-value segments"
4. "Optimize inventory levels to reduce carrying costs"
5. "Expand product line in high-growth categories"
