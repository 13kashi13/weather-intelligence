from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import weather, forecast, precautions

app = FastAPI(title="Weather Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router, prefix="/weather")
app.include_router(forecast.router, prefix="/forecast")
app.include_router(precautions.router, prefix="/precautions")
