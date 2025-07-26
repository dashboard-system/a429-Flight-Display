import AttitudeIndicator from "./AttitudeIndicator/AttitudeIndicator";
import AirspeedIndicator from "./AirspeedIndicator/AirspeedIndicator";
import AltitudeIndicator from "./AltitudeIndicator/AltitudeIndicator";
import HeadingIndicator from "./HeadingIndicator/HeadingIndicator";
import VerticalSpeedIndicator from "./VerticalSpeedIndicator/VerticalSpeedIndicator";

import { FlightData } from "../types/flight";

function FlightDisplay({ flightData }: { flightData: FlightData }) {
  return (
    <>
      {/* Main Flight Display */}
      <div className="bg-black rounded-xl p-8 shadow-2xl mb-6">
        <div className="flex justify-center items-center space-x-8">
          {/* Airspeed */}
          <p>AirSpeed</p>
          <AirspeedIndicator airspeed={flightData.airspeed} />

          {/* Attitude Indicator */}
          <div className="flex flex-col items-center space-y-4">
            <AttitudeIndicator
              pitch={flightData.pitch_angle}
              roll={flightData.roll_angle}
            />
            <HeadingIndicator heading={flightData.true_heading} />
          </div>

          {/* Altitude */}
          <AltitudeIndicator altitude={flightData.altitude} />

          {/* Vertical Speed */}
          <VerticalSpeedIndicator verticalSpeed={flightData.vertical_speed} />
        </div>

        {/* Flight Data Bar */}
        <div className="flex justify-center space-x-8 mt-6 text-white">
          <div className="bg-gray-800 px-4 py-2 rounded border">
            <span className="text-gray-400">MACH:</span>
            <span className="text-cyan-400 ml-2 font-mono">
              {flightData.mach.toFixed(3)}
            </span>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded border">
            <span className="text-gray-400">OAT:</span>
            <span className="text-blue-300 ml-2 font-mono">
              {Math.round(flightData.total_air_temperature)}°C
            </span>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded border">
            <span className="text-gray-400">GS:</span>
            <span className="text-green-400 ml-2 font-mono">{Math.round(flightData.groundspeed)} KT</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default FlightDisplay;
