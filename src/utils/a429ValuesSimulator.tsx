import { useState, useEffect } from "react";
import { FlightData } from "../types";

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