import React, { useState } from "react";
import CurrentWeather from "./CurrentWeather";
import ForecastChart from "./ForecastChart";
import PrecautionCards from "./PrecautionCards";
import StatsCharts from "./StatsCharts";
import { FiX, FiCloud, FiBarChart2, FiShield, FiTrendingUp } from "react-icons/fi";
import "./WeatherDashboard.css";

const TABS = [
  { id: "current", label: "Current", icon: <FiCloud /> },
  { id: "forecast", label: "Forecast", icon: <FiBarChart2 /> },
  { id: "stats", label: "Stats", icon: <FiTrendingUp /> },
  { id: "precautions", label: "Precautions", icon: <FiShield /> },
];

export default function WeatherDashboard({ weather, forecast, predictions, precautions, onClose }) {
  const [tab, setTab] = useState("current");

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="location-title">
          <span className="loc-name">{weather.location}, {weather.country}</span>
          <span className="loc-desc">{weather.description}</span>
        </div>
        <button className="close-btn" onClick={onClose}><FiX /></button>
      </div>

      <div className="dashboard-tabs">
        {TABS.map(t => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="dashboard-body">
        {tab === "current" && <CurrentWeather weather={weather} />}
        {tab === "forecast" && <ForecastChart forecast={forecast} predictions={predictions} />}
        {tab === "stats" && <StatsCharts weather={weather} forecast={forecast} />}
        {tab === "precautions" && <PrecautionCards precautions={precautions} weather={weather} />}
      </div>
    </div>
  );
}
