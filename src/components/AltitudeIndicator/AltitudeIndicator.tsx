import React from 'react';
import VerticalTape from '../shared/VerticalTape';

interface AltitudeIndicatorProps {
  altitude: number;
}

const AltitudeIndicator: React.FC<AltitudeIndicatorProps> = ({ altitude }) => {
  // Generate altitude marks around current altitude
  const generateAltitudeMarks = (currentAltitude: number) => {
    const marks = [];
    const range = 5000; // Show 5000 feet above and below current altitude to fill the box
    const increment = 100; // 100 feet increments
    
    const startAltitude = Math.max(
      0,
      Math.floor((currentAltitude - range) / increment) * increment
    );
    const endAltitude = Math.ceil((currentAltitude + range) / increment) * increment;
    
    for (let alt = startAltitude; alt <= endAltitude; alt += increment) {
      marks.push(alt);
    }
    return marks;
  };

  const getAltitudeColor = (altitude: number) => {
    if (altitude < 1000) return 'text-red-400'; // Low altitude warning
    if (altitude >= 1000 && altitude <= 10000) return 'text-white'; // Low to medium altitude
    if (altitude > 10000 && altitude <= 40000) return 'text-green-400'; // Normal cruise altitude
    if (altitude > 40000) return 'text-yellow-400'; // High altitude
    return 'text-gray-400';
  };

  const isMajorTick = (altitude: number) => altitude % 500 === 0;

  const formatAltitude = (altitude: number) => {
    // Display full altitude values (e.g., 36000, 35500, 35000)
    return altitude.toString();
  };

  return (
    <VerticalTape
      value={altitude}
      title="ALTITUDE"
      unit="FT"
      unitTooltip="Feet above sea level"
      generateMarks={generateAltitudeMarks}
      getValueColor={getAltitudeColor}
      isMajorTick={isMajorTick}
      formatValue={formatAltitude}
      pixelsPerUnit={0.1} // 0.1 pixels per foot for appropriate scaling
      pointerSide="left"
    />
  );
};

export default AltitudeIndicator;