# Products Page Troubleshooting Guide

## Problem: Products Not Loading from AI Table API

### Quick Diagnosis Steps

1. **Open Browser Console** (F12 → Console tab)
2. **Navigate to Products page** (`/dashboard/products`)
3. **Look for these log messages:**
   ```
   🚀 Products Component initialized
   🌐 Environment API URL: http://13.38.195.203:3000
   🔑 Auth token exists: true/false
   🔄 Starting to load products from AI Table API...
   ```

### Common Issues & Solutions

#### Issue 1: No Authentication Token
**Symptoms:**
- Console shows: `❌ No authentication token found`
- Products page shows mock data

**Solution:**
1. Login again to get fresh token
2. Check if token exists: `localStorage.getItem('token')`

#### Issue 2: API Endpoint Not Found (404)
**Symptoms:**
- Console shows: `❌ Error status: 404`
- Network tab shows 404 for `/api/dashboard/ai-table`

**Solution:**
1. Verify API server is running
2. Check if endpoint exists on server
3. Try different endpoint format

#### Issue 3: Authentication Failed (401)
**Symptoms:**
- Console shows: `❌ Error status: 401`
- Message: "Authentication failed - please login again"

**Solution:**
1. Clear browser storage: `localStorage.clear()`
2. Login again
3. Check token format

#### Issue 4: Server Error (500)
**Symptoms:**
- Console shows: `❌ Error status: 500`
- API returns server error

**Solution:**
1. Check server logs
2. Verify database connectivity
3. Contact backend team

### Testing Tools Added

#### 1. Test API Button
- Click "🧪 Test API" button in products page
- Tests basic API connectivity
- Shows detailed response/error info

#### 2. Debug Information
- Shows total products loaded
- Shows filtered products count
- Displays API endpoint being used

#### 3. Enhanced Console Logging
- Detailed request/response logging
- Step-by-step debugging info
- Error categorization

### Expected API Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "P001",
      "name": "Product Name",
      "category": "Category",
      "price": "100 L.E.",
      "sales": "High",
      "expiryDate": "in 5 days",
      "avgProfit": "+10.5%",
      "warning": "Low"
    }
  ],
  "totalCount": 50,
  "page": 1,
  "limit": 10
}
```

### API Endpoint Details

- **URL:** `http://13.38.195.203:3000/api/dashboard/ai-table`
- **Method:** GET
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `search` (optional): Search term
  - `warningType` (optional): Filter by warning type
  - `category` (optional): Filter by category

### Manual Testing Steps

1. **Test Authentication:**
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   ```

2. **Test API Call Manually:**
   ```javascript
   fetch('http://13.38.195.203:3000/api/dashboard/ai-table', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`,
       'Content-Type': 'application/json'
     }
   })
   .then(r => r.json())
   .then(data => console.log('Manual API test:', data))
   .catch(err => console.error('Manual API error:', err));
   ```

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Refresh products page
   - Look for `/api/dashboard/ai-table` request
   - Check status code and response

### Fallback Behavior

If API fails, the component will:
1. Log detailed error information
2. Fall back to mock data (15 sample products)
3. Show products table with mock data
4. Display debug information

### Recent Improvements

✅ **Enhanced Error Handling**
- Detailed error logging with emojis
- Specific error messages for different HTTP status codes
- Graceful fallback to mock data

✅ **Debug Tools**
- Test API connectivity button
- Debug information display
- Enhanced console logging

✅ **Better User Experience**
- Loading indicators
- Empty state with action buttons
- Clear error messages

### Contact Support

If issues persist:
1. Copy console logs
2. Note exact error messages
3. Check Network tab for failed requests
4. Verify authentication status
