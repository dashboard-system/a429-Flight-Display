import { useState, useEffect } from "react";
import { FlightData } from "../types";
import { ARINC429Word, ARINC429_LABELS, ARINC429RawData, encodeA429Value } from "../types/arinc429";

export const useA429ValuesSimulator = (initialData?: FlightData) => {
  const [flightData, setFlightData] = useState<FlightData>(initialData || defaultFlightData);

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
          true_heading: (() => {
            // Calculate desired heading to Vancouver
            const vancouverLat = 49.2827;
            const vancouverLng = -123.1207;
            const dLng = (vancouverLng - prev.longitude) * Math.PI / 180;
            const lat1 = prev.latitude * Math.PI / 180;
            const lat2 = vancouverLat * Math.PI / 180;
            
            const y = Math.sin(dLng) * Math.cos(lat2);
            const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
            const desiredHeading = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
            
            // Gradually adjust heading towards Vancouver (1 degree per update max)
            let headingDiff = desiredHeading - prev.true_heading;
            if (headingDiff > 180) headingDiff -= 360;
            if (headingDiff < -180) headingDiff += 360;
            
            const headingAdjustment = Math.max(-1, Math.min(1, headingDiff * 0.1));
            return (prev.true_heading + headingAdjustment + prev.true_heading_rate * 0.02 + (Math.random() - 0.5) * 0.2 + 360) % 360;
          })(),
          magnetic_heading: (prev.true_heading - 12 + 360) % 360, // Magnetic variation for Western Canada
          
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
          
          // Navigation (realistic cruise navigation towards Vancouver)
          // Vancouver coordinates: 49.2827, -123.1207
          // Calculate distance and bearing to Vancouver
          latitude: (() => {
            // Use actual track angle with slight navigation drift
            const trackRadians = prev.true_track_angle * Math.PI / 180;
            return prev.latitude + (prev.groundspeed * Math.cos(trackRadians)) / 364000;
          })(),
          longitude: (() => {
            const trackRadians = prev.true_track_angle * Math.PI / 180;
            return prev.longitude + (prev.groundspeed * Math.sin(trackRadians)) / (364000 * Math.cos(prev.latitude * Math.PI / 180));
          })(),
          
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
          
          // Navigation Aids (Vancouver destination)
          ils_deviation: phase === 'APPROACH' ? (Math.random() - 0.5) * 1.5 : 0,
          glideslope_deviation: phase === 'APPROACH' ? (Math.random() - 0.5) * 1.2 : 0,
          dme_distance: (() => {
            // Calculate actual distance to Vancouver
            const vancouverLat = 49.2827;
            const vancouverLng = -123.1207;
            const R = 3440.065; // Earth's radius in nautical miles
            const dLat = (vancouverLat - prev.latitude) * Math.PI / 180;
            const dLng = (vancouverLng - prev.longitude) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                     Math.cos(prev.latitude * Math.PI / 180) * Math.cos(vancouverLat * Math.PI / 180) * 
                     Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return Math.max(0, R * c);
          })(),
          
          // Time & Date
          date: now.toLocaleDateString('en-GB'),
          time: now.toTimeString().split(' ')[0],
          timestamp: now,
          
          // Flight Phase
          flight_phase: phase,
        };
      });
    }, 2000); // Update every 2 seconds for visible movement

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
  true_heading: 285,          // Westbound heading to Vancouver
  magnetic_heading: 277,      // Accounting for magnetic variation
  
  // Minimal rates in stable cruise
  pitch_rate: 0.1,
  roll_rate: -0.2,
  true_heading_rate: 0.05,
  vertical_speed: 50,         // Slight climb (step climb scenario)
  true_track_angle: 287,      // Slightly different from heading due to wind
  
  // Cruise flight accelerations
  body_lateral_accel: -0.02,  // Minimal lateral G
  body_long_accel: 0.01,      // Slight acceleration
  body_normal_accel: 1.01,    // Just over 1G in level flight
  
  // Position over Ontario, Canada
  latitude: 43.6532,          // Toronto, Ontario area
  longitude: -79.3832,
  
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
  
  // Navigation aids (Vancouver destination)
  ils_deviation: 0,
  glideslope_deviation: 0,
  dme_distance: 2200,         // Distance to Vancouver in nautical miles
  
  // Current date/time
  date: new Date().toLocaleDateString('en-GB'),
  time: new Date().toTimeString().split(' ')[0],
  timestamp: new Date(),
  flight_phase: 'CRUISE'
};

// Convert FlightData to ARINC 429 Raw Data
export function convertToA429RawData(flightData: FlightData): ARINC429RawData {
  return {
    altitude: encodeA429Value(flightData.altitude, 1, ARINC429_LABELS.ALTITUDE),
    airspeed: encodeA429Value(flightData.airspeed, 128, ARINC429_LABELS.AIRSPEED),
    mach: encodeA429Value(flightData.mach, 8192, ARINC429_LABELS.MACH),
    heading: encodeA429Value(flightData.true_heading, 182.0444, ARINC429_LABELS.HEADING),
    vertical_speed: encodeA429Value(flightData.vertical_speed, 32, ARINC429_LABELS.VERTICAL_SPEED),
    pitch: encodeA429Value(flightData.pitch_angle, 4096, ARINC429_LABELS.PITCH),
    roll: encodeA429Value(flightData.roll_angle, 4096, ARINC429_LABELS.ROLL),
    temperature: encodeA429Value(flightData.static_air_temperature, 256, ARINC429_LABELS.TEMPERATURE),
  };
}

// Convert ARINC 429 Raw Data back to FlightData
export function convertFromA429RawData(rawData: ARINC429RawData): Partial<FlightData> {
  const decodeA429Value = (word: ARINC429Word, scale: number): number => {
    return word.data / scale;
  };

  return {
    altitude: rawData.altitude ? decodeA429Value(rawData.altitude, 1) : undefined,
    airspeed: rawData.airspeed ? decodeA429Value(rawData.airspeed, 128) : undefined,
    mach: rawData.mach ? decodeA429Value(rawData.mach, 8192) : undefined,
    true_heading: rawData.heading ? decodeA429Value(rawData.heading, 182.0444) : undefined,
    vertical_speed: rawData.vertical_speed ? decodeA429Value(rawData.vertical_speed, 32) : undefined,
    pitch_angle: rawData.pitch ? decodeA429Value(rawData.pitch, 4096) : undefined,
    roll_angle: rawData.roll ? decodeA429Value(rawData.roll, 4096) : undefined,
    static_air_temperature: rawData.temperature ? decodeA429Value(rawData.temperature, 256) : undefined,
  };
}

// Raw ARINC 429 Data Simulator Hook
export const useA429RawDataSimulator = (initialFlightData?: FlightData) => {
  const [rawData, setRawData] = useState<ARINC429RawData>(() => 
    convertToA429RawData(initialFlightData || defaultFlightData)
  );
  const flightData = useA429ValuesSimulator(initialFlightData);

  useEffect(() => {
    const interval = setInterval(() => {
      setRawData(convertToA429RawData(flightData));
    }, 2000);

    return () => clearInterval(interval);
  }, [flightData]);

  return { rawData, flightData };
};