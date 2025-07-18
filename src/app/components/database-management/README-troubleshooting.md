# Database Management Troubleshooting Guide

## Problem: Databases Not Showing Up

If your connected databases are not appearing in the Database Management page, follow these troubleshooting steps:

### 1. Check Browser Console

Open browser developer tools (F12) and check the Console tab for error messages:

```javascript
// Look for these types of messages:
- "API Response for getDatabases:"
- "Final databases array:"
- "Error loading databases:"
- "Auth token exists:"
```

### 2. Verify Authentication

The API requires a valid authentication token:

```javascript
// Check if token exists in localStorage
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token value:', token);
```

**Common Issues:**
- Token expired or invalid
- User not logged in
- Token format incorrect

**Solution:** Re-login to get a fresh token

### 3. Check API Endpoint

The component calls: `GET /api/rag/databases`

**Full URL:** `http://13.38.195.203:3000/api/rag/databases`

**Expected Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": "db-id-1",
      "name": "My Database",
      "type": "mysql",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 4. Network Issues

Check Network tab in browser dev tools:

- **Status 200:** Success - check response data
- **Status 401:** Authentication failed - re-login required
- **Status 403:** Access denied - check permissions
- **Status 404:** Endpoint not found - check API URL
- **Status 500:** Server error - check server logs

### 5. Debug Features Added

The updated component includes enhanced debugging:

1. **Detailed Console Logs:** Shows API response structure
2. **Refresh Button:** Manually reload databases
3. **Test Connection:** Verify database connectivity before creating
4. **Enhanced Error Messages:** More specific error information
5. **Debug Info in UI:** Shows API endpoint and troubleshooting hints

### 6. Common Solutions

#### Solution 1: Clear Browser Storage
```javascript
// Clear all stored data and re-login
localStorage.clear();
sessionStorage.clear();
// Then navigate to login page
```

#### Solution 2: Check Database Creation
Make sure databases were actually created successfully:
- Check the "Create Database" response in console
- Verify database appears in the backend system
- Test the database connection

#### Solution 3: API Server Issues
- Verify API server is running on `http://13.38.195.203:3000`
- Check server logs for errors
- Verify database service is working

### 7. Testing Steps

1. **Open Database Management page** (`/dashboard/databases`)
2. **Open browser console** (F12 → Console tab)
3. **Click "Refresh" button** to reload databases
4. **Check console output** for detailed logs
5. **Try creating a new database** to test the flow

### 8. Expected Behavior

**When Working Correctly:**
- Loading spinner appears briefly
- Console shows successful API response
- Database cards appear in the grid
- Success message shows number of databases loaded

**When Not Working:**
- Empty state appears with "No databases found"
- Console shows error messages
- Error message appears in red

### 9. Contact Information

If issues persist after following this guide:
1. Check browser console for specific error messages
2. Note the exact error codes and messages
3. Verify network connectivity to the API server
4. Check if other API endpoints are working (login, etc.)

### 10. Recent Improvements

The component has been enhanced with:
- Better error handling and user feedback
- Connection testing before database creation
- Detailed logging for troubleshooting
- Refresh functionality
- Debug information in the UI
- Improved empty state with action buttons
