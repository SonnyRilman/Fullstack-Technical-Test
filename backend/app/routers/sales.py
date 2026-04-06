from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.schemas import SalesItem, SalesStats
from app.dependencies import get_current_user
from app.services import load_sales_data

router = APIRouter(prefix="/sales", tags=["Sales Data"])

@router.get("", response_model=List[SalesItem])
def get_sales(
    status: Optional[str] = Query(None),
    limit: int = Query(100),
    offset: int = Query(0),
    current_user: dict = Depends(get_current_user),
):
    try:
        df = load_sales_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if status:
        df = df[df["status"] == status]

    df = df.iloc[offset: offset + limit]
    return df.to_dict(orient="records")

@router.get("/stats", response_model=SalesStats)
def get_stats(current_user: dict = Depends(get_current_user)):
    try:
        df = load_sales_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    total = len(df)
    laris_count = int((df["status"] == "Laris").sum())
    tidak_count = int((df["status"] == "Tidak").sum())

    return {
        "total_products": total,
        "laris": laris_count,
        "tidak": tidak_count,
        "laris_pct": round(laris_count / total * 100, 2),
        "tidak_pct": round(tidak_count / total * 100, 2),
        "avg_jumlah_penjualan": round(float(df["jumlah_penjualan"].mean()), 2),
        "avg_harga": round(float(df["harga"].mean()), 2),
        "avg_diskon": round(float(df["diskon"].mean()), 2),
        "total_revenue": round(float((df["jumlah_penjualan"] * df["harga"] * (1 - df["diskon"] / 100)).sum()), 2),
    }
