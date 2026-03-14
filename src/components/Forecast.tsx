import React from 'react';
import { WeatherData } from '../types';
import { getWeatherInterpretation } from '../api';
import { 
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, 
  CloudSnow, Moon, Sun
} from 'lucide-react';
import { motion } from 'motion/react';

interface ForecastProps {
  data: WeatherData;
}

export function Forecast({ data }: ForecastProps) {
  const getWeatherIcon = (code: number, isDay: boolean, className: string = "") => {
    const type = getWeatherInterpretation(code, isDay).type;
    switch (type) {
      case 'clear': return isDay ? <Sun className={className} /> : <Moon className={className} />;
      case 'cloudy': return code === 45 || code === 48 ? <CloudFog className={className} /> : <Cloud className={className} />;
      case 'rain': return code >= 61 && code <= 65 ? <CloudRain className={className} /> : <CloudDrizzle className={className} />;
      case 'snow': return <CloudSnow className={className} />;
      case 'thunderstorm': return <CloudLightning className={className} />;
      default: return isDay ? <Sun className={className} /> : <Moon className={className} />;
    }
  };

  // Get next 24 hours
  const currentHourIndex = data.hourly.time.findIndex(t => new Date(t) > new Date());
  const hourlyData = data.hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, i) => ({
    time,
    temp: data.hourly.temperature_2m[currentHourIndex + i],
    code: data.hourly.weather_code[currentHourIndex + i],
    isDay: new Date(time).getHours() >= 6 && new Date(time).getHours() <= 18 // Rough approximation
  }));

  // Get next 7 days
  const dailyData = data.daily.time.slice(1, 8).map((time, i) => ({
    time,
    maxTemp: data.daily.temperature_2m_max[i + 1],
    minTemp: data.daily.temperature_2m_min[i + 1],
    code: data.daily.weather_code[i + 1],
  }));

  const formatHour = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: 'numeric' });
  };

  const formatDay = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], { weekday: 'short' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      
      {/* Hourly Forecast */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="lg:col-span-2 glass-panel rounded-3xl p-6"
      >
        <h3 className="text-sm uppercase tracking-widest text-white/60 font-semibold mb-6">Hourly Forecast</h3>
        <div className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {hourlyData.map((hour, i) => (
            <div key={i} className="flex flex-col items-center gap-3 min-w-[60px] snap-center">
              <span className="text-sm text-white/80 whitespace-nowrap">{i === 0 ? 'Now' : formatHour(hour.time)}</span>
              {getWeatherIcon(hour.code, hour.isDay, "w-6 h-6 text-white")}
              <span className="text-lg font-medium">{Math.round(hour.temp)}°</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Forecast */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="glass-panel rounded-3xl p-6"
      >
        <h3 className="text-sm uppercase tracking-widest text-white/60 font-semibold mb-6">7-Day Forecast</h3>
        <div className="flex flex-col gap-4">
          {dailyData.map((day, i) => (
            <div key={i} className="flex items-center justify-between border-b border-white/10 last:border-0 pb-4 last:pb-0">
              <span className="w-12 text-white/90 font-medium">{i === 0 ? 'Tmrw' : formatDay(day.time)}</span>
              <div className="flex items-center justify-center w-10">
                {getWeatherIcon(day.code, true, "w-5 h-5 text-white/80")}
              </div>
              <div className="flex items-center gap-3 w-24 justify-end">
                <span className="text-white/60 text-sm">{Math.round(day.minTemp)}°</span>
                <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                  <div 
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                    style={{ 
                      left: `${Math.max(0, (day.minTemp + 10) / 50 * 100)}%`, 
                      right: `${Math.max(0, 100 - ((day.maxTemp + 10) / 50 * 100))}%` 
                    }}
                  />
                </div>
                <span className="text-white font-medium text-sm">{Math.round(day.maxTemp)}°</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
