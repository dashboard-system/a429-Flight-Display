import React from "react";
import VerticalTape from '../shared/VerticalTape';

interface AirspeedIndicatorProps {
  airspeed: number;
}

const AirspeedIndicator: React.FC<AirspeedIndicatorProps> = ({ airspeed }) => {
  // Generate speed marks around current airspeed
  const generateSpeedMarks = (currentSpeed: number) => {
    const marks = [];
    const range = 100; // Show 100 knots above and below current speed
    const increment = 10; // 10 knot increments for more marks

    const startSpeed = Math.max(
      0,
      Math.floor((currentSpeed - range) / increment) * increment
    );
    const endSpeed = Math.ceil((currentSpeed + range) / increment) * increment;

    for (let speed = startSpeed; speed <= endSpeed; speed += increment) {
      marks.push(speed);
    }
    return marks;
  };

  const getSpeedColor = (speed: number) => {
    if (speed >= 40 && speed <= 100) return "text-white"; // White arc (normal operations)
    if (speed >= 100 && speed <= 180) return "text-green-400"; // Green arc (normal operations)
    if (speed >= 180 && speed <= 220) return "text-yellow-400"; // Caution range
    if (speed > 220) return "text-red-400"; // Never exceed
    return "text-gray-400";
  };

  const isMajorTick = (speed: number) => speed % 20 === 0;

  return (
    <VerticalTape
      value={airspeed}
      title="AIRSPEED"
      unit="KTS"
      unitTooltip="Knots (nautical mph)"
      generateMarks={generateSpeedMarks}
      getValueColor={getSpeedColor}
      isMajorTick={isMajorTick}
      pixelsPerUnit={2} // 2 pixels per knot for appropriate scaling
      pointerSide="right"
    />
  );
};

export default AirspeedIndicator;
