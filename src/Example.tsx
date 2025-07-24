import ARINC429DataBus from "./components/ARINC429DataBus/ARINC429DataBus";
import FlightDisplay from "./components/FlightDisplay";

import { FlightData } from "./types/flight";

const AircraftPFD = ({ flightData }: { flightData: FlightData }) => {
  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Flight Display */}
        <FlightDisplay flightData={flightData} />

        {/* ARINC 429 Data Display */}
        <ARINC429DataBus flightData={flightData} />
      </div>
    </div>
  );
};

export default AircraftPFD;
