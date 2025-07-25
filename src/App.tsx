import AircraftPFD from "./AircraftPFD";
import { useA429ValuesSimulator } from "./utils/a429ValuesSimulator";

function App() {
  const flightData = useA429ValuesSimulator({
    altitude: 35000,
    airspeed: 250,
    mach: 0.78,
    heading: 90,
    verticalSpeed: 1500,
    pitch: 5,
    roll: -2,
    temperature: -45,
    timestamp: new Date(),
  });

  return <AircraftPFD flightData={flightData} />;
}

export default App;
