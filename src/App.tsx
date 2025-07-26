import AircraftPFD from "./AircraftPFD";
import { useA429ValuesSimulator, defaultFlightData } from "./utils/a429ValuesSimulator";

function App() {
  const flightData = useA429ValuesSimulator(defaultFlightData);

  return <AircraftPFD flightData={flightData} />;
}

export default App;
