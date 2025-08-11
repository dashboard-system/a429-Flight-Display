import { FlightData } from './flight';

// Airspeed Indicator Types
export interface SpeedColorRange {
  min: number;
  max: number;
  color: string;
}

export interface AirspeedIndicatorOptions {
  speedColorRanges?: SpeedColorRange[];
}

export interface AirspeedIndicatorProps {
  airspeed: number;
  options?: AirspeedIndicatorOptions;
}

// Altitude Indicator Types
export interface AltitudeIndicatorProps {
  altitude: number;
}

// Attitude Indicator Types
export interface AttitudeIndicatorProps {
  pitch: number;
  roll: number;
}

// Heading Indicator Types
export interface HeadingIndicatorProps {
  heading: number;
}

// Vertical Speed Indicator Types
export interface VerticalSpeedIndicatorProps {
  verticalSpeed: number;
}


// ARINC 429 Data Bus Types
export interface ARINC429DataBusProps {
  flightData: FlightData;
}

// Shared Vertical Tape Types
export interface VerticalTapeProps {
  value: number;
  title: string;
  unit: string;
  unitTooltip?: string;
  generateMarks: (currentValue: number) => number[];
  getValueColor?: (value: number) => string;
  isMajorTick?: (value: number) => boolean;
  formatValue?: (value: number) => string;
  formatCurrentValue?: (value: number) => string;
  pixelsPerUnit?: number;
  pointerSide?: 'left' | 'right';
  className?: string;
}