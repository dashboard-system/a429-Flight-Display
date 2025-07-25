import React from "react";

interface AirspeedIndicatorProps {
  airspeed: number;
}

const AirspeedIndicator: React.FC<AirspeedIndicatorProps> = ({ airspeed }) => {
  // Generate speed marks around current airspeed with better range
  const generateSpeedMarks = (currentSpeed: number) => {
    const marks = [];
    const range = 100; // Show 100 knots above and below current speed
    const increment = 10; // 10 knot increments for more marks

    const startSpeed = Math.max(
      0,
      Math.floor((currentSpeed - range) / increment) * increment
    );
    const endSpeed = Math.ceil((currentSpeed + range) / increment) * increment;

    for (let speed = startSpeed; speed <= endSpeed; speed += increment) {
      marks.push(speed);
    }
    return marks;
  };

  const speeds = generateSpeedMarks(airspeed);

  const getSpeedColor = (speed: number) => {
    if (speed >= 40 && speed <= 100) return "text-white";
    if (speed >= 100 && speed <= 180) return "text-green-400";
    if (speed >= 180 && speed <= 220) return "text-yellow-400";
    if (speed > 220) return "text-red-400";
    return "text-gray-400";
  };

  const isMajorTick = (speed: number) => speed % 20 === 0;

  return (
    <div className="bg-gray-900 text-white rounded-lg w-32 h-64 relative overflow-hidden border-2 border-gray-600 flex flex-col">
      {/* Title Label */}
      <div className="text-center text-xs font-bold text-gray-300 py-1 border-b border-gray-600">
        AIRSPEED
      </div>

      {/* Speed Scale Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Speed Scale */}
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="relative h-48 mx-2">
            {" "}
            {/* Fixed height container for scale with margins */}
            {speeds.map((speed) => {
              // Calculate position relative to current airspeed
              const pixelsPerKnot = 2; // Increased for better spacing
              const relativePosition = (airspeed - speed) * pixelsPerKnot;
              const centerY = 96; // Half of container height (192px / 2)
              const finalY = centerY + relativePosition;

              // Only show speeds that are within the main display area (not overlapping header/footer)
              if (
                Math.abs(relativePosition) > 90 ||
                finalY < 20 ||
                finalY > 172
              )
                return null;

              return (
                <div
                  key={speed}
                  className="absolute flex items-center w-full"
                  style={{
                    top: `${finalY}px`,
                    transform: "translateY(-50%)",
                  }}
                >
                  {/* Speed numbers - positioned on the left */}
                  {isMajorTick(speed) && (
                    <div
                      className={`text-xs font-mono w-8 text-right ${getSpeedColor(
                        speed
                      )}`}
                    >
                      {speed}
                    </div>
                  )}

                  {/* Tick marks */}
                  <div
                    className={`ml-1 bg-white ${
                      isMajorTick(speed) ? "h-0.5 w-4" : "h-0.5 w-2"
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Speed Pointer */}
        <div className="absolute right-2 top-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-yellow-400 transform -translate-y-1/2 z-20"></div>

        {/* Current Speed Display Box */}
        <div className="absolute top-1/2 right-8 bg-black px-2 py-1 border border-white text-yellow-400 font-bold text-sm transform -translate-y-1/2 z-10 min-w-[3rem] text-center">
          {Math.round(airspeed)}
        </div>
      </div>

      {/* Units Label */}
      <div className="text-center text-xs text-gray-300 py-1 border-t border-gray-600">
        KTS
      </div>
    </div>
  );
};

export default AirspeedIndicator;
