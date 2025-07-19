# 🚨 HTTPS Mixed Content Issue Fix

## Problem Identified
Your frontend is deployed on **HTTPS** (`https://edarah-ai.iti.cam`) but trying to make requests to **HTTP** API (`http://13.38.195.203:3000`). This creates a **Mixed Content Security Error** where browsers block HTTP requests from HTTPS sites.

## 🔧 Solutions (Choose One)

### Solution 1: Configure HTTPS on Backend (Recommended)
Configure SSL/HTTPS on your backend server at `13.38.195.203:3000`.

**Steps:**
1. Get SSL certificate (Let's Encrypt, CloudFlare, etc.)
2. Configure your backend server to use HTTPS
3. Update API URL to `https://13.38.195.203:3000`
4. Rebuild and redeploy frontend

### Solution 2: Use Reverse Proxy with SSL
Set up nginx or similar reverse proxy with SSL certificate.

**Example nginx config:**
```nginx
server {
    listen 443 ssl;
    server_name your-api-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://13.38.195.203:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Solution 3: Deploy Frontend on HTTP
Deploy your frontend on HTTP instead of HTTPS (less secure).

### Solution 4: Use Domain with SSL (Best Practice)
1. Get a domain name for your API (e.g., `api.edarah-ai.com`)
2. Point it to `13.38.195.203`
3. Configure SSL certificate for the domain
4. Update API URL to `https://api.edarah-ai.com`

## 🛠️ Files Updated

### 1. Created Production Environment
- **File:** `src/environments/environment.prod.ts`
- **Content:** Uses HTTPS API URL for production builds

### 2. Updated Build Configuration  
- **File:** `angular.json`
- **Change:** Added file replacement for production builds

## 🚀 How to Deploy with Fix

### If Backend Supports HTTPS:
```bash
# Build for production (uses HTTPS API URL)
ng build --configuration=production

# Deploy the dist/edarah folder to your hosting
```

### If Backend Doesn't Support HTTPS Yet:
```bash
# Temporarily use HTTP in production environment
# Edit src/environments/environment.prod.ts:
# apiUrl: 'http://13.38.195.203:3000'

# Then build and deploy
ng build --configuration=production
```

## 🔍 Testing the Fix

### 1. Check Browser Console
After deployment, open browser console and look for:
- ❌ Mixed Content errors (should be gone)
- ✅ Successful API requests
- 🔒 HTTPS requests in Network tab

### 2. Test API Manually
```javascript
// In browser console on your deployed site
fetch('https://13.38.195.203:3000/api/dashboard/ai-table', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('API test success:', data))
.catch(err => console.error('API test failed:', err));
```

## 📋 Next Steps

1. **Immediate:** Try building with HTTPS API URL and test
2. **If HTTPS fails:** Configure SSL on backend or use reverse proxy
3. **Long-term:** Get proper domain with SSL certificate
4. **Security:** Ensure all communication is HTTPS in production

## 🆘 If Still Not Working

Check these common issues:
- Backend server not accepting HTTPS connections
- SSL certificate issues
- CORS configuration on backend
- Firewall blocking HTTPS port (443)
- DNS configuration if using domain names
