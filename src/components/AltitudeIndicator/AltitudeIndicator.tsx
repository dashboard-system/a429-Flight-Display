import React from 'react';

interface AltitudeIndicatorProps {
  altitude: number;
}

const AltitudeIndicator: React.FC<AltitudeIndicatorProps> = ({ altitude }) => {
  const altitudes = [34000, 34500, 35000, 35500, 36000, 36500, 37000];
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-24 h-48 relative overflow-hidden border-2 border-gray-600">
      <div className="absolute left-2 top-1/2 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-yellow-400 transform -translate-y-1/2"></div>
      <div 
        className="absolute left-8 transition-transform duration-300"
        style={{ transform: `translateY(${120 - (altitude - 35000) * 0.24}px)` }}
      >
        {altitudes.map(alt => (
          <div key={alt} className="h-6 flex items-center text-xs font-mono">
            {(alt / 1000).toFixed(0)}
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 left-12 bg-black px-2 py-1 border border-white text-cyan-400 font-bold text-sm transform -translate-y-1/2">
        {Math.round(altitude)}
      </div>
    </div>
  );
};

export default AltitudeIndicator;