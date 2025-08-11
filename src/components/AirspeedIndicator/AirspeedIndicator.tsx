import React from "react";
import VerticalTape from '../shared/VerticalTape';
import { AirspeedIndicatorProps, SpeedColorRange, AirspeedIndicatorOptions } from '../../types';

const AirspeedIndicator: React.FC<AirspeedIndicatorProps> = ({ airspeed, options }) => {
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
    const defaultRanges: SpeedColorRange[] = [
      { min: 40, max: 100, color: "text-white" },
      { min: 100, max: 180, color: "text-green-400" },
      { min: 180, max: 220, color: "text-yellow-400" },
      { min: 220, max: Infinity, color: "text-red-400" }
    ];

    const ranges = options?.speedColorRanges || defaultRanges;
    
    for (const range of ranges) {
      if (speed >= range.min && speed <= range.max) {
        return range.color;
      }
    }
    
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
