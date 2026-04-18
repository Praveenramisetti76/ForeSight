# ForeSight — AI-Based Project Risk Prediction Tool

A full-stack web application that uses a **Random Forest classifier** to predict project risk levels (Low / Medium / High) based on duration, budget, and team size.

| Layer | Tech |
|-------|------|
| Backend | Python, FastAPI, Motor (async MongoDB) |
| Frontend | React, Tailwind CSS |
| ML | scikit-learn RandomForestClassifier |
| Database | MongoDB Atlas |

---

## Prerequisites

| Tool | Install |
|------|---------|
| **Python 3.12+** | [python.org](https://www.python.org/downloads/) |
| **uv** | `pip install uv` or [docs.astral.sh/uv](https://docs.astral.sh/uv/) |
| **Node.js 18+** | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | The app is pre-configured for MongoDB Atlas. To use a local instance, update `MONGO_URI` in `backend/.env` |

---

## Quick Start

Open **two terminals**, both starting from the `risk-tool/` folder.

### Terminal 1 — Backend

```bash
cd backend

# Create virtual environment (first time only)
uv venv

# Activate it
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Windows CMD:
.venv\Scripts\activate.bat
# macOS / Linux:
source .venv/bin/activate

# Install dependencies (first time only)
uv pip install fastapi "uvicorn[standard]" motor "pymongo[srv]" "python-jose[cryptography]" "passlib[bcrypt]" bcrypt==4.0.1 scikit-learn pandas python-multipart python-dotenv joblib dnspython

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000
```

On first startup the ML model trains automatically and saves `model.pkl`.  
You should see:

```
Training model...
Model saved to ...\backend\model.pkl
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 — Frontend

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start the dev server
npm run dev
```

You should see:

```
VITE ready in ~500ms
➜  Local: http://localhost:5173/
```

---

## Usage

1. Open **http://localhost:5173** in your browser.
2. **Register** a new account (choose *Administrator* role if you want admin features).
3. Go to **Dashboard**, enter project details, and click **Predict Risk**.
4. View past predictions on the **History** page.

### Admin-only features (visible only to admin users)

- **Upload Dataset** — replace `sample_data.csv` and retrain the model.
- **Risk Thresholds** — override model output with custom confidence thresholds.

---

## Environment Variables

All secrets live in `backend/.env`:

```env
MONGO_URI=mongodb+srv://...         # MongoDB connection string
JWT_SECRET=your_secret_key          # JWT signing key
JWT_EXPIRE_MINUTES=60               # Token expiry in minutes
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Login, returns JWT |
| POST | `/projects/predict` | JWT | Predict risk level |
| GET | `/projects/history` | JWT | User's prediction history |
| POST | `/admin/upload-dataset` | Admin | Upload new CSV & retrain |
| PUT | `/admin/risk-rules` | Admin | Set confidence thresholds |
| GET | `/admin/dataset-info` | Admin | Dataset row count & columns |

Interactive API docs are available at **http://localhost:8000/docs** when the backend is running.

---

## Project Structure

```
risk-tool/
├── backend/
│   ├── .env                 # Environment variables
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Pydantic schemas
│   ├── auth.py              # JWT + bcrypt auth helpers
│   ├── sample_data.csv      # Training dataset (30 rows)
│   ├── model.pkl            # Trained model (auto-generated)
│   ├── routes/
│   │   ├── auth.py          # /auth/*
│   │   ├── projects.py      # /projects/*
│   │   └── admin.py         # /admin/*
│   └── ml/
│       ├── train.py         # Model training
│       └── predict.py       # Prediction function
└── frontend/
    ├── src/
    │   ├── api.js           # Axios + JWT interceptor
    │   ├── App.jsx          # Router + protected routes
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── History.jsx
    │   └── components/
    │       ├── Navbar.jsx
    │       ├── RiskResultCard.jsx
    │       └── HistoryTable.jsx
    └── package.json
```
