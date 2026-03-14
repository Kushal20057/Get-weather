import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { WeatherBackground } from './components/WeatherBackground';
import { Location, WeatherData } from './types';
import { getWeatherData, getWeatherInterpretation } from './api';
import { Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default to London if geolocation fails or is denied
  const defaultLocation: Location = {
    id: 2643743,
    name: "London",
    latitude: 51.5085,
    longitude: -0.1257,
    country: "United Kingdom"
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              // Reverse geocoding could be added here, but for now we just use coordinates
              // and a generic name, or we can just fetch weather.
              // To get the city name, we'd ideally call a reverse geocoding API.
              // For simplicity, we'll just set the coords and a generic name.
              setLocation({
                id: 0,
                name: "Current Location",
                latitude,
                longitude,
                country: ""
              });
            },
            () => {
              // Fallback to default
              setLocation(defaultLocation);
            }
          );
        } else {
          setLocation(defaultLocation);
        }
      } catch (e) {
        setLocation(defaultLocation);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      const data = await getWeatherData(location.latitude, location.longitude);
      if (data) {
        setWeatherData(data);
      } else {
        setError("Failed to fetch weather data. Please try again.");
      }
      setLoading(false);
    };

    fetchWeather();
  }, [location]);

  const handleLocationSelect = (newLocation: Location) => {
    setLocation(newLocation);
  };

  const bgType = weatherData 
    ? getWeatherInterpretation(weatherData.current.weather_code, weatherData.current.is_day === 1).type 
    : 'clear';
  
  const isDay = weatherData ? weatherData.current.is_day === 1 : true;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-white/30">
      <WeatherBackground type={bgType} isDay={isDay} />
      
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full flex justify-center mb-8 md:mb-12"
        >
          <SearchBar 
            onSelectLocation={handleLocationSelect} 
            currentLocationName={location?.name !== "Current Location" ? location?.name : undefined}
          />
        </motion.header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
              <p className="text-white/70 font-medium tracking-wide">Reading the atmosphere...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="glass-panel p-8 rounded-3xl text-center max-w-md">
                <p className="text-red-300 mb-4">{error}</p>
                <button 
                  onClick={() => setLocation(defaultLocation)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  Return to Default
                </button>
              </div>
            </motion.div>
          ) : weatherData && location ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <CurrentWeather data={weatherData} locationName={location.name} />
              <Forecast data={weatherData} />
            </motion.div>
          ) : null}
        </AnimatePresence>
        
        <footer className="mt-auto pt-12 pb-4 text-center text-white/40 text-sm font-medium">
          <p>Weather data provided by Open-Meteo</p>
        </footer>
      </main>
    </div>
  );
}
