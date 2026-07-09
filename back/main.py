from functools import lru_cache

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

MODEL_DIR = "models"


class PredictionRequest(BaseModel):
    DAYS_EMPLOYED: float
    YEARS_BIRTH: float
    BUREAU_TOTAL_DEBT: float
    AMT_GOODS_PRICE: float
    NAME_EDUCATION_TYPE: str
    DAYS_LAST_PHONE_CHANGE: float
    DAYS_ID_PUBLISH: float


@lru_cache(maxsize=1)
def load_artifacts() -> tuple:
    full_pipeline = joblib.load(f'{MODEL_DIR}/full_pipeline.joblib')
    decision_threshold = joblib.load(f"{MODEL_DIR}/decision_threshold.joblib")
    dt_model = joblib.load(f"{MODEL_DIR}/dt_model.joblib")
    return full_pipeline, decision_threshold, dt_model


app = FastAPI(title="Loan Approval API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/predict")
def predict(payload: PredictionRequest) -> dict:
    try:
        full_pipeline, decision_threshold, dt_model = load_artifacts()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=f"Model file missing: {exc}") from exc

    input_df = pd.DataFrame([payload.model_dump()])
    processed_data = full_pipeline.transform(input_df)
    probability = float(dt_model.predict_proba(processed_data)[0][1])

    threshold = float(decision_threshold[0]) if hasattr(decision_threshold, "__getitem__") else float(decision_threshold)
    decision = "APPROVE" if probability < threshold else "DENY"

    return {"status": decision, "probability": probability}
