from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, sales, predict
from app.services import load_model, load_sales_data
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mini Machine Learning Sales Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    try:
        logger.info("Starting application...")
        load_sales_data()
        load_model()
        logger.info("Application ready.")
    except Exception as e:
        logger.error(f"Startup failed: {e}")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Maaf terjadi kesalahan pada server."},
    )

app.include_router(auth.router)
app.include_router(sales.router)
app.include_router(predict.router)

@app.get("/")
def root():
    return {"status": "ok"}
