from fastapi import APIRouter
from pydantic import BaseModel
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class WeatherData(BaseModel):
    temp: float
    humidity: float
    wind_speed: float
    pressure: float
    description: str
    location: str

def rule_based_precautions(data: WeatherData) -> dict:
    """Fallback rule-based precautions if Gemini fails."""
    farmers, business, residents, river, heat = [], [], [], [], []

    if data.humidity > 80:
        farmers.append("High humidity — risk of fungal diseases. Apply fungicide.")
        farmers.append("Avoid irrigation; soil is already moist.")
    if data.wind_speed > 10:
        farmers.append("Strong winds — secure crops and greenhouses.")
        business.append("Delay outdoor deliveries and logistics.")
    if data.temp > 38:
        farmers.append("Extreme heat — irrigate crops early morning or evening.")
        residents.append("Stay hydrated. Avoid outdoor activity between 11am–4pm.")
        heat.append("Heat alert: keep elderly and children indoors.")
    if data.temp < 10:
        farmers.append("Cold weather — protect sensitive crops with covers.")
        residents.append("Wear warm clothing. Risk of hypothermia for elderly.")
    if "rain" in data.description or "storm" in data.description:
        farmers.append("Rain expected — delay pesticide application.")
        business.append("Waterproof inventory and check drainage systems.")
        river.append("River levels may rise. Avoid riverside activities.")
    if data.pressure < 1000:
        residents.append("Low pressure — storm likely. Stay indoors if possible.")
        river.append("Possible flooding. Move valuables to higher ground.")

    return {
        "farmers": farmers or ["Weather conditions are normal for farming."],
        "business": business or ["No major weather disruptions expected for business."],
        "residents": residents or ["Normal conditions. Stay weather-aware."],
        "riverside": river or ["River conditions appear stable."],
        "heat_alert": heat or [],
    }

@router.post("/")
def get_precautions(data: WeatherData):
    prompt = f"""
You are a weather advisory expert. Given the following weather data for {data.location}:
- Temperature: {data.temp}°C
- Humidity: {data.humidity}%
- Wind Speed: {data.wind_speed} m/s
- Pressure: {data.pressure} hPa
- Conditions: {data.description}

Provide specific, practical precautions for:
1. Farmers (crop protection, irrigation, harvesting)
2. Businessmen (logistics, outdoor operations, supply chain)
3. General residents (health, travel, daily activities)
4. People living near rivers (flood risk, water levels)
5. People in hot/extreme weather zones (heat safety)

Format your response as JSON with keys: farmers, business, residents, riverside, heat_alert.
Each key should have an array of 2-3 concise bullet point strings.
Return ONLY valid JSON, no markdown.
"""
    try:
        response = _client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
        )
        import json
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception:
        return rule_based_precautions(data)
