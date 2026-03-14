import React from 'react';
import { motion } from 'motion/react';

interface WeatherBackgroundProps {
  type: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm';
  isDay: boolean;
}

export function WeatherBackground({ type, isDay }: WeatherBackgroundProps) {
  const getGradients = () => {
    if (isDay) {
      switch (type) {
        case 'clear':
          return 'from-[#4CA1AF] to-[#2C3E50]'; // Bright blue to deep blue
        case 'cloudy':
          return 'from-[#757F9A] to-[#D7DDE8]'; // Grayish blue
        case 'rain':
          return 'from-[#3a7bd5] to-[#3a6073]'; // Darker blue/gray
        case 'snow':
          return 'from-[#E0EAFC] to-[#CFDEF3]'; // Very light blue/white
        case 'thunderstorm':
          return 'from-[#141E30] to-[#243B55]'; // Dark moody
        default:
          return 'from-[#4CA1AF] to-[#2C3E50]';
      }
    } else {
      switch (type) {
        case 'clear':
          return 'from-[#0f2027] via-[#203a43] to-[#2c5364]'; // Deep night sky
        case 'cloudy':
          return 'from-[#1e130c] to-[#9a8478]'; // Dark brownish gray
        case 'rain':
          return 'from-[#000000] to-[#434343]'; // Very dark
        case 'snow':
          return 'from-[#232526] to-[#414345]'; // Dark gray
        case 'thunderstorm':
          return 'from-[#000000] via-[#0f0f0f] to-[#1a1a1a]'; // Pitch black
        default:
          return 'from-[#0f2027] via-[#203a43] to-[#2c5364]';
      }
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${getGradients()} transition-colors duration-1000`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Atmospheric Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px] mix-blend-overlay animate-float" style={{ animationDuration: '15s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-black/20 blur-[150px] mix-blend-overlay animate-float" style={{ animationDuration: '20s', animationDelay: '-5s' }} />
      
      {/* Weather specific overlays */}
      {type === 'clear' && isDay && (
        <div className="absolute top-[10%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-yellow-300/20 blur-[100px] mix-blend-screen" />
      )}
      
      {type === 'rain' && (
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] bg-repeat animate-[rain_0.5s_linear_infinite]" style={{ backgroundSize: '20px 100px' }} />
      )}
      
      {type === 'snow' && (
        <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIyIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=')] bg-repeat animate-[snow_3s_linear_infinite]" style={{ backgroundSize: '50px 50px' }} />
      )}

      {/* Noise Texture for that premium feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}

// Add these to global CSS or inject here
const style = document.createElement('style');
style.textContent = `
  @keyframes rain {
    0% { background-position: 0 0; }
    100% { background-position: 10px 100px; }
  }
  @keyframes snow {
    0% { background-position: 0 0; }
    100% { background-position: 20px 50px; }
  }
`;
document.head.appendChild(style);
