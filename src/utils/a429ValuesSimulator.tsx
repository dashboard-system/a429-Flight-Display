import { useState, useEffect } from "react";

// Enhanced FlightData interface based on ARINC 429 parameters
export interface FlightData {
  // Primary Flight Data (ARINC 429 Labels 203-326)
  airspeed: number;              // Label 210 - True Airspeed (knots)
  altitude: number;              // Label 203 - Barometric Altitude (feet)
  groundspeed: number;           // Label 312 - Ground Speed (knots)
  mach: number;                  // Calculated Mach number
  
  // Attitude & Heading (AHRS Labels 320-326)
  pitch_angle: number;           // Label 326 - Pitch Angle (degrees)
  roll_angle: number;            // Label 325 - Roll Angle (degrees)
  true_heading: number;          // Label 324 - True Heading (degrees)
  magnetic_heading: number;      // Label 320 - Magnetic Heading (degrees)
  
  // Flight Dynamics
  pitch_rate: number;            // Pitch rate (degrees/second)
  roll_rate: number;             // Roll rate (degrees/second)
  true_heading_rate: number;     // Heading rate (degrees/second)
  vertical_speed: number;        // Label 212 - Altitude Rate (feet/minute)
  true_track_angle: number;      // Label 313 - Track Angle True (degrees)
  
  // Accelerations (Body Frame)
  body_lateral_accel: number;    // Lateral acceleration (g-force)
  body_long_accel: number;       // Longitudinal acceleration (g-force)
  body_normal_accel: number;     // Normal acceleration (g-force)
  
  // Navigation (GPS Labels 310-313)
  latitude: number;              // Label 310 - Present Position Latitude (degrees)
  longitude: number;             // Label 311 - Present Position Longitude (degrees)
  
  // Environmental Data (Labels 211-217)
  total_air_temperature: number; // Label 211 - Total Air Temperature (°C)
  static_air_temperature: number; // Label 215 - Static Air Temperature (°C)
  wind_speed: number;            // Label 366 - Wind Speed (knots)
  wind_direction: number;        // Label 367 - Wind Direction True (degrees)
  static_pressure: number;       // Label 216 - Static Pressure (millibars)
  
  // Engine Parameters (Labels 300-306)
  n1_rpm: number;                // Label 301 - N1 Fan Speed (% RPM)
  n2_rpm: number;                // Label 302 - N2 Core Speed (% RPM)
  egt: number;                   // Label 300 - Exhaust Gas Temperature (°C)
  fuel_flow: number;             // Label 303 - Fuel Flow (lbs/hr)
  oil_pressure: number;          // Label 304 - Oil Pressure (PSI)
  oil_temperature: number;       // Label 305 - Oil Temperature (°C)
  
  // Aircraft Configuration
  flap_position: number;         // Label 103 - Flap Position (degrees)
  gear_position: boolean;        // Label 102 - Landing Gear Position
  
  // System Status
  cabin_altitude: number;        // Label 350 - Cabin Altitude (feet)
  cabin_pressure_diff: number;   // Label 351 - Cabin Differential Pressure (PSI)
  
  // Navigation Aids
  ils_deviation: number;         // Label 173 - Localizer Deviation (dots)
  glideslope_deviation: number;  // Label 174 - Glideslope Deviation (dots)
  dme_distance: number;          // Label 202 - DME Distance (nautical miles)
  
  // Time & Date
  date: string;                  // Label 260 - Date (DD/MM/YYYY)
  time: string;                  // Time (HH:MM:SS)
  timestamp: Date;               // JavaScript timestamp
  
  // Flight Phase
  flight_phase: 'GROUND' | 'TAKEOFF' | 'CLIMB' | 'CRUISE' | 'DESCENT' | 'APPROACH' | 'LANDING';
}

export const useA429ValuesSimulator = (initialData: FlightData) => {
  const [flightData, setFlightData] = useState<FlightData>(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlightData((prev) => ({
        altitude: prev.altitude + (Math.random() - 0.5) * 100,
        airspeed: Math.max(
          180,
          Math.min(300, prev.airspeed + (Math.random() - 0.5) * 10)
        ),
        mach: Math.max(
          0.5,
          Math.min(0.9, prev.mach + (Math.random() - 0.5) * 0.02)
        ),
        heading: (prev.heading + (Math.random() - 0.5) * 5 + 360) % 360,
        verticalSpeed: prev.verticalSpeed + (Math.random() - 0.5) * 200,
        pitch: Math.max(
          -15,
          Math.min(15, prev.pitch + (Math.random() - 0.5) * 2)
        ),
        roll: Math.max(
          -30,
          Math.min(30, prev.roll + (Math.random() - 0.5) * 2)
        ),
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        timestamp: new Date(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return flightData;
};

// Default initial data - Commercial aircraft in cruise flight
export const defaultFlightData: FlightData = {
  // Cruise flight at FL350 (35,000 ft)
  airspeed: 285,              // Typical cruise IAS (knots)
  altitude: 35000,            // Flight Level 350
  groundspeed: 465,           // TAS + wind component
  mach: 0.82,                 // Typical commercial cruise Mach
  
  // Stable cruise attitude
  pitch_angle: 2.5,           // Slight nose-up attitude in cruise
  roll_angle: -1.2,           // Minor bank correction
  true_heading: 95,          // Eastbound heading
  magnetic_heading: 87,      // Accounting for magnetic variation
  
  // Minimal rates in stable cruise
  pitch_rate: 0.1,
  roll_rate: -0.2,
  true_heading_rate: 0.05,
  vertical_speed: 50,         // Slight climb (step climb scenario)
  true_track_angle: 97,      // Slightly different from heading due to wind
  
  // Cruise flight accelerations
  body_lateral_accel: -0.02,  // Minimal lateral G
  body_long_accel: 0.01,      // Slight acceleration
  body_normal_accel: 1.01,    // Just over 1G in level flight
  
  // Position over North Atlantic
  latitude: 51.2847,          // Over Atlantic (London-NYC route)
  longitude: -25.4558,
  
  // High altitude environment
  total_air_temperature: -54, // ISA at FL350
  static_air_temperature: -56,
  wind_speed: 45,             // Typical jetstream winds
  wind_direction: 285,        // Westerly jetstream
  static_pressure: 238,       // Pressure at FL350 (millibars)
  
  // Cruise engine settings (Boeing 737/A320 class)
  n1_rpm: 78.5,               // Cruise thrust setting
  n2_rpm: 94.2,               // High-pressure spool
  egt: 485,                   // Exhaust gas temp (°C)
  fuel_flow: 1650,            // Per engine fuel flow (lbs/hr)
  oil_pressure: 62,           // Normal cruise oil pressure
  oil_temperature: 88,        // Oil temp in cruise
  
  // Clean configuration for cruise
  flap_position: 0,           // Flaps up
  gear_position: false,       // Gear retracted
  
  // Pressurized cabin
  cabin_altitude: 6800,       // Typical cruise cabin altitude
  cabin_pressure_diff: 8.1,   // Differential pressure (PSI)
  
  // Navigation aids (not in use during cruise)
  ils_deviation: 0,
  glideslope_deviation: 0,
  dme_distance: 0,            // No DME selected
  
  // Current date/time
  date: new Date().toLocaleDateString('en-GB'),
  time: new Date().toTimeString().split(' ')[0],
  timestamp: new Date(),
  flight_phase: 'CRUISE'
};