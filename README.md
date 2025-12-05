# Zcash Pulseboard 📊

**Real-time Zcash network analytics with privacy-focused insights and intelligent alerting.**

Zcash Pulseboard is a production-ready analytics and alerting platform built for the Zcash Data & Analytics hackathon. It transforms live blockchain data into actionable privacy insights with statistical anomaly detection and real-time notifications.

## 🌐 Live Demo

- **Frontend**: https://zcash-pulseboard.vercel.app
- **Backend API**: https://zcash-pulse-backend-70e9bddfb521.herokuapp.com
- **API Docs**: https://zcash-pulse-backend-70e9bddfb521.herokuapp.com/docs

## 🚀 Key Features

### Live Data Integration
- **Zchain API**: Real-time blockchain metrics (transactions, volumes, fees, block times)
- **CoinGecko API**: Market data and price correlation
- **Auto-refresh**: Configurable refresh intervals (default: 5 minutes)
- **Graceful Fallback**: Automatically falls back to sample data if APIs are unavailable

### Advanced Analytics
- **Privacy Health Score**: 0-100 composite metric tracking network privacy adoption
- **Shielded Pool Analytics**: Transaction and volume breakdown (shielded vs transparent)
- **Network Health Dashboard**: A+ to F grading system with component breakdown
- **Trend Analysis**: 30-day historical charts with interactive tooltips
- **Pool Migration Tracking**: Monitor adoption trends with velocity metrics

### Intelligent Alerting
- **Anomaly Detection**: Statistical z-score based detection (configurable threshold)
- **Discord/Slack Integration**: Real-time webhook notifications for critical events
- **Severity Levels**: High, medium, low with color-coded alerts
- **Smart Filtering**: Configurable severity thresholds

### Modern UI
- **Burgundy/Gold Theme**: Privacy-focused dark theme with Zcash branding
- **Glassmorphism Design**: Modern backdrop blur and gradient effects
- **Responsive Charts**: Interactive Recharts visualizations
- **Real-time Updates**: React Query with automatic refetching
- **Data Export**: CSV and JSON export functionality

## 📊 Architecture

```
Zchain API + CoinGecko
       ↓
   ETL Pipeline
       ↓
    DuckDB Warehouse
       ↓
   FastAPI Backend (Heroku)
       ↓
  React Dashboard (Vercel)
```

## 📁 Project Structure

```
zcash-pulseboard/
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── api/           # REST API routes
│   │   ├── services/      # Business logic & analytics
│   │   ├── models/        # Pydantic data models
│   │   ├── jobs/          # APScheduler background tasks
│   │   ├── db/            # DuckDB client
│   │   ├── config.py      # Settings management
│   │   └── main.py        # FastAPI application
│   ├── data/              # DuckDB database file
│   ├── tests/             # Test suite
│   └── requirements.txt   # Python dependencies
│
├── data/                  # ETL pipeline
│   ├── etl/
│   │   ├── sources/       # API clients (Zchain, CoinGecko)
│   │   ├── transformers/  # Anomaly detection
│   │   └── pipeline.py    # ETL orchestration
│   └── sample/            # Sample data for development
│
├── frontend/              # React dashboard
│   ├── src/
│   │   ├── components/    # React components (TypeScript)
│   │   ├── hooks/         # React Query hooks
│   │   ├── config/        # API configuration
│   │   └── styles/        # Tailwind CSS
│   ├── index.html
│   └── package.json
│
├── Procfile               # Heroku deployment config
├── runtime.txt            # Python version for Heroku
├── requirements.txt       # Root requirements for Heroku
└── vercel.json            # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) DuckDB CLI for database inspection

### Local Development

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
uvicorn app.main:app --reload --port 8001
```

Backend will be available at:
- API: http://localhost:8001/api
- Docs: http://localhost:8001/docs

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:5173

### Environment Variables

#### Backend (`backend/.env`)
```bash
# Enable/disable live data fetching
ENABLE_LIVE_DATA=true

# Refresh interval (minutes)
REFRESH_INTERVAL_MINUTES=5

# Database path (relative to backend directory)
DB_PATH=data/zcash_pulse.duckdb

# Discord webhook for alerts (optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR-WEBHOOK

# Anomaly detection settings
ENABLE_ANOMALY_DETECTION=true
ANOMALY_ZSCORE_THRESHOLD=2.5
ALERT_SEVERITY_THRESHOLD=medium
```

