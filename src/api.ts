import { Location, WeatherData } from './types';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
      timezone: 'auto'
    });
    
    const response = await fetch(`${WEATHER_API}?${params.toString()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
export function getWeatherInterpretation(code: number, isDay: boolean = true): { label: string, type: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm' } {
  switch (code) {
    case 0:
      return { label: 'Clear sky', type: 'clear' };
    case 1:
    case 2:
    case 3:
      return { label: code === 1 ? 'Mainly clear' : code === 2 ? 'Partly cloudy' : 'Overcast', type: 'cloudy' };
    case 45:
    case 48:
      return { label: 'Fog', type: 'cloudy' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', type: 'rain' };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', type: 'rain' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rain', type: 'rain' };
    case 66:
    case 67:
      return { label: 'Freezing Rain', type: 'rain' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snow fall', type: 'snow' };
    case 77:
      return { label: 'Snow grains', type: 'snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain showers', type: 'rain' };
    case 85:
    case 86:
      return { label: 'Snow showers', type: 'snow' };
    case 95:
      return { label: 'Thunderstorm', type: 'thunderstorm' };
    case 96:
    case 99:
      return { label: 'Thunderstorm with hail', type: 'thunderstorm' };
    default:
      return { label: 'Unknown', type: 'clear' };
  }
}
