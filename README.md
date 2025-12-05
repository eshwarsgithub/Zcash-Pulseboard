# Zcash Pulseboard

**Real-time Zcash network analytics with privacy-focused insights and intelligent alerting.**

Zcash Pulseboard is a production-ready analytics and alerting platform built for the Zcash Data & Analytics hackathon bounty. It transforms live blockchain data into actionable privacy insights with statistical anomaly detection and real-time notifications.

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

## 📊 Architecture

```
Zchain API + CoinGecko
       ↓
   ETL Pipeline
       ↓
    DuckDB Warehouse
       ↓
   FastAPI Backend
       ↓
  React Dashboard
```

## Project Layout

- `backend/` – FastAPI application with scheduled refresh jobs and analytics engine
- `data/` – ETL pipeline with live API clients and sample data for development
- `frontend/` – React dashboard with Tailwind CSS and Recharts visualizations
- `notebooks/` – Reserved for exploratory analysis

## 🚀 Quick Start

### Requirements

- Python 3.9+
- Node.js 18+
- (Optional) DuckDB CLI for inspecting the database

### Installation

```bash
# 1. Install backend dependencies
cd backend
/Users/eshwar/Desktop/Z/.venv/bin/python -m pip install -U pip
/Users/eshwar/Desktop/Z/.venv/bin/python -m pip install -e .[dev]
/Users/eshwar/Desktop/Z/.venv/bin/pip install pydantic-settings pyarrow

# 2. Install frontend dependencies
cd ../frontend
npm install

# 3. Configure environment (optional)
cd ../backend
cp .env.example .env
# Edit .env to add Discord webhook URL if desired
```

### Run the Stack

```bash
# Terminal 1: Backend API
cd backend
/Users/eshwar/Desktop/Z/.venv/bin/python -m uvicorn app.main:app --reload

# Terminal 2: Frontend Dashboard
cd frontend
npm run dev
```

**Access the Dashboard:**
- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/api/health

## ⚙️ Configuration

Edit `backend/.env` to customize:

```bash
# Enable/disable live data fetching
ENABLE_LIVE_DATA=true

# Refresh interval (minutes)
REFRESH_INTERVAL_MINUTES=5

# Discord webhook for alerts
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR-WEBHOOK

# Anomaly detection settings
ENABLE_ANOMALY_DETECTION=true
ANOMALY_ZSCORE_THRESHOLD=2.5
ALERT_SEVERITY_THRESHOLD=medium
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
/Users/eshwar/Desktop/Z/.venv/bin/python -m pytest

# Test API connections
cd ..
/Users/eshwar/Desktop/Z/.venv/bin/python -c "
import asyncio
from data.etl.sources.zchain_client import ZchainClient
from data.etl.sources.coingecko_client import CoinGeckoClient

async def test():
    async with ZchainClient() as z, CoinGeckoClient() as c:
        print('Zchain:', 'OK' if await z.test_connection() else 'FAIL')
        print('CoinGecko:', 'OK' if await c.test_connection() else 'FAIL')

asyncio.run(test())
"
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

## 🎯 Hackathon Highlights

**What Makes This Special:**
1. **Live Data**: Real API integration with graceful fallback
2. **Privacy Focus**: Unique Zcash-specific insights on shielded pool health
3. **Anomaly Detection**: Statistical analysis, not just simple thresholds
4. **Production Quality**: Error handling, logging, configuration management
5. **Beautiful UI**: Modern design with glassmorphism and smooth animations

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routes
│   │   ├── services/      # Business logic & analytics
│   │   ├── models/        # Pydantic data models
│   │   ├── jobs/          # APScheduler tasks
│   │   ├── db/            # Database client
│   │   └── config.py      # Settings management
│   └── tests/             # Test suite
├── data/
│   ├── etl/
│   │   ├── sources/       # API clients (Zchain, CoinGecko)
│   │   ├── transformers/  # Anomaly detection
│   │   └── pipeline.py    # ETL orchestration
│   └── sample/            # Sample data for development
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── hooks/         # React Query hooks
    │   └── styles/        # Tailwind CSS
    └── public/            # Static assets
```

## 🤝 Contributing

Built for the Zcash Data & Analytics hackathon bounty. Open source and ready for community contributions!

## 📜 License

MIT

---

**Built with:** FastAPI • React • DuckDB • Tailwind CSS • Recharts • Polars • APScheduler

**APIs:** Zchain • CoinGecko

