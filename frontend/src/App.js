import React, { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import WeatherDashboard from "./components/WeatherDashboard";
import SearchBar from "./components/SearchBar";
import "leaflet/dist/leaflet.css";
import "./App.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API = "http://localhost:8000";

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 10, { duration: 1.2 });
  }, [position, map]);
  return null;
}

export default function App() {
  const [markerPos, setMarkerPos] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [precautions, setPrecautions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const fetchWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setShowDashboard(false);
    try {
      const [curr, forecast, predict] = await Promise.all([
        axios.post(`${API}/weather/current`, { lat, lon }),
        axios.post(`${API}/forecast/5day`, { lat, lon }),
        axios.post(`${API}/forecast/predict`, { lat, lon }),
      ]);
      setWeatherData(curr.data);
      setForecastData(forecast.data);
      setPredictionData(predict.data);

      const prec = await axios.post(`${API}/precautions/`, {
        temp: curr.data.temp,
        humidity: curr.data.humidity,
        wind_speed: curr.data.wind_speed,
        pressure: curr.data.pressure,
        description: curr.data.description,
        location: curr.data.location,
      });
      setPrecautions(prec.data);
      setShowDashboard(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMapClick = useCallback((lat, lon) => {
    setMarkerPos([lat, lon]);
    fetchWeather(lat, lon);
  }, [fetchWeather]);

  const handleSearch = useCallback(({ lat, lon }) => {
    setMarkerPos([lat, lon]);
    fetchWeather(lat, lon);
  }, [fetchWeather]);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} />

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Fetching weather data...</p>
        </div>
      )}

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ width: "100%", height: "100vh" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapClickHandler onMapClick={handleMapClick} />
        {markerPos && (
          <>
            <FlyTo position={markerPos} />
            <Marker position={markerPos} />
          </>
        )}
      </MapContainer>

      {showDashboard && weatherData && (
        <WeatherDashboard
          weather={weatherData}
          forecast={forecastData}
          predictions={predictionData}
          precautions={precautions}
          onClose={() => setShowDashboard(false)}
        />
      )}
    </div>
  );
}
