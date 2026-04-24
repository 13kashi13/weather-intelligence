import React, { useState } from "react";
import { GiFarmer } from "react-icons/gi";
import { FiBriefcase, FiUsers, FiDroplet, FiThermometer } from "react-icons/fi";
import "./PrecautionCards.css";

const CATEGORIES = [
  { key: "farmers", label: "Farmers", icon: <GiFarmer />, color: "#4ecdc4" },
  { key: "business", label: "Business", icon: <FiBriefcase />, color: "#f6a623" },
  { key: "residents", label: "Residents", icon: <FiUsers />, color: "#4e9af1" },
  { key: "riverside", label: "Riverside", icon: <FiDroplet />, color: "#a78bfa" },
  { key: "heat_alert", label: "Heat Alert", icon: <FiThermometer />, color: "#e05c5c" },
];

export default function PrecautionCards({ precautions, weather }) {
  const [active, setActive] = useState("farmers");

  if (!precautions) return <p style={{ color: "#4a5a7a" }}>Loading precautions...</p>;

  const current = CATEGORIES.find(c => c.key === active);
  const items = precautions[active] || [];

  return (
    <div className="precaution-cards">
      <div className="weather-summary-bar">
        <span>🌡️ {Math.round(weather.temp)}°C</span>
        <span>💧 {weather.humidity}%</span>
        <span>💨 {weather.wind_speed} m/s</span>
        <span>📊 {weather.pressure} hPa</span>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={active === cat.key ? "active" : ""}
            style={active === cat.key ? { borderColor: cat.color, color: cat.color } : {}}
            onClick={() => setActive(cat.key)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="precaution-list">
        <div className="prec-header" style={{ color: current.color }}>
          <span className="prec-icon">{current.icon}</span>
          <span>{current.label} Advisory</span>
        </div>
        {items.length === 0 ? (
          <p className="no-alert">No alerts for this category.</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="prec-item" style={{ borderLeftColor: current.color }}>
              <span className="prec-num">{i + 1}</span>
              <p>{item}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