#### Frontend (`frontend/.env.local`)
```bash
# For local development (uses Vite proxy)
# No VITE_API_URL needed - will proxy to localhost:8001

# For production builds
VITE_API_URL=https://your-backend-url.herokuapp.com
```

## 📈 Key Metrics Tracked

### On-Chain Metrics
- Total daily transactions (shielded + transparent)
- Shielded transaction count and percentage
- Transaction volumes in ZEC
- Average and median fees
- Average block time
- Active address count

### Market Metrics
- ZEC price (USD)
- Market capitalization
- 24h trading volume
- Price change percentage

### Privacy Metrics
- Privacy Health Score (0-100)
- Shielded transaction ratio
- Shielded volume ratio
- Privacy adoption trends
- Pool migration velocity

## 🔔 Anomaly Detection

The system automatically detects statistical anomalies using z-scores:

- **Transaction Spikes/Drops**: >2σ deviation triggers alerts
- **Fee Anomalies**: Unusual fee pressure detection
- **Volume Changes**: Significant shifts in shielded/transparent volumes
- **Address Activity**: Unusual network participation patterns

Alerts are:
- Stored in DuckDB for historical analysis
- Sent to Discord/Slack webhooks (if configured)
- Displayed in the dashboard with severity color-coding

## 🧪 Testing

```bash
# Run backend tests
cd backend
pytest

# Test specific modules
pytest tests/test_metrics_service.py -v

# Test API endpoints
curl http://localhost:8001/api/health
curl http://localhost:8001/api/metrics/summary
```

## 🚀 Deployment

### Production Deployment

**Backend**: Deployed on Heroku
- Automatic deployment from GitHub
- Uses `Procfile` for startup command
- Python 3.11.9 runtime

**Frontend**: Deployed on Vercel
- Automatic deployment from GitHub
- Uses `vercel.json` for configuration
- Environment variables set in Vercel dashboard

### Deployment Files

- `Procfile` - Heroku web process configuration
- `runtime.txt` - Python version specification
- `requirements.txt` - Python dependencies (root)
- `vercel.json` - Vercel build and routing configuration
- `frontend/.env.production` - Production environment template

## 🎯 Hackathon Highlights

**What Makes This Special:**
1. **Live Data**: Real API integration with graceful fallback
2. **Privacy Focus**: Unique Zcash-specific insights on shielded pool health
3. **Anomaly Detection**: Statistical analysis, not just simple thresholds
4. **Production Quality**: Error handling, logging, configuration management
5. **Beautiful UI**: Modern design with glassmorphism and smooth animations
6. **Full Stack Deployment**: Production-ready on Heroku + Vercel
7. **TypeScript Frontend**: Type-safe React components

## 🛠️ Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- DuckDB - Embedded analytics database
- Polars - High-performance data processing
- APScheduler - Background job scheduling
- Pydantic - Data validation
- HTTPX - Async HTTP client

**Frontend:**
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Utility-first styling
- Recharts - Chart library
- React Query - Data fetching
- Axios - HTTP client

**APIs:**
- Zchain API - Zcash blockchain data
- CoinGecko API - Market data

## 📝 API Endpoints

### Metrics
- `GET /api/health` - Health check
- `GET /api/metrics/summary` - Dashboard summary
- `GET /api/metrics/kpis` - Key performance indicators
- `GET /api/metrics/daily` - Daily historical metrics
- `GET /api/metrics/privacy` - Privacy metrics
- `GET /api/metrics/pool-migration` - Pool migration trends
- `GET /api/metrics/momentum` - Network momentum
- `GET /api/metrics/metadata` - Data freshness info

### Alerts
- `GET /api/alerts` - Recent alerts with filtering

### Export
- `GET /api/export/metrics/csv` - Export metrics as CSV
- `GET /api/export/metrics/json` - Export metrics as JSON
- `GET /api/export/alerts/csv` - Export alerts as CSV
- `GET /api/export/alerts/json` - Export alerts as JSON

## 🤝 Contributing

Built for the Zcash Data & Analytics hackathon. Open source and ready for community contributions!

## 📜 License

MIT

---

**Built with ❤️ for the Zcash community**

**Tech Stack:** FastAPI • React • TypeScript • DuckDB • Tailwind CSS • Recharts • Polars • APScheduler

**Deployed on:** Heroku • Vercel

**APIs:** Zchain • CoinGecko
