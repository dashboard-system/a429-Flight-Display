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
      setFlightData((prev) => {
        const now = new Date();
        
        // Enhanced flight phase detection for in-flight operations
        let phase: FlightData['flight_phase'] = prev.flight_phase;
        
        if (prev.altitude < 1000) {
          if (prev.groundspeed < 50) phase = 'GROUND';
          else if (prev.vertical_speed > 500) phase = 'TAKEOFF';
          else if (prev.vertical_speed < -500) phase = 'LANDING';
          else phase = 'APPROACH';
        } else if (prev.altitude < 10000) {
          if (prev.vertical_speed > 1000) phase = 'CLIMB';
          else if (prev.vertical_speed < -1000) phase = 'DESCENT';
          else phase = 'CRUISE';
        } else if (prev.altitude > 30000) {
          // High altitude operations
          if (prev.vertical_speed > 500) phase = 'CLIMB';
          else if (prev.vertical_speed < -500) phase = 'DESCENT';
          else phase = 'CRUISE';
        } else {
          // Medium altitude
          if (prev.vertical_speed > 800) phase = 'CLIMB';
          else if (prev.vertical_speed < -800) phase = 'DESCENT';
          else phase = 'CRUISE';
        }

        // Calculate realistic parameter relationships
        const machFromAirspeed = prev.airspeed / (661.5 * Math.sqrt(288.15 / (prev.static_air_temperature + 273.15)));
        
        // Realistic flight dynamics based on phase - optimized for cruise
        const getPhaseMultipliers = (phase: string) => {
          switch (phase) {
            case 'TAKEOFF':
              return { altitudeRate: 2500, speedChange: 15, powerSetting: 0.95, stabilityFactor: 0.3 };
            case 'CLIMB':
              return { altitudeRate: 1500, speedChange: 5, powerSetting: 0.82, stabilityFactor: 0.7 };
            case 'CRUISE':
              return { altitudeRate: 25, speedChange: 1.5, powerSetting: 0.78, stabilityFactor: 0.95 };
            case 'DESCENT':
              return { altitudeRate: -1000, speedChange: 4, powerSetting: 0.45, stabilityFactor: 0.8 };
            case 'APPROACH':
              return { altitudeRate: -600, speedChange: 6, powerSetting: 0.55, stabilityFactor: 0.6 };
            case 'LANDING':
              return { altitudeRate: -200, speedChange: 8, powerSetting: 0.35, stabilityFactor: 0.4 };
            default:
              return { altitudeRate: 0, speedChange: 1, powerSetting: 0.25, stabilityFactor: 0.9 };
          }
        };

        const phaseParams = getPhaseMultipliers(phase);
        
        // Environmental correlations with cruise flight turbulence
        const turbulenceIntensity = phase === 'CRUISE' ? 0.3 : 1.0;
        const windVariation = (Math.random() - 0.5) * 1.5 * turbulenceIntensity;
        const tempVariation = (Math.random() - 0.5) * 0.5;
    
        // Engine parameter correlations (optimized for cruise stability)
        const targetN1 = phaseParams.powerSetting * 100;
        const n1Change = (targetN1 - prev.n1_rpm) * 0.02 + (Math.random() - 0.5) * 0.3 * turbulenceIntensity;
        const newN1 = Math.max(20, Math.min(100, prev.n1_rpm + n1Change));
        const newN2 = Math.max(30, Math.min(105, newN1 * 1.18 + (Math.random() - 0.5) * 0.8));
        
        // EGT correlates with N1/N2 and altitude (cruise optimized)
        const baseEGT = 300 + (newN1 / 100) * 350 - (prev.altitude / 1000) * 6;
        const newEGT = Math.max(200, Math.min(950, baseEGT + (Math.random() - 0.5) * 8));
        
        // Fuel flow correlates with N1 and altitude (cruise efficiency)
        const altitudeFactor = Math.max(0.6, 1 - prev.altitude / 120000);
        const baseFuelFlow = (newN1 / 100) * 2200 * altitudeFactor;
        const newFuelFlow = Math.max(300, baseFuelFlow + (Math.random() - 0.5) * 40);


        return {
          // Primary Flight Data with realistic constraints
          airspeed: Math.max(0, Math.min(400, 
            prev.airspeed + (Math.random() - 0.5) * phaseParams.speedChange)),
          altitude: Math.max(0, prev.altitude + prev.vertical_speed / 60 + (Math.random() - 0.5) * 20),
          groundspeed: Math.max(0, prev.airspeed + prev.wind_speed * Math.cos((prev.wind_direction - prev.true_heading) * Math.PI / 180)),
          mach: Math.max(0, Math.min(0.95, machFromAirspeed + (Math.random() - 0.5) * 0.01)),
          
          // Attitude with realistic flight envelope limits
          pitch_angle: Math.max(-20, Math.min(25, 
            prev.pitch_angle + prev.pitch_rate * 0.02 + (Math.random() - 0.5) * 0.5)),
          roll_angle: Math.max(-45, Math.min(45, 
            prev.roll_angle + prev.roll_rate * 0.02 + (Math.random() - 0.5) * 0.8)),
          true_heading: (prev.true_heading + prev.true_heading_rate * 0.02 + (Math.random() - 0.5) * 0.3 + 360) % 360,
          magnetic_heading: (prev.true_heading - 8.5 + 360) % 360, // Magnetic variation
          
          // Flight Dynamics
          pitch_rate: Math.max(-10, Math.min(10, (Math.random() - 0.5) * 2)),
          roll_rate: Math.max(-15, Math.min(15, (Math.random() - 0.5) * 3)),
          true_heading_rate: Math.max(-5, Math.min(5, (Math.random() - 0.5) * 1)),
          vertical_speed: Math.max(-4000, Math.min(4000, 
            phaseParams.altitudeRate + (Math.random() - 0.5) * 300)),
          true_track_angle: (prev.true_heading + (Math.random() - 0.5) * 2 + 360) % 360,
          
          // Accelerations (realistic g-force ranges)
          body_lateral_accel: Math.max(-2, Math.min(2, prev.roll_angle * 0.02 + (Math.random() - 0.5) * 0.1)),
          body_long_accel: Math.max(-1, Math.min(1, (newN1 - prev.n1_rpm) * 0.01 + (Math.random() - 0.5) * 0.05)),
          body_normal_accel: Math.max(-1, Math.min(3, 1 + prev.pitch_angle * 0.015 + (Math.random() - 0.5) * 0.08)),
          
          // Navigation (realistic cruise navigation with small drift)
          latitude: prev.latitude + (prev.groundspeed * Math.cos(prev.true_track_angle * Math.PI / 180)) / 364000 * 0.9,
          longitude: prev.longitude + (prev.groundspeed * Math.sin(prev.true_track_angle * Math.PI / 180)) / (364000 * Math.cos(prev.latitude * Math.PI / 180)) * 0.9,
          
          // Environmental Data (high altitude conditions)
          total_air_temperature: Math.max(-70, Math.min(50, 
            15 - (prev.altitude / 1000) * 2 + tempVariation)),
          static_air_temperature: Math.max(-70, Math.min(50, 
            15 - (prev.altitude / 1000) * 2 + tempVariation - 2)),
          wind_speed: Math.max(0, Math.min(150, prev.wind_speed + windVariation)),
          wind_direction: (prev.wind_direction + (Math.random() - 0.5) * 2 + 360) % 360,
          static_pressure: Math.max(100, 1013.25 * Math.pow((1 - 0.0065 * prev.altitude / 288.15), 5.255)),
          
          // Engine Parameters (realistic turbofan correlations)
          n1_rpm: newN1,
          n2_rpm: newN2,
          egt: newEGT,
          fuel_flow: newFuelFlow,
          oil_pressure: Math.max(20, Math.min(100, 45 + (newN1 / 100) * 35 + (Math.random() - 0.5) * 3)),
          oil_temperature: Math.max(-40, Math.min(150, 60 + (newN1 / 100) * 40 + (Math.random() - 0.5) * 5)),
          
          // Aircraft Configuration (cruise configuration)
          flap_position: phase === 'TAKEOFF' || phase === 'APPROACH' || phase === 'LANDING' ? 
            Math.max(0, Math.min(40, 20 + (Math.random() - 0.5) * 3)) : 0,
          gear_position: prev.altitude < 2500 && (phase === 'TAKEOFF' || phase === 'APPROACH' || phase === 'LANDING' || phase === 'GROUND'),
          
          // System Status (pressurized cruise cabin)
          cabin_altitude: Math.min(8000, Math.max(0, prev.altitude * 0.2 + 6000 + (Math.random() - 0.5) * 50)),
          cabin_pressure_diff: Math.max(0, Math.min(9.5, (prev.altitude - 6000) / 5000 * 8 + (Math.random() - 0.5) * 0.05)),
          
          // Navigation Aids (simulate approach scenario)
          ils_deviation: phase === 'APPROACH' ? (Math.random() - 0.5) * 1.5 : 0,
          glideslope_deviation: phase === 'APPROACH' ? (Math.random() - 0.5) * 1.2 : 0,
          dme_distance: Math.max(0, prev.dme_distance - prev.groundspeed / 3600 + (Math.random() - 0.5) * 0.1),
          
          // Time & Date
          date: now.toLocaleDateString('en-GB'),
          time: now.toTimeString().split(' ')[0],
          timestamp: now,
          
          // Flight Phase
          flight_phase: phase,
        };
      });
    }, 1000); // Update at 1 Hz (can be increased for higher fidelity)

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