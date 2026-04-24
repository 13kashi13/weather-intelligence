import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";
import "./ForecastChart.css";

export default function ForecastChart({ forecast, predictions }) {
  const forecastData = (forecast || []).map(d => ({
    date: d.date.slice(5),
    max: d.temp_max,
    min: d.temp_min,
    humidity: d.humidity,
    wind: d.wind,
  }));

  const allData = [
    ...forecastData,
    ...(predictions?.predictions || []).map(p => ({
      date: p.date.slice(5) + " (pred)",
      max: p.predicted_max,
      min: p.predicted_min,
      predicted: true,
    })),
  ];

  return (
    <div className="forecast-chart">
      <h3>5-Day Forecast + ML Predictions</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={allData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
          <XAxis dataKey="date" tick={{ fill: "#4a5a7a", fontSize: 10 }} />
          <YAxis tick={{ fill: "#4a5a7a", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "#0d1526", border: "1px solid #1a2744", borderRadius: 8 }}
            labelStyle={{ color: "#8ab4f8" }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: "#4a5a7a" }} />
          <Bar dataKey="max" name="Max °C" fill="#f6a623" radius={[4, 4, 0, 0]} />
          <Bar dataKey="min" name="Min °C" fill="#4e9af1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <h3 style={{ marginTop: 20 }}>Humidity & Wind Trend</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={forecastData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
          <XAxis dataKey="date" tick={{ fill: "#4a5a7a", fontSize: 10 }} />
          <YAxis tick={{ fill: "#4a5a7a", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "#0d1526", border: "1px solid #1a2744", borderRadius: 8 }}
            labelStyle={{ color: "#8ab4f8" }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: "#4a5a7a" }} />
          <Line type="monotone" dataKey="humidity" name="Humidity %" stroke="#4ecdc4" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="wind" name="Wind m/s" stroke="#f6a623" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {predictions && (
        <div className="trend-badge">
          Temperature trend: {predictions.trend > 0 ? "📈 Rising" : "📉 Falling"} ({predictions.trend > 0 ? "+" : ""}{predictions.trend}°C/interval)
        </div>
      )}

      <div className="forecast-cards">
        {(forecast || []).map((d, i) => (
          <div key={i} className="forecast-card">
            <span className="fc-date">{d.date.slice(5)}</span>
            <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} alt={d.description} />
            <span className="fc-max">{d.temp_max}°</span>
            <span className="fc-min">{d.temp_min}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
