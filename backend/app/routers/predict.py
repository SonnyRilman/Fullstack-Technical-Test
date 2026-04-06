from fastapi import APIRouter, Depends, HTTPException
from app.schemas import PredictRequest, PredictResponse
from app.dependencies import get_current_user
from app.services import predict_status

router = APIRouter(prefix="/predict", tags=["ML Prediction"])

@router.post("", response_model=PredictResponse)
def predict(request: PredictRequest, current_user: dict = Depends(get_current_user)):
    try:
        result = predict_status(
            jumlah_penjualan=request.jumlah_penjualan,
            harga=request.harga,
            diskon=request.diskon,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return PredictResponse(**result, input_data=request)
