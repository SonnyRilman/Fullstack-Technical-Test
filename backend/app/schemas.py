from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional


# Authentication
class UserLogin(BaseModel):
    username: str = Field(..., description="The user's account name", example="admin")
    password: str = Field(..., description="The user's account password", example="admin123")


class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token used for Authorization header")
    token_type: str = Field(..., description="Type of the token, usually 'bearer'")


# Sales Data
class SalesItem(BaseModel):
    product_id: str = Field(..., description="Unique product identifier from dataset")
    product_name: str = Field(..., description="Name of the product")
    jumlah_penjualan: int = Field(..., description="Number of units sold")
    harga: float = Field(..., description="Selling price per unit in IDR")
    diskon: int = Field(..., description="Discount percentage applied (0-100)")
    status: str = Field(..., description="Product status: 'Laris' or 'Tidak'")


class SalesStats(BaseModel):
    total_products: int = Field(..., description="Total count of products in dataset")
    laris: int = Field(..., description="Count of products classified as 'Laris'")
    tidak: int = Field(..., description="Count of products classified as 'Tidak'")
    laris_pct: float = Field(..., description="Percentage of products classified as 'Laris'")
    tidak_pct: float = Field(..., description="Percentage of products classified as 'Tidak'")
    total_revenue: float = Field(..., description="Estimated total revenue from all sales")
    avg_jumlah_penjualan: float = Field(..., description="Average units sold per product")
    avg_harga: float = Field(..., description="Average unit price in dataset")
    avg_diskon: float = Field(..., description="Average discount percentage applied")


# Machine Learning
class PredictRequest(BaseModel):
    jumlah_penjualan: float = Field(..., description="Estimated units to be sold", ge=0, example=150)
    harga: float = Field(..., description="Unit price in IDR", gt=0, example=75000)
    diskon: float = Field(..., description="Applied discount percentage", ge=0, le=100, example=10)


class PredictResponse(BaseModel):
    status_prediksi: str = Field(..., description="Predicted status: 'Laris' or 'Tidak'")
    confidence: float = Field(..., description="Prediction confidence score (0-1)")
    probability_laris: float = Field(..., description="Probability of being 'Laris'")
    probability_tidak: float = Field(..., description="Probability of being 'Tidak'")
    input_data: PredictRequest = Field(..., description="Reflected input data used for prediction")
