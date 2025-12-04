# 🚀 QUICK DEPLOY - Fix Your Vercel 404

## What I Just Fixed

✅ Created `vercel.json` - Tells Vercel to build from `/frontend` directory
✅ Created `requirements.txt` - Backend dependencies for Railway/Render
✅ Created `Procfile` - Railway/Render startup command
✅ Created `railway.json` - Railway configuration
✅ Created `.gitignore` - Prevents committing sensitive files
✅ Created `.env.production` - Production environment template

## Next Steps (5 minutes)

### 1. Push to GitHub

```bash
cd /Users/eshwar/Desktop/Z/Z
git add .
git commit -m "Add deployment configuration for Vercel + Railway

- Add vercel.json for frontend deployment
- Add requirements.txt for backend dependencies
- Add Railway/Procfile configuration
- Add .gitignore for security
- Add deployment documentation"
git push origin main
```

### 2. Deploy Backend to Railway (FREE)

**Option A: One-Click Deploy** (FASTEST - 2 minutes)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `Zcash-Pulseboard`
4. Railway will auto-detect Python
5. **IMPORTANT**: After deployment:
   - Go to Settings → Change "Root Directory" to `backend`
   - Click "Redeploy"
6. Copy the URL (e.g., `https://zcash-pulseboard-production.up.railway.app`)

**Option B: Railway CLI** (For developers)

```bash
npm i -g @railway/cli
cd backend
railway login
railway init
railway up
```

### 3. Update Vercel Environment Variable

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `zcash-pulseboard` project
3. Click "Settings" → "Environment Variables"
4. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://YOUR-RAILWAY-URL` (paste URL from step 2)
   - **Environment**: Production, Preview, Development (check all)
5. Click "Save"

### 4. Redeploy Frontend

```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

Or in Vercel dashboard:
- Go to "Deployments"
- Click "..." on latest → "Redeploy"

### 5. Verify Deployment ✅

1. Visit: `https://zcash-pulseboard.vercel.app`
2. Open DevTools (F12) → Console
3. Should see successful API calls
4. Dashboard should load with data

---

## Troubleshooting

### Still getting 404 on Vercel?

Check the build log:
1. Vercel dashboard → "Deployments" → Click latest deployment
2. Look for: "Build Completed in /vercel/output"
3. Should see files in `frontend/dist/`

### Backend not working?

Test the Railway URL directly:
```bash
curl https://YOUR-RAILWAY-URL/api/health
# Should return: {"status": "ok"}
```

If it fails:
- Railway dashboard → Check logs
- Look for errors in startup
- Verify "Root Directory" is set to `backend`

### Frontend loads but no data?

1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly in Vercel
3. Test API URL in browser: `https://YOUR-RAILWAY-URL/api/kpis`

---

## Alternative Deployment Options

### Backend: Render (if Railway doesn't work)

1. Go to [render.com](https://render.com)
2. "New" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Deploy → Copy URL → Update Vercel env var

### Backend: Fly.io (fastest performance)

```bash
# Install Fly CLI
brew install flyctl

# Login
flyctl auth login

# Deploy
cd backend
flyctl launch --name zcash-backend
flyctl deploy

# Get URL
flyctl status
```

---

## Deployment Status

- [ ] Backend deployed to Railway/Render/Fly.io
- [ ] Backend URL copied
- [ ] Vercel env var `VITE_API_URL` updated
- [ ] Frontend redeployed
- [ ] Tested at https://zcash-pulseboard.vercel.app
- [ ] No console errors
- [ ] Data loading successfully

---

## Next: Hackathon Submission

Once deployed:
1. ✅ Test all features (export, charts, alerts)
2. ✅ Take screenshots for submission
3. ✅ Record demo video (Loom/OBS)
4. ✅ Submit with deployed URL

**Your deployment URLs**:
- Frontend: https://zcash-pulseboard.vercel.app
- Backend: https://[YOUR-RAILWAY-URL]
- Repo: https://github.com/eshwarsgithub/Zcash-Pulseboard

Good luck! 🏆
