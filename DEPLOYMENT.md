# 🚀 Deployment Guide - Zcash Pulseboard

This guide will help you deploy both frontend and backend for the hackathon.

## Quick Deploy (5 minutes)

### Step 1: Deploy Backend to Railway ⚡

**Railway** is perfect for Python backends - free tier, automatic deploys from GitHub.

1. **Sign up**: Go to [railway.app](https://railway.app) and sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Zcash-Pulseboard` repository
   - Select the `main` branch

3. **Configure Backend**:
   - Click "Add variables" and set:
     ```
     PORT=8000
     PYTHON_VERSION=3.9
     ```
   - Railway will auto-detect the Python app

4. **Set Root Directory**:
   - Go to Settings → Service Settings
   - Set "Root Directory" to `backend`
   - Set "Start Command" to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Deploy**:
   - Click "Deploy"
   - Wait ~2 minutes for build
   - Copy the generated URL (e.g., `https://zcash-backend-production.up.railway.app`)

### Step 2: Update Frontend Environment Variable

1. **Update Vercel Environment**:
   - Go to your Vercel project dashboard
   - Click "Settings" → "Environment Variables"
   - Add variable:
     ```
     Name: VITE_API_URL
     Value: https://your-backend-url.railway.app
     (paste the Railway URL from Step 1)
     ```
   - Click "Save"

2. **Redeploy Frontend**:
   - Go to "Deployments"
   - Click "..." on latest deployment → "Redeploy"
   - Or push a new commit to trigger auto-deploy

### Step 3: Verify Deployment ✅

1. Visit your Vercel URL: `https://zcash-pulseboard.vercel.app`
2. Open browser DevTools (F12) → Console
3. Check for successful API calls (no CORS or 404 errors)
4. Verify data is loading on the dashboard

---

## Alternative: Deploy Backend to Render

If Railway doesn't work, use **Render** (also free):

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `zcash-pulseboard-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Copy the URL and update Vercel environment variable

---

## Alternative: Deploy Backend to Fly.io

Fastest option for global deployment:

1. Install Fly CLI: `brew install flyctl` (Mac) or see [fly.io/docs/hands-on/install-flyctl](https://fly.io/docs/hands-on/install-flyctl/)
2. Login: `flyctl auth login`
3. Create `Dockerfile` in `/backend`:
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```
4. Deploy:
   ```bash
   cd backend
   flyctl launch --name zcash-backend
   flyctl deploy
   ```
5. Get URL: `flyctl status`

---

## Environment Variables Reference

### Backend (Railway/Render/Fly.io)
```bash
PORT=8000                    # Auto-set by platform
PYTHON_VERSION=3.9          # Python version
DISCORD_WEBHOOK_URL=        # Optional: Discord notifications
SLACK_WEBHOOK_URL=          # Optional: Slack notifications
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-backend-url.railway.app
```

---

## Troubleshooting

### Frontend shows "Failed to fetch" errors
- **Cause**: Backend URL not set or incorrect
- **Fix**: Check `VITE_API_URL` in Vercel environment variables
- **Verify**: Visit `https://your-backend-url/api/health` - should return `{"status": "ok"}`

### Backend deploys but crashes
- **Cause**: Missing dependencies or database
- **Fix**: Check logs in Railway/Render dashboard
- **Common issue**: DuckDB database file missing - backend creates it automatically on first run

### CORS errors
- **Cause**: Frontend domain not in CORS allowed origins
- **Fix**: Backend already allows all origins (`allow_origins=["*"]`) in `backend/app/main.py`
- **Production**: Update CORS to only allow your Vercel domain for security

### 404 on Vercel
- **Cause**: SPA routing not configured
- **Fix**: Already handled by `vercel.json` rewrite rules
- **Verify**: `vercel.json` exists in root directory

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible at `/api/health`
- [ ] Frontend deployed on Vercel
- [ ] Environment variable `VITE_API_URL` set in Vercel
- [ ] Dashboard loads without errors
- [ ] API calls successful (check browser console)
- [ ] Charts display data
- [ ] Export functionality works
- [ ] No CORS errors

---

## Performance Tips

1. **Enable Vercel Analytics**:
   - Go to project → "Analytics" → Enable
   - Monitor real user performance

2. **Railway Auto-Sleep**:
   - Free tier sleeps after 5min inactivity
   - First request takes ~10s to wake up
   - Upgrade to Hobby plan ($5/mo) for always-on

3. **CDN Caching**:
   - Vercel automatically caches static assets
   - API calls are NOT cached (dynamic data)

---

## Cost Breakdown

**Free Tier (Recommended for Hackathon)**:
- Frontend (Vercel): FREE - 100GB bandwidth
- Backend (Railway): FREE - 500 hours/month
- **Total**: $0/month ✅

**Production Tier**:
- Frontend (Vercel Pro): $20/month
- Backend (Railway Hobby): $5/month
- **Total**: $25/month

---

## Quick Deploy Commands

```bash
# Deploy backend to Railway (via CLI)
npm i -g @railway/cli
railway login
railway init
railway up

# Deploy frontend to Vercel (via CLI)
npm i -g vercel
cd frontend
vercel --prod
```

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Fly.io Docs**: https://fly.io/docs

Good luck with your hackathon! 🏆
