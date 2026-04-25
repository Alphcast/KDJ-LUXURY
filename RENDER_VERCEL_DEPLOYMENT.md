# 🚀 KDJ Luxury - Complete Render + Vercel Deployment Guide

This guide will walk you through deploying your backend on **Render** and frontend on **Vercel**, then connecting them together.

---

## 📋 Prerequisites

Before starting, you need:

- ✅ GitHub account (code already pushed to https://github.com/Alphcast/KDJ-LUXURY)
- ✅ Render account (sign up at https://render.com)
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Node.js installed locally (v24.14.1 or compatible)
- ✅ Git installed

---

## PART 1️⃣: Deploy Backend to Render

### Step 1: Prepare Your Backend

Your backend is in the `server/` directory with these files:
- `server/package.json` ✅ (now has build script)
- `server/index.js` (Express server)
- `server/db.js` (database handler)
- `server/data.json` (data storage)

**Verify locally first:**
```bash
cd server
npm install
npm start
```

The server should start at `http://localhost:3001`

---

### Step 2: Create Render Project for Backend

1. Go to https://render.com and **sign in**
2. Click **"New +"** → Select **"Web Service"**
3. **Connect GitHub repository:**
   - Select: `Alphcast/KDJ-LUXURY`
   - Click **"Connect"**

4. **Configure the deployment:**
   - **Name:** `kdj-luxury-backend` (or similar)
   - **Root Directory:** `server` ⚠️ **IMPORTANT!**
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. **Set Environment Variables (Optional):**
   - Key: `PORT` → Value: `3001`
   - Key: `NODE_ENV` → Value: `production`

6. Click **"Create Web Service"**

**Wait for deployment to complete.** You'll see:
- ✅ Build successful
- ✅ Service running
- 🔗 Your backend URL (e.g., `https://kdj-luxury-backend.onrender.com`)

---

### Step 3: Test Backend on Render

Once deployed, test your backend:

```bash
# Test API endpoint
curl https://kdj-luxury-backend.onrender.com/api/products

# Or open in browser
https://kdj-luxury-backend.onrender.com/api/products
```

**✅ You should see your product data in JSON format.**

---

## PART 2️⃣: Deploy Frontend to Vercel

### Step 4: Prepare Your Frontend

Your frontend is in the root directory with:
- `package.json` ✅ (has build script)
- `src/` (React + TypeScript)
- `vite.config.ts` (Vite configuration)
- `vercel.json` (Vercel configuration)

**Verify locally first:**
```bash
npm install
npm run build
npm run preview
```

The frontend should build successfully and preview at `http://localhost:4173`

---

### Step 5: Create Vercel Project for Frontend

1. Go to https://vercel.com and **sign in**
2. Click **"Add New..."** → Select **"Project"**
3. **Import from GitHub:**
   - Search: `KDJ-LUXURY`
   - Click **"Import"**

4. **Configure the project:**
   - **Project Name:** `kdj-luxury-frontend` (or similar)
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build` ✅
   - **Output Directory:** `dist` ✅

5. **Set Environment Variables:**
   - Key: `L`
   - Value: `https://kdj-luxury-backend.onrender.com` (your Render backend URL)
   - Click **"Add"**
VITE_API_UR
6. Click **"Deploy"**

**Wait for deployment to complete.** You'll see:
- ✅ Build successful
- ✅ Deployment live
- 🔗 Your frontend URL (e.g., `https://kdj-luxury-frontend.vercel.app`)

---

## PART 3️⃣: Connect Frontend & Backend Together

### Step 6: Update Environment Variable in Vercel

Now that both are deployed, ensure they can communicate:

1. Go to **Vercel Dashboard** → Your project (`kdj-luxury-frontend`)
2. Click **"Settings"** → **"Environment Variables"**
3. **Verify/Update:**
   - Key: `VITE_API_URL`
   - Value: `https://kdj-luxury-backend.onrender.com`
   - Click **"Save"**

4. Click **"Deployments"** → Click the latest deployment
5. Click **"Redeploy"** (to apply the environment variable)

---

### Step 7: Verify Frontend Calls Backend

1. Open your frontend: `https://kdj-luxury-frontend.vercel.app`
2. **Check Console** (F12 → Console tab):
   - Look for any CORS or API errors
   - Verify API calls are going to your Render backend

3. **Test features:**
   - ✅ Products load from API
   - ✅ Can search/filter products
   - ✅ Admin login works
   - ✅ WhatsApp widget opens

---

## PART 4️⃣: Local Development Setup

To test locally (connecting local frontend to Render backend):

### Step 8: Local Frontend → Render Backend

**Edit `.env.local` in root directory:**

```
VITE_API_URL=https://kdj-luxury-backend.onrender.com
```

**Run locally:**
```bash
npm install
npm run dev
```

Open `http://localhost:5173` - your local frontend will connect to the Render backend.

---

### Step 9: Local Frontend → Local Backend

To test everything locally:

**Terminal 1 (Backend):**
```bash
cd server
npm install
npm start
# Runs on http://localhost:3001
```

**Terminal 2 (Frontend):**
```bash
# Create/edit .env.local
echo VITE_API_URL=http://localhost:3001 > .env.local

npm install
npm run dev
# Runs on http://localhost:5173
```

**Open browser:** `http://localhost:5173`

---

## PART 5️⃣: Environment Variables Reference

### Frontend (.env files)

**`.env.local` (local development):**
```
VITE_API_URL=http://localhost:3001
```

**Vercel Dashboard (production):**
```
VITE_API_URL=https://kdj-luxury-backend.onrender.com
```

### Backend (Render)

No special environment variables needed, but you can set:
```
PORT=3001
NODE_ENV=production
```

---

## ✅ Final Verification Checklist

### Before Going Live

- [ ] Backend deployed to Render
- [ ] Backend URL working (`https://your-render-url.com/api/products`)
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL working (`https://your-vercel-url.com`)
- [ ] Environment variable set: `VITE_API_URL=https://your-render-url.com`
- [ ] Frontend redployed after env variable change

### After Going Live

- [ ] Frontend loads without blank page
- [ ] Products display from API
- [ ] Search/filter works
- [ ] Admin panel accessible
- [ ] WhatsApp widget opens
- [ ] File uploads work (if enabled)
- [ ] No CORS errors in browser console

### Browser DevTools Testing

**Press F12 → Network Tab:**
1. Refresh page
2. Look for API calls to your backend
3. All should show `200` or `201` status
4. No `CORS` or `404` errors

---

## 🆘 Common Issues & Solutions

### Issue 1: CORS Error in Frontend Console

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check your backend has CORS enabled
2. Verify `VITE_API_URL` environment variable is set correctly in Vercel
3. Redeploy frontend after changing environment variable

---

### Issue 2: 404 Not Found on API Calls

**Error:** `GET https://render-url/api/products 404`

**Solution:**
1. Verify backend is running on Render
2. Check Render logs: **Render Dashboard** → Your service → **Logs**
3. Test backend URL directly in browser: `https://your-render-url/api/products`

---

### Issue 3: Blank Page on Frontend

**Error:** Frontend loads but shows nothing

**Solution:**
1. Press F12 → Console tab
2. Look for errors (usually CORS or API not found)
3. Verify environment variables in Vercel
4. Check build log in Vercel: **Deployments** → Click latest → **Build Logs**

---

### Issue 4: Render Service Keeps Spinning Down

**Note:** Free Render tier spins down after 15 minutes of inactivity

**Solutions:**
- Pay for hobby tier (keeps service always on)
- Or set up a ping service to keep it alive

---

## 📱 Quick Reference URLs

After deployment, save these:

| Service | URL |
|---------|-----|
| Frontend | `https://kdj-luxury-frontend.vercel.app` |
| Backend | `https://kdj-luxury-backend.onrender.com` |
| Admin Login | `https://kdj-luxury-frontend.vercel.app/admin` |

---

## 🎯 Deployment Workflow Summary

### First Time Setup:
```
1. Push code to GitHub
2. Deploy backend to Render (set root directory to 'server')
3. Deploy frontend to Vercel (set env variable: VITE_API_URL)
4. Redeploy frontend after env variable is set
5. Test everything works
```

### Future Updates:
```
1. Make changes locally
2. Test: npm run build (frontend) / npm start (backend)
3. Push to GitHub
4. Both Render and Vercel auto-deploy from main branch
5. Verify in browser
```

### For Local Development:
```
1. Set .env.local with VITE_API_URL=http://localhost:3001
2. Terminal 1: cd server && npm start
3. Terminal 2: npm run dev
4. Open http://localhost:5173
```

---

## 📞 Support & Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **GitHub:** https://github.com/Alphcast/KDJ-LUXURY
- **Vite Docs:** https://vitejs.dev

---

## 🔐 Security Reminders

⚠️ **Before production:**

1. Change default admin credentials (in `src/App.tsx`)
   - Username: `KDJLUXURY`
   - Password: `KDJ123@`

2. Don't commit `.env.local` to GitHub

3. Keep API URLs in environment variables, not hardcoded

4. Enable HTTPS (both Render and Vercel do this by default)

---

**✨ You're ready to deploy! Follow the steps above and your KDJ Luxury app will be live! ✨**
