import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);  // State to toggle temperature unit
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    const apiKey = 'BikZ8ocSwCMLDgyA4YwrUjfAowjEV5MM'; // API key from Tomorrow.io
    const customUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`;

    try {
      const response = await axios.get(customUrl);
      const { temperature, windSpeed, humidity, rainIntensity, snowIntensity, cloudCover } = response.data.data.values;

      setWeather({
        temperature,
        windSpeed,
        humidity,
        rainIntensity,
        snowIntensity,
        cloudCover,
      });

      // Save the search in recent searches
      setRecentSearches(prevSearches => [
        { city, date: new Date() },
        ...prevSearches.slice(0, 4),  // Keep only 5 most recent searches
      ]);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent searches from the backend on initial load
  useEffect(() => {
    axios.get('http://localhost:5000/api/recent-searches')
      .then(response => setRecentSearches(response.data.searches))
      .catch(error => console.error('Error fetching recent searches:', error));
  }, []);

  // Handle search button click
  const handleSearch = () => {
    if (!city.trim()) return;
    fetchWeatherData(city);
  };

  // Toggle between Celsius and Fahrenheit
  const toggleTemperatureUnit = () => {
    setIsCelsius(prev => !prev);
  };

  // Convert temperature to Celsius or Fahrenheit
  const convertTemperature = (temp) => {
    if (isCelsius) {
      return Math.round(temp - 273.15);  // Convert to Celsius
    }
    return Math.round((temp - 273.15) * 9/5 + 32);  // Convert to Fahrenheit
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={handleSearch} disabled={loading}>Search</button>

      {loading && <p>Loading...</p>}

      {weather && (
        <div>
          <h2>Weather in {city}</h2>
          <p>Temperature: {convertTemperature(weather.temperature)}°{isCelsius ? 'C' : 'F'}</p>
          <p>Wind Speed: {weather.windSpeed} km/h</p>
          <p>Humidity: {weather.humidity} %</p>
          <p>Rain Intensity: {weather.rainIntensity > 0 ? `${weather.rainIntensity} mm` : 'No rain'}</p>
          <p>Snow Intensity: {weather.snowIntensity > 0 ? `${weather.snowIntensity} inch` : 'No snow'}</p>
          <p>Cloud Cover: {weather.cloudCover}%</p>
          <button onClick={toggleTemperatureUnit}>
            Switch to {isCelsius ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>
      )}

      <h3>Recent Searches</h3>
      <ul>
        {recentSearches.map((search, index) => (
          <li key={index}>
            {search.city} - {new Date(search.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherApp;
