# Zcash Pulseboard

Zcash Pulseboard is a hackathon-ready analytics and alerting stack that turns raw Zcash
network data into human-friendly insights. The stack is split into a Python FastAPI
backend for metrics and alert computation and a React + Vite frontend that renders the
dashboard experience.

## Project layout

- `backend/` – FastAPI application, scheduled refresh jobs, DuckDB integration, and
	sample data access.
- `data/` – Sample JSON metrics/alerts plus ETL helpers for loading into DuckDB.
- `frontend/` – React dashboard consuming the API, with charts, KPI cards, and alerts.
- `notebooks/` – Reserved for exploratory analysis during the hackathon.

## Getting started

### Requirements

- Python 3.9+
- Node.js 18+
- (Optional) DuckDB CLI for inspecting the local warehouse

### Setup commands

```bash
# Backend
cd backend
/Users/eshwar/Desktop/Z/.venv/bin/python -m pip install -U pip
/Users/eshwar/Desktop/Z/.venv/bin/python -m pip install -e .[dev]

# Frontend
cd ../frontend
npm install
```

### Run the stack locally

```bash
# Terminal 1 – backend API
cd backend
/Users/eshwar/Desktop/Z/.venv/bin/python -m uvicorn app.main:app --reload

# Terminal 2 – frontend dashboard
cd frontend
npm run dev
```

Open http://localhost:5173 to explore the dashboard against the sample data. The backend
serves API docs at http://localhost:8000/docs.

## Testing

```bash
cd backend
/Users/eshwar/Desktop/Z/.venv/bin/python -m pytest
```

## Next steps

- Wire `data/etl` to live Zcash explorers for fresh data.
- Expand metric coverage (shielded pool health, exchange flows, governance).
- Add webhook/Discord delivery for alerts.
- Package an SDK client for third-party tooling.

