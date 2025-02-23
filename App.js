import React from 'react';
import './App.css';
import WeatherApp from './WeatherApp';  // Import the WeatherApp component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Weather App</h1>
      </header>
      <main>
        <WeatherApp /> {/* Add WeatherApp component here */}
      </main>
    </div>
  );
}

export default App;
