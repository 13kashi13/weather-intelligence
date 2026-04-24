from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os
import numpy as np
from sklearn.linear_model import LinearRegression
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

router = APIRouter()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

class LocationRequest(BaseModel):
    lat: float
    lon: float

@router.post("/5day")
def get_5day_forecast(req: LocationRequest):
    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={req.lat}&lon={req.lon}&appid={API_KEY}&units=metric"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()

        daily = {}
        for item in data["list"]:
            date = item["dt_txt"].split(" ")[0]
            if date not in daily:
                daily[date] = {
                    "temps": [], "humidity": [], "wind": [],
                    "pressure": [], "description": item["weather"][0]["description"],
                    "icon": item["weather"][0]["icon"]
                }
            daily[date]["temps"].append(item["main"]["temp"])
            daily[date]["humidity"].append(item["main"]["humidity"])
            daily[date]["wind"].append(item["wind"]["speed"])
            daily[date]["pressure"].append(item["main"]["pressure"])

        result = []
        for date, vals in daily.items():
            result.append({
                "date": date,
                "temp_max": round(max(vals["temps"]), 1),
                "temp_min": round(min(vals["temps"]), 1),
                "temp_avg": round(sum(vals["temps"]) / len(vals["temps"]), 1),
                "humidity": round(sum(vals["humidity"]) / len(vals["humidity"]), 1),
                "wind": round(sum(vals["wind"]) / len(vals["wind"]), 1),
                "pressure": round(sum(vals["pressure"]) / len(vals["pressure"]), 1),
                "description": vals["description"],
                "icon": vals["icon"],
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/predict")
def predict_temperature(req: LocationRequest):
    """Simple ML prediction using linear regression on 5-day forecast data."""
    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={req.lat}&lon={req.lon}&appid={API_KEY}&units=metric"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()

        temps = [item["main"]["temp"] for item in data["list"]]
        X = np.array(range(len(temps))).reshape(-1, 1)
        y = np.array(temps)

        model = LinearRegression()
        model.fit(X, y)

        # Predict next 3 days (24 more 3-hour intervals = 8 per day)
        future_X = np.array(range(len(temps), len(temps) + 24)).reshape(-1, 1)
        predictions = model.predict(future_X)

        daily_preds = []
        for i in range(3):
            chunk = predictions[i * 8:(i + 1) * 8]
            date = (datetime.now() + timedelta(days=i + 6)).strftime("%Y-%m-%d")
            daily_preds.append({
                "date": date,
                "predicted_temp": round(float(np.mean(chunk)), 1),
                "predicted_max": round(float(np.max(chunk)), 1),
                "predicted_min": round(float(np.min(chunk)), 1),
            })

        return {"predictions": daily_preds, "trend": round(float(model.coef_[0]), 4)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
