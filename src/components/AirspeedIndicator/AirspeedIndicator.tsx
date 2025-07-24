import React from 'react';

interface AirspeedIndicatorProps {
  airspeed: number;
}

const AirspeedIndicator: React.FC<AirspeedIndicatorProps> = ({ airspeed }) => {
  const speeds = [140, 160, 180, 200, 220, 240, 260, 280, 300, 320];
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-24 h-48 relative overflow-hidden border-2 border-gray-600">
      <div className="absolute right-2 top-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-yellow-400 transform -translate-y-1/2"></div>
      <div 
        className="absolute right-8 transition-transform duration-300"
        style={{ transform: `translateY(${120 - (airspeed - 180) * 1.2}px)` }}
      >
        {speeds.map(speed => (
          <div key={speed} className="h-6 flex items-center text-xs font-mono">
            {speed}
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 right-12 bg-black px-2 py-1 border border-white text-yellow-400 font-bold text-sm transform -translate-y-1/2">
        {Math.round(airspeed)}
      </div>
    </div>
  );
};

export default AirspeedIndicator;