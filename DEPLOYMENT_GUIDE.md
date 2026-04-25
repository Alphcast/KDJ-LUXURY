# 🎉 KDJ Luxury Vercel Deployment Guide

Your web app is now ready to deploy! Follow these steps to get your app live on Vercel.

## 📋 Prerequisites

- ✅ Node.js installed
- ✅ npm dependencies installed (already done!)
- A Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

## 🚀 Deployment Steps

### Step 1: Push to Git

First, push your code to a Git repository:

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### Step 2: Deploy Frontend to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
vercel
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Select your Git repository
4. Click "Import"
5. In "Build and Output Settings" section:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://kdj-api.vercel.app` (your backend API URL from Step 3)
7. Click "Deploy"

### Step 3: Deploy Backend API to Vercel

Create a separate Vercel project for your backend:

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Select your Git repository
4. Set "Root Directory" to: `server`
5. In framework selector, choose "Other"
6. In "Build and Output Settings":
   - Build Command: (leave empty or `npm install`)
   - Output Directory: (leave empty)
7. Click "Deploy"

**After Backend Deploys:**
- Note your backend URL (e.g., `https://kdj-api.vercel.app`)
- Go back to your frontend project settings
- Update the `VITE_API_URL` environment variable with this URL
- Redeploy frontend

## 🔒 Environment Variables

Your frontend needs these environment variables set in Vercel:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

Your backend uses these (optional):
```
PORT=3001
```

## 📝 Important Notes

### Database/Storage
- Your current setup uses `data.json` and local file uploads
- On Vercel's serverless platform, local files are not persistent
- **Recommended Solution**: Add a database (MongoDB, PostgreSQL, etc.)

### File Uploads
- The current file upload feature stores files locally
- **For production**, consider using:
  - AWS S3
  - Cloudinary
  - Firebase Storage
  - Vercel Blob Storage

### CORS
Your API already has CORS enabled, which is good for cross-origin requests.

## ✅ Verification Checklist

After deployment:

- [ ] Frontend loads without errors
- [ ] Products display correctly
- [ ] Can filter and search products
- [ ] WhatsApp widget opens and works
- [ ] Admin login panel is accessible
- [ ] API calls complete successfully
- [ ] Images load properly

## 🆘 Troubleshooting

**Frontend deployment fails:**
- Check that `dist` folder exists locally: `npm run build`
- Verify `vercel.json` configuration
- Check build logs in Vercel dashboard

**API calls fail after deployment:**
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend URL is accessible
- Look at network tab in browser DevTools

**CORS errors:**
- Verify backend has proper CORS headers
- Check that frontend URL is allowed in CORS config

## 🔑 Admin Credentials

**Default Login (Keep Secure!):**
- Username: `KDJLUXURY`
- Password: `KDJ123@`

⚠️ **CHANGE THESE** in production by updating `src/App.tsx`

## 📱 WhatsApp Integration

The WhatsApp number is stored in settings (admin panel). Update it there for your business number.

## 🎯 Next Steps

1. Deploy both frontend and backend
2. Test all features thoroughly
3. Update admin credentials
4. Set up proper database
5. Consider implementing file storage solution
6. Set up analytics/monitoring

---

For more help, visit: https://vercel.com/docs
