# 🚀 Deploy Backend to Render

## Why Render?
- ✅ FREE tier (750 hours/month - more than Railway!)
- ✅ Simple GitHub integration
- ✅ Persistent disk storage for DuckDB
- ✅ Auto-deploy on push

## Step-by-Step (3 minutes)

### 1. Sign Up

1. Go to [render.com](https://render.com)
2. Click "Get Started" → Sign in with GitHub
3. Authorize Render to access your repositories

### 2. Create Web Service

1. Click "New" → "Web Service"
2. Connect your `Zcash-Pulseboard` repository
3. Click "Connect"

### 3. Configure Service

**Basic Settings:**
- **Name**: `zcash-pulseboard-backend`
- **Region**: Choose closest to your users (e.g., Oregon - US West)
- **Branch**: `main`
- **Root Directory**: `backend` ← IMPORTANT!

**Build & Deploy:**
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Instance Type:**
- Select: **Free** (0.1 CPU, 512 MB RAM)

### 4. Add Environment Variables (Optional)

If you want to add Discord/Slack webhooks:
- Click "Environment" → "Add Environment Variable"
- Add: `DISCORD_WEBHOOK_URL` or `SLACK_WEBHOOK_URL`

### 5. Deploy

1. Click "Create Web Service"
2. Wait ~3-5 minutes for deployment
3. Render will:
   - Clone your repo
   - Install dependencies from `requirements.txt`
   - Start your FastAPI app
   - Generate a URL like: `https://zcash-pulseboard-backend.onrender.com`

### 6. Get Your Backend URL

Once deployed:
1. Copy the URL from the dashboard
2. Test it: `curl https://YOUR-RENDER-URL/api/health`
3. Expected: `{"status": "ok"}`

### 7. Update Vercel Environment

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Select your `zcash-pulseboard` project
3. Settings → Environment Variables
4. Add/Update:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-RENDER-URL` (no trailing slash)
5. Save → Redeploy frontend

---

## Render vs Railway Comparison

| Feature | Render | Railway |
|---------|--------|---------|
| **Free Tier** | 750 hrs/month | 500 hrs/month |
| **Sleep Policy** | After 15 min inactivity | After 5 min inactivity |
| **Cold Start** | ~15-30 seconds | ~10 seconds |
| **Build Speed** | 2-5 minutes | 1-2 minutes |
| **Persistent Disk** | ✅ Yes | ✅ Yes |
| **Auto-Deploy** | ✅ Yes | ✅ Yes |
| **Custom Domains** | ✅ Free | ✅ Free |
| **Setup Difficulty** | ⭐⭐⭐ Easy | ⭐⭐⭐⭐⭐ Easier |

**Recommendation**: Try Railway first (faster). If issues, use Render (more free hours).

---

## Troubleshooting Render

### Build Fails with "Module not found"
**Fix**: Check `requirements.txt` exists in `/backend` directory
```bash
ls backend/requirements.txt  # Should exist
```

### App crashes on startup
**Fix**: Check Render logs:
1. Dashboard → Your service → "Logs"
2. Look for Python errors
3. Common issue: Wrong start command

Verify start command is:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Health check fails
**Fix**: Render needs time to start
1. Wait 1-2 minutes after deploy shows "Live"
2. Check logs for "Uvicorn running on http://0.0.0.0:XXXX"
3. Test with: `curl https://YOUR-URL/api/health`

### Database not persisting
**Fix**: Add persistent disk (optional for free tier)
1. Service → "Disks" → "Add Disk"
2. Mount path: `/app/data`
3. Size: 1 GB (free)
4. Update code to use `/app/data/zcash_pulse.duckdb`

---

## Free Tier Limitations

**Render Free Tier**:
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ Cold start takes 15-30 seconds
- ⚠️ 750 hours/month (enough for 24/7 if only one service)
- ⚠️ 0.1 CPU, 512 MB RAM (sufficient for your app)

**To prevent sleep** (optional):
- Set up a cron job to ping your API every 14 minutes
- Use [UptimeRobot](https://uptimerobot.com) (free) to monitor
- Or upgrade to paid tier ($7/month for always-on)

---

## Post-Deployment Checklist

- [ ] Service shows "Live" in Render dashboard
- [ ] URL accessible: `curl https://YOUR-URL/api/health`
- [ ] Vercel env var `VITE_API_URL` updated
- [ ] Frontend redeployed
- [ ] Dashboard loads data successfully
- [ ] No CORS errors in browser console

---

## Next: Keep-Alive for Demo Day

If you're demoing for the hackathon, prevent sleep:

**Option 1: UptimeRobot** (Free, no code)
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://YOUR-RENDER-URL/api/health`
   - Interval: 5 minutes
3. Done! Your API stays awake

**Option 2: GitHub Actions** (Free, automated)
Create `.github/workflows/keep-alive.yml`:
```yaml
name: Keep API Alive
on:
  schedule:
    - cron: '*/14 * * * *'  # Every 14 minutes
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl https://YOUR-RENDER-URL/api/health
```

Good luck! 🚀
