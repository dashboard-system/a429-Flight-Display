import React, { useState, useEffect } from "react";
import { FlightData } from "./types";
import AircraftPFD from "./AircraftPFD";

function App() {
  const [flightData, setFlightData] = useState<FlightData>({
    altitude: 35000,
    airspeed: 250,
    mach: 0.78,
    heading: 90,
    verticalSpeed: 1500,
    pitch: 5,
    roll: -2,
    temperature: -45,
  });

  // Simulate live ARINC 429 data updates
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
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return <AircraftPFD flightData={flightData} />;
}

export default App;
