# home-credit-risk-app

Loan approval web app with a React frontend and FastAPI backend.

## Run with Docker

From the repository root, run:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Prediction endpoint: `POST /predict` (reachable through frontend at `/api/predict`)

## Backend model files

Place these model artifacts in `/back/models/` before predicting:

- `preprocessor.joblib`
- `scaler.joblib`
- `decision_threshold.joblib`
- `dt_model.joblib`
