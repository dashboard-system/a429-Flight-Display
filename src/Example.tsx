import { useState } from "react";
import ARINC429DataBus from "./components/ARINC429DataBus/ARINC429DataBus";
import FlightDisplay from "./components/FlightDisplay";
import FlightTracking from "./components/FlightTracking/FlightTracking";

import { FlightData } from "./types/flight";

const AircraftPFD = ({ flightData }: { flightData: FlightData }) => {
  const [activeTab, setActiveTab] = useState<'flight-display' | 'flight-tracking'>('flight-display');

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Date and Time Display */}
        <div className="mb-6 text-center">
          <div className="bg-gray-900 rounded-lg p-4 inline-block">
            <div className="text-green-400 font-mono text-lg">
              {flightData.timestamp.toLocaleDateString()} -{" "}
              {flightData.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="bg-gray-900 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('flight-display')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'flight-display'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Flight Display
            </button>
            <button
              onClick={() => setActiveTab('flight-tracking')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'flight-tracking'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Flight Tracking
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'flight-display' && (
          <div>
            {/* Main Flight Display */}
            <FlightDisplay flightData={flightData} />
            
            {/* ARINC 429 Data Display */}
            <ARINC429DataBus flightData={flightData} />
          </div>
        )}

        {activeTab === 'flight-tracking' && (
          <div>
            {/* Flight Tracking Display */}
            <FlightTracking flightData={flightData} apiKey="AIzaSyBHbNbhkvRhsWHMTfZzL-zXSMduhLPpN7w"/>
          </div>
        )}
      </div>
    </div>
  );
};

export default AircraftPFD;
