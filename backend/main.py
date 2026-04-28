from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import weather, forecast, precautions, chat, auth, report

app = FastAPI(title="Weather Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://forensicsai.onrender.com",
        "https://*.vercel.app",
        "https://*.netlify.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(weather.router, prefix="/weather")
app.include_router(forecast.router, prefix="/forecast")
app.include_router(precautions.router, prefix="/precautions")
app.include_router(chat.router, prefix="/chat")
app.include_router(auth.router, prefix="/auth")
app.include_router(report.router, prefix="/report")
