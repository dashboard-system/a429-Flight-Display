const AttitudeIndicator = ({ pitch, roll }: { pitch: number; roll: number }) => {
  return (
    <div className="relative w-48 h-48 bg-gradient-to-b from-blue-400 to-amber-600 rounded-full overflow-hidden border-4 border-white shadow-2xl">
      {/* Artificial Horizon */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-blue-400 to-amber-600"
        style={{
          transform: `rotate(${roll}deg) translateY(${pitch * 2}px)`,
          transformOrigin: "center center",
        }}
      >
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white transform -translate-y-0.5"></div>
      </div>

      {/* Aircraft Symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-8 h-1 bg-yellow-400 relative">
          <div className="absolute left-1/2 top-1/2 w-1 h-4 bg-yellow-400 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Pitch Lines */}
      {[-20, -10, 10, 20].map((angle) => (
        <div
          key={angle}
          className="absolute left-1/4 right-1/4 h-0.5 bg-white opacity-70"
          style={{
            top: `${50 + angle * 2}%`,
            transform: `rotate(${roll}deg)`,
            transformOrigin: "center center",
          }}
        ></div>
      ))}

      {/* Bank Angle Indicator */}
      <div className="absolute top-2 left-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-white transform -translate-x-1/2"></div>
    </div>
  );
};

export default AttitudeIndicator;
