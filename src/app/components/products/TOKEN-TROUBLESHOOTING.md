# Authentication Token Troubleshooting Guide

## Problem: "Access denied - No token provided"

This error occurs when the API calls don't include a valid authentication token.

### 🔍 Quick Diagnosis

1. **Open Products Page** (`/dashboard/products`)
2. **Click "🔑 Check Token" button**
3. **Check browser console** for detailed logs

### 🚨 Common Scenarios

#### Scenario 1: No Token in localStorage
**Symptoms:**
- Error: "No token provided"
- Console shows: "❌ No authentication token found"
- Check Token shows: "❌ No token found in localStorage"

**Solution:**
```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// If no token, user needs to login
// Navigate to /auth page
```

#### Scenario 2: Invalid/Expired Token
**Symptoms:**
- Error: "Access denied"
- Token exists but API returns 401
- Console shows authentication errors

**Solution:**
```javascript
// Clear invalid token
localStorage.removeItem('token');
localStorage.removeItem('currentUser');

// Redirect to login
window.location.href = '/auth';
```

#### Scenario 3: Token Format Issues
**Symptoms:**
- Token exists but doesn't work
- Token doesn't start with "eyJ" (JWT format)

**Solution:**
- Check token format in console
- Verify token is properly stored during login
- Re-login to get fresh token

### 🔧 Manual Testing Steps

#### 1. Check Token in Console
```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length);
console.log('Token preview:', token?.substring(0, 30));
```

#### 2. Test API Call Manually
```javascript
// Test API with current token
const token = localStorage.getItem('token');
fetch('http://13.38.195.203:3000/api/dashboard/ai-table', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
```

#### 3. Check Network Tab
1. Open DevTools → Network tab
2. Refresh products page
3. Look for API calls to `/api/dashboard/ai-table`
4. Check request headers for Authorization header
5. Verify response status and error message

### 🛠️ Built-in Debug Tools

#### 1. Check Token Button
- Click "🔑 Check Token" in products page
- Shows detailed token status
- Displays user information
- Lists all localStorage keys

#### 2. Test API Button
- Click "🧪 Test API" in products page
- Tests actual API connectivity
- Shows detailed error information
- Handles authentication errors automatically

#### 3. Enhanced Console Logging
- Detailed authentication status on page load
- Step-by-step API call logging
- Token validation and format checking
- Automatic error categorization

### 🔄 Authentication Flow

#### Normal Flow:
1. User logs in at `/auth`
2. Server returns JWT token
3. Token stored in `localStorage.setItem('token', jwt)`
4. All API calls include `Authorization: Bearer ${token}`
5. Server validates token and returns data

#### When Token is Missing/Invalid:
1. API returns 401 or "Access denied"
2. Component detects authentication error
3. Offers to redirect to login page
4. Clears invalid token data
5. User can re-authenticate

### 🎯 Expected Token Format

**Valid JWT Token:**
- Starts with "eyJ"
- Contains 3 parts separated by dots
- Length typically 200+ characters
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Storage Location:**
- Key: `token`
- Location: `localStorage`
- Access: `localStorage.getItem('token')`

### 🚀 Quick Fixes

#### Fix 1: Re-login
```javascript
// Clear all auth data
localStorage.clear();
// Navigate to login
window.location.href = '/auth';
```

#### Fix 2: Check Login Implementation
Verify that login process properly stores token:
```javascript
// In login success handler
localStorage.setItem('token', response.token);
localStorage.setItem('currentUser', JSON.stringify(response.user));
```

#### Fix 3: Verify API Headers
Ensure all API services include proper headers:
```javascript
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});
```

### 📋 Troubleshooting Checklist

- [ ] Token exists in localStorage
- [ ] Token has proper JWT format (starts with eyJ)
- [ ] Token length is reasonable (200+ chars)
- [ ] Current user data exists
- [ ] API calls include Authorization header
- [ ] Network requests show proper headers
- [ ] Server responds with valid data (not 401/403)
- [ ] Login flow properly stores token

### 🆘 If All Else Fails

1. **Clear all browser data:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Hard refresh:** Ctrl+Shift+R (or Cmd+Shift+R on Mac)

3. **Try incognito/private browsing**

4. **Check if API server is running**

5. **Verify API endpoint URLs are correct**

6. **Contact backend team with specific error details**
