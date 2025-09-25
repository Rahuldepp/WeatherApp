import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function App() {
  const [query, setQuery] = useState("Delhi, IN");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeather("Delhi, IN"); // default
  }, []);

  async function fetchWeather(q) {
    setLoading(true);
    setError("");
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
        q
      )}&days=3&aqi=no&alerts=no`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data.current ? { ...data.current, location: data.location } : null);
      setForecast(data.forecast ? data.forecast.forecastday : []);
    } catch (err) {
      setError("❌ City not found or API error");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (query) fetchWeather(query);
  }

  return (
    <div className="app">
      <h1>🌤️ Weather App</h1>

      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city (e.g. Delhi, IN)"
        />
        <button type="submit">🔍</button>
      </form>

      <div className="card">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && !loading && (
          <div>
            <h2>
              {weather.location.name}, {weather.location.country}
            </h2>
            <img src={`https:${weather.condition.icon}`} alt={weather.condition.text} />
            <p className="temp">{Math.round(weather.temp_c)}°C</p>
            <p>{weather.condition.text}</p>
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>🌬️ Wind: {weather.wind_kph} kph</p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecast">
            {forecast.map((day) => (
              <div key={day.date} className="forecast-day">
                <p>{new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}</p>
                <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} />
                <p>{Math.round(day.day.avgtemp_c)}°C</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer>Powered by Vishal</footer>
    </div>
  );
}

export default App;
