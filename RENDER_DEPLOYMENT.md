# Render Deployment Guide for EduCanvas Live

## Issue: "Failed to Fetch" Error on Registration

This guide helps fix the registration endpoint not working on Render.

## Required Environment Variables on Render

### Backend Service

Set these environment variables in your Render backend service dashboard:

```bash
# Required for production
NODE_ENV=production

# Database connection (your Prisma Accelerate URL)
DATABASE_URL=postgres://ce6e3738316dbc658ee4f3909d3bcf04536c24989f429c235102ab483f714c4e:sk_vGr43AXvfxHCjGEWLS8wy@db.prisma.io:5432/postgres?sslmode=require

# Direct database URL for migrations (if different from DATABASE_URL)
DIRECT_DATABASE_URL=postgres://ce6e3738316dbc658ee4f3909d3bcf04536c24989f429c235102ab483f714c4e:sk_aUgqcIiqAUHlazqFVsiZV@db.prisma.io:5432/postgres?sslmode=require

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string

# Admin code for classroom
ADMIN_CODE=teach123

# CORS Configuration - VERY IMPORTANT
FRONTEND_URL=https://your-frontend-name.onrender.com
RENDER_EXTERNAL_URL=https://your-backend-name.onrender.com

# Port (Render sets this automatically, but you can specify)
PORT=5000
```

### Frontend Service

Update your frontend environment variables:

```bash
# Backend API URL
REACT_APP_API_URL=https://your-backend-name.onrender.com
REACT_APP_SOCKET_URL=https://your-backend-name.onrender.com
```

## Common Issues and Fixes

### 1. CORS Error (Failed to Fetch)

**Problem**: Frontend can't connect to backend due to CORS restrictions.

**Fix**: 
- Make sure `FRONTEND_URL` is set correctly on Render backend
- Must include `https://` and match your frontend domain exactly
- Example: `FRONTEND_URL=https://educanvas-frontend.onrender.com`

### 2. Database Not Connected

**Problem**: Prisma can't connect to database.

**Fix**:
- Ensure `DATABASE_URL` is set in Render environment variables
- Run migrations after deployment
- Check Render logs for Prisma connection errors

### 3. Build Command Issues

**Backend Build Command**:
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

**Backend Start Command**:
```bash
npm start
```

**Frontend Build Command**:
```bash
npm install && npm run build
```

**Frontend Start Command**:
```bash
npx serve -s build -l $PORT
```

### 4. Check Render Logs

After deploying, check the logs:

1. Go to your Render dashboard
2. Select your backend service
3. Click "Logs" tab
4. Look for:
   - "Prisma client initialized" ✅
   - "Server running on port 5000" ✅
   - CORS errors ❌
   - Database connection errors ❌

### 5. Test Endpoints

Once deployed, test these URLs (replace with your domain):

```bash
# Health check
curl https://your-backend-name.onrender.com/health

# Registration (from your browser console or Postman)
fetch('https://your-backend-name.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
    role: 'student'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Step-by-Step Deployment Checklist

### Backend Setup

- [ ] Create new Web Service on Render
- [ ] Connect your GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set build command: `npm install && npx prisma generate && npx prisma migrate deploy`
- [ ] Set start command: `npm start`
- [ ] Add all environment variables listed above
- [ ] **IMPORTANT**: Replace `FRONTEND_URL` with your actual frontend URL
- [ ] **IMPORTANT**: Replace `RENDER_EXTERNAL_URL` with your backend URL
- [ ] Deploy and check logs

### Frontend Setup

- [ ] Create new Static Site on Render
- [ ] Connect your GitHub repository  
- [ ] Set root directory to `frontend`
- [ ] Set build command: `npm install && npm run build`
- [ ] Set publish directory: `build`
- [ ] Add environment variable `REACT_APP_API_URL` with your backend URL
- [ ] Add environment variable `REACT_APP_SOCKET_URL` with your backend URL
- [ ] Deploy and check logs

### After Deployment

- [ ] Visit backend health endpoint: `https://your-backend.onrender.com/health`
- [ ] Should return: `{"status":"OK","users":0,"admin":"none"}`
- [ ] Open frontend URL in browser
- [ ] Open browser console (F12)
- [ ] Try to register a user
- [ ] Check console for any CORS errors
- [ ] Check Render backend logs for incoming requests

## Database Migrations on Render

If you need to run migrations manually:

1. Go to Render dashboard → your backend service
2. Click "Shell" tab
3. Run:
```bash
npx prisma migrate deploy
```

## Quick Fix for Current "Failed to Fetch" Error

The most likely cause is **missing CORS configuration**. 

1. Go to Render backend service
2. Add these environment variables:
   - `FRONTEND_URL` = your frontend Render URL (with https://)
   - `RENDER_EXTERNAL_URL` = your backend Render URL (with https://)
3. Redeploy the backend service
4. Test registration again

## Debugging Tips

### Check if backend is receiving requests:

Look in Render logs for:
```
POST /api/auth/register
```

If you don't see this, the frontend isn't reaching the backend (CORS issue).

### Check Prisma connection:

Look in Render logs for:
```
Prisma client initialized
```

If you see "falling back to file storage", Prisma isn't connecting.

### Check CORS configuration:

Look in Render logs when frontend makes a request. If you see:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

This confirms CORS needs to be fixed with the `FRONTEND_URL` variable.
