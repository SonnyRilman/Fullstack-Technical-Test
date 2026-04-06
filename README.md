# Mini Machine Learning Sales Prediction System

Sistem prediksi penjualan berbasis Machine Learning untuk mengklasifikasikan produk sebagai **Laris** atau **Tidak Laris**.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐     HTTP/REST      ┌────────────────────┐
│  React Frontend │ ←────────────────→ │  FastAPI Backend   │
│  (TypeScript)   │   JWT Bearer Auth  │  (Python 3.14)     │
│  Vite + Recharts│                    │                    │
│  ML Dashboard   │                    └────────┬───────────┘
└─────────────────┘                             │
                                  ┌─────────────┴─────────────┐
                                  │                           │
                        ┌─────────▼──────────┐      ┌─────────▼─────────┐
                        │   ML Model         │      │   CSV Dataset      │
                        │  (Random Forest)   │      │  data/sales_data.csv│
                        │  ml/model/*.joblib │      │  5000 produk        │
                        └────────────────────┘      └────────────────────┘
```

**Alur Data:**
1. User login → Backend validasi kredensial → Kembalikan JWT Token
2. Frontend menyimpan token di localStorage, attach ke semua request
3. `GET /sales` → Backend baca CSV → Kembalikan data JSON ke frontend
4. `POST /predict` → Backend load model joblib → Prediksi dengan Random Forest → Return hasil

---

## 🚀 Cara Menjalankan

### 1. Prasyarat
- Python 3.10+
- Node.js 18+
- pip & npm

### 2. Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

### 3. Training Model ML (wajib sebelum backend)

```bash
# Dari root project
python ml/train.py
```

Output: `ml/model/sales_model.joblib` + `ml/model/evaluation.json`

### 4. Jalankan Backend

```bash
cd backend
python run.py
```

Backend berjalan di: `http://localhost:8000`  
Swagger UI: `http://localhost:8000/docs`

### 5. Setup & Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di: `http://localhost:5174` (atau port berikutnya jika 5173 terpakai)

### 6. Login

| Username | Password  |
|----------|-----------|
| `admin`  | `admin123`|

---

## 📁 Struktur Project

```
project-root/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app & CORS
│   │   ├── auth.py          # JWT auth & dummy users
│   │   ├── config.py        # Settings (pydantic-settings)
│   │   ├── dependencies.py  # Dependency injection (get_current_user)
│   │   ├── schemas.py       # Pydantic request/response models
│   │   ├── services.py      # Business logic: load data, predict
│   │   └── routers/
│   │       ├── auth.py      # POST /auth/login
│   │       ├── sales.py     # GET /sales, GET /sales/stats
│   │       └── predict.py   # POST /predict
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   └── src/
│       ├── api/index.ts         # Axios client + interceptors
│       ├── context/AuthContext  # React context for auth state
│       ├── types/index.ts       # TypeScript interfaces
│       ├── pages/
│       │   ├── LoginPage.tsx    # Split-panel login UI
│       │   └── DashboardPage.tsx# Main dashboard
│       └── components/
│           ├── Sidebar.tsx      # Fixed sidebar navigation
│           ├── StatsCards.tsx   # KPI cards
│           ├── SalesCharts.tsx  # Donut + Bar charts
│           ├── SalesTable.tsx   # Paginated data table
│           └── PredictForm.tsx  # ML prediction form + result
│
├── ml/
│   ├── train.py             # Training pipeline (RF, LR, DT)
│   └── model/
│       ├── sales_model.joblib   # Saved model
│       └── evaluation.json      # Accuracy metrics
│
├── data/
│   └── sales_data.csv       # Dataset (5000 produk)
│
└── README.md
```

---

## 🤖 Machine Learning

### Problem
Binary Classification: **Laris** / **Tidak Laris**

### Features (Input)
| Fitur             | Deskripsi               |
|-------------------|-------------------------|
| jumlah_penjualan  | Jumlah unit terjual     |
| harga             | Harga satuan (IDR)      |
| diskon            | Persentase diskon (0–30)|

### Model yang Diuji
| Model               | Hasil        |
|---------------------|--------------|
| Random Forest       | ✅ **Terbaik** |
| Logistic Regression | Pembanding   |
| Decision Tree       | Pembanding   |

### Evaluasi
- Accuracy, AUC-ROC, Classification Report (precision/recall/f1)
- 5-fold Cross Validation (manual implementation)
- Lihat `ml/model/evaluation.json` untuk detail lengkap

---

## 🔌 API Endpoints

| Method | Endpoint       | Auth | Deskripsi                   |
|--------|---------------|------|-----------------------------|
| POST   | /auth/login   | ❌    | Login, return JWT token     |
| GET    | /sales        | ✅    | List data penjualan (paginated) |
| GET    | /sales/stats  | ✅    | Statistik agregat dataset   |
| POST   | /predict      | ✅    | Prediksi status produk      |
| GET    | /docs         | ❌    | Swagger UI dokumentasi      |

---

## 💡 Design Decisions

1. **FastAPI** dipilih karena async-native, auto Swagger docs, dan type-safe dengan Pydantic
2. **JWT sederhana** dengan python-jose — dummy user hardcoded (sesuai spesifikasi)
3. **SHA-256** digunakan untuk hashing password (passlib/bcrypt tidak kompatibel Python 3.14)
4. **Random Forest** dipilih sebagai model final — tidak perlu scaling, robust terhadap outlier
5. **`lru_cache`** digunakan agar model & data CSV hanya dimuat sekali ke memori
6. **Vite + React TypeScript** untuk strong typing di seluruh API contract
7. **Axios interceptors** menangani JWT injection dan redirect 401 otomatis

## ⚠️ Asumsi

- Dataset CSV bersifat statis (tidak ada operasi tulis/update)
- Kolom `diskon` bernilai antara 0–30 (sesuai dataset)
- Satu dummy user: `admin / admin123` (sesuai spesifikasi)
- Model di-training ulang hanya jika `ml/train.py` dijalankan ulang
- Python versi 3.14 menyebabkan beberapa inkompatibilitas library (sklearn stratify, bcrypt) — telah di-workaround
