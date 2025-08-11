import Example from "./Example";
import { useA429ValuesSimulator, defaultFlightData } from "./utils/a429ValuesSimulator";

function App() {
  const flightData = useA429ValuesSimulator(defaultFlightData);

  return <Example flightData={flightData} />;
}

export default App;
