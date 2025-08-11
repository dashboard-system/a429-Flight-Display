import Example from "./Example";
import { useA429ValuesSimulator } from "./utils/a429ValuesSimulator";

function App() {
  const flightData = useA429ValuesSimulator();

  return <Example flightData={flightData} />;
}

export default App;
