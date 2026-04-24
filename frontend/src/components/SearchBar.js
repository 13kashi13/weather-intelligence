import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (q) => {
    if (q.length < 3) return setSuggestions([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    setValue(place.display_name);
    setSuggestions([]);
    onSearch({ lat: parseFloat(place.lat), lon: parseFloat(place.lon) });
  };

  return (
    <div className="search-bar">
      <div className="search-input-row">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search any city or location..."
          value={value}
          onChange={(e) => { setValue(e.target.value); fetchSuggestions(e.target.value); }}
        />
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((s) => (
            <div key={s.place_id} className="suggestion-item" onClick={() => handleSelect(s)}>
              {s.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
