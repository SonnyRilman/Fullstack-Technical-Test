import os
import pandas as pd
import joblib
import numpy as np
from functools import lru_cache
from app.config import settings

def _resolve_path(relative_path: str) -> str:
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.normpath(os.path.join(base, relative_path))

@lru_cache(maxsize=1)
def load_sales_data() -> pd.DataFrame:
    path = _resolve_path(settings.DATA_PATH)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at {path}")
    return pd.read_csv(path)

@lru_cache(maxsize=1)
def load_model():
    path = _resolve_path(settings.MODEL_PATH)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model not found at {path}")
    return joblib.load(path)

def predict_status(jumlah_penjualan: float, harga: float, diskon: float) -> dict:
    model = load_model()
    features = np.array([[jumlah_penjualan, harga, diskon]], dtype=float)
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    classes = list(model.classes_)
    laris_idx = classes.index("Laris") if "Laris" in classes else 0
    tidak_idx = classes.index("Tidak") if "Tidak" in classes else 1

    prob_laris = float(probabilities[laris_idx])
    prob_tidak = float(probabilities[tidak_idx])
    confidence = max(prob_laris, prob_tidak)

    return {
        "status_prediksi": str(prediction),
        "confidence": round(confidence, 4),
        "probability_laris": round(prob_laris, 4),
        "probability_tidak": round(prob_tidak, 4),
    }

