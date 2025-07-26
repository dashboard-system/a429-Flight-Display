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