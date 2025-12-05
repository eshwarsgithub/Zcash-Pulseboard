# Zcash Pulseboard

A privacy-first network intelligence and analytics dashboard for the Zcash blockchain. Real-time metrics, KPIs, alerts, and insights to monitor network health, privacy adoption, and shielded pool migration trends.

## 🎯 Overview

Zcash Pulseboard provides comprehensive analytics and alerting capabilities for monitoring the Zcash network. The platform tracks key metrics including transaction volumes, shielded pool adoption, network health, privacy trends, and generates actionable insights and alerts.

## ✨ Features

### Core Metrics & KPIs
- **Total Transactions** - Daily transaction count with trend analysis
- **Shielded Share** - Percentage of transactions using shielded pools
- **Average Fee** - Network fee trends and cost analysis
- **Active Addresses** - Network participation metrics

### Advanced Analytics
- **Privacy Metrics** - Privacy score calculation and trend analysis
- **Network Health** - Comprehensive health scoring with component breakdown
- **Shielded Pool Momentum** - Momentum index tracking privacy adoption trends
- **Pool Migration** - Adoption velocity and migration forecasting

### Alerts & Insights
- Real-time alert feed for network anomalies
- Automated insight generation based on metric changes
- Data freshness indicators
- Export capabilities (CSV/JSON)

## 🏗️ Architecture

### Backend (`/backend`)
- **Framework**: FastAPI (Python 3.9+)
- **Database**: DuckDB for analytics workloads
- **Data Processing**: Polars for high-performance data operations
- **Scheduling**: APScheduler for background jobs
- **API**: RESTful API with OpenAPI documentation

### Frontend (`/frontend`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: TanStack Query (React Query)

## 📁 Project Structure

```
Z/
├── backend/                 # FastAPI backend service
│   ├── app/
│   │   ├── api/            # API routes and endpoints
│   │   ├── db/             # Database client and repository
│   │   ├── jobs/           # Background job scheduling
│   │   ├── models/         # Pydantic models and schemas
│   │   ├── services/       # Business logic services
│   │   └── main.py         # FastAPI application entry point
│   ├── tests/              # Test suite
│   ├── Dockerfile          # Container configuration
│   ├── requirements.txt    # Python dependencies
│   └── pyproject.toml      # Project metadata
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── config/         # Configuration files
│   │   └── styles/         # Global styles
│   ├── package.json        # Node dependencies
│   └── vite.config.ts      # Vite configuration
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+** for backend
- **Node.js 18+** and npm for frontend
- **DuckDB** (installed via pip)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (create `.env` file):
   ```env
   DATABASE_PATH=./data/zcash_pulse.duckdb
   ENABLE_LIVE_DATA=false
   REFRESH_INTERVAL_MINUTES=60
   ```

5. **Run the backend**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Or use the startup script:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

6. **Access API documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   Edit `src/config/api.ts` to point to your backend URL

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - API: http://localhost:8000

### Docker Deployment

**Backend**:
```bash
cd backend
docker build -t zcash-pulse-backend .
docker run -p 8000:8000 zcash-pulse-backend
```

## 📡 API Endpoints

### Health & Metadata
- `GET /api/health` - Health check endpoint
- `GET /api/metrics/metadata` - Dataset metadata

### Metrics
- `GET /api/metrics/daily` - Daily metrics (last 30 days)
- `GET /api/metrics/kpis` - Key performance indicators
- `GET /api/metrics/summary` - 7-day summary with health scores
- `GET /api/metrics/privacy` - Privacy-focused metrics
- `GET /api/metrics/health` - Detailed network health score
- `GET /api/metrics/momentum` - Shielded pool momentum index
- `GET /api/metrics/pool-migration?days=30` - Pool migration trends

### Alerts
- `GET /api/alerts` - Alert feed (last 10 alerts)

### Export
- `GET /api/export/metrics/csv?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Export metrics as CSV
- `GET /api/export/metrics/json?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Export metrics as JSON
- `GET /api/export/alerts/csv?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Export alerts as CSV
- `GET /api/export/alerts/json?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Export alerts as JSON

## 🧪 Testing

**Backend Tests**:
```bash
cd backend
pytest tests/
```

**Frontend Linting**:
```bash
cd frontend
npm run lint
```

## 🛠️ Development

### Code Style

**Backend**:
- Uses `ruff` for linting
- Uses `black` for code formatting
- Line length: 100 characters

**Frontend**:
- TypeScript strict mode enabled
- ESLint with Prettier configuration
- React best practices

### Adding New Metrics

1. Add data model in `backend/app/models/metrics.py`
2. Implement service logic in `backend/app/services/metrics_service.py`
3. Add API route in `backend/app/api/routes.py`
4. Create frontend component in `frontend/src/components/`
5. Integrate into `frontend/src/App.tsx`

## 📊 Data Sources

The backend supports multiple data sources:
- **Sample Data**: Pre-loaded sample data for development
- **Live Data**: Real-time data fetching (configure via `ENABLE_LIVE_DATA`)

## 🔒 Privacy & Security

- CORS configured for frontend-backend communication
- Environment variables for sensitive configuration
- No sensitive data stored in repository
- Database files excluded via `.gitignore`

## 📝 License

MIT License - See project metadata for details

## 👥 Contributors

Zcash Pulse Hackathon Team

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [DuckDB Documentation](https://duckdb.org/docs/)
- [Polars Documentation](https://pola-rs.github.io/polars/)

---

**Note**: This project is actively maintained. For issues, feature requests, or questions, please open an issue on the repository.

