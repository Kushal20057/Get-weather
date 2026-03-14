import React from 'react';
import { WeatherData } from '../types';
import { getWeatherInterpretation } from '../api';
import { 
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, 
  CloudSnow, Droplets, Moon, Sun, Wind, Thermometer,
  Sunrise, Sunset
} from 'lucide-react';
import { motion } from 'motion/react';

interface CurrentWeatherProps {
  data: WeatherData;
  locationName: string;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const current = data.current;
  const isDay = current.is_day === 1;
  const interpretation = getWeatherInterpretation(current.weather_code, isDay);
  
  const getWeatherIcon = (code: number, isDay: boolean, className: string = "") => {
    const type = getWeatherInterpretation(code, isDay).type;
    
    switch (type) {
      case 'clear':
        return isDay ? <Sun className={className} /> : <Moon className={className} />;
      case 'cloudy':
        return code === 45 || code === 48 ? <CloudFog className={className} /> : <Cloud className={className} />;
      case 'rain':
        return code >= 61 && code <= 65 ? <CloudRain className={className} /> : <CloudDrizzle className={className} />;
      case 'snow':
        return <CloudSnow className={className} />;
      case 'thunderstorm':
        return <CloudLightning className={className} />;
      default:
        return isDay ? <Sun className={className} /> : <Moon className={className} />;
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col items-center justify-center py-12"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-2xl md:text-3xl font-medium text-white/90 tracking-wide mb-2"
      >
        {locationName}
      </motion.h2>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center justify-center gap-4 my-4">
          {getWeatherIcon(current.weather_code, isDay, "w-16 h-16 md:w-20 md:h-20 text-white animate-float")}
          <h1 className="text-8xl md:text-9xl font-display font-light tracking-tighter text-white">
            {Math.round(current.temperature_2m)}°
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl font-medium text-white/90 capitalize tracking-wide">
          {interpretation.label}
        </p>
        
        <div className="flex items-center gap-4 mt-2 text-white/70 font-medium">
          <span>H: {Math.round(data.daily.temperature_2m_max[0])}°</span>
          <span>L: {Math.round(data.daily.temperature_2m_min[0])}°</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-12"
      >
        <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
          <Wind className="w-6 h-6 text-white/60" />
          <span className="text-sm text-white/60 uppercase tracking-wider font-semibold">Wind</span>
          <span className="text-xl font-medium">{current.wind_speed_10m} km/h</span>
        </div>
        
        <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
          <Droplets className="w-6 h-6 text-white/60" />
          <span className="text-sm text-white/60 uppercase tracking-wider font-semibold">Humidity</span>
          <span className="text-xl font-medium">{current.relative_humidity_2m}%</span>
        </div>
        
        <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
          <Thermometer className="w-6 h-6 text-white/60" />
          <span className="text-sm text-white/60 uppercase tracking-wider font-semibold">Feels Like</span>
          <span className="text-xl font-medium">{Math.round(current.apparent_temperature)}°</span>
        </div>
        
        <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
          {isDay ? <Sunset className="w-6 h-6 text-white/60" /> : <Sunrise className="w-6 h-6 text-white/60" />}
          <span className="text-sm text-white/60 uppercase tracking-wider font-semibold">
            {isDay ? 'Sunset' : 'Sunrise'}
          </span>
          <span className="text-xl font-medium">
            {formatTime(isDay ? data.daily.sunset[0] : data.daily.sunrise[1])}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
