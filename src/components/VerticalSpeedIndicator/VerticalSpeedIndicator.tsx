import React from "react";

interface VerticalSpeedIndicatorProps {
  verticalSpeed: number;
}

const VerticalSpeedIndicator: React.FC<VerticalSpeedIndicatorProps> = ({ verticalSpeed }) => {
  const generateScaleMarks = () => {
    const marks = [];
    const range = 3000; // ±3000 FPM range
    const increment = 200; // 200 FPM increments
    
    for (let vs = -range; vs <= range; vs += increment) {
      const yPercent = 50 - (vs / range) * 40; // Map to 10% - 90% of container
      const isMajor = vs % 1000 === 0;
      const showLabel = isMajor;
      
      marks.push({
        value: vs,
        yPercent,
        isMajor,
        showLabel,
        label: showLabel ? (vs / 1000).toString() : ""
      });
    }
    
    return marks;
  };

  const marks = generateScaleMarks();
  
  // Calculate current VS position
  const clampedVS = Math.max(-3000, Math.min(3000, verticalSpeed));
  const currentYPercent = 50 - (clampedVS / 3000) * 40;
  
  // Format current value display
  const formatCurrentValue = () => {
    const absVS = Math.abs(verticalSpeed);
    if (absVS < 50) return "00";
    
    // Show in hundreds format like the screenshot
    const hundreds = Math.floor(absVS / 100);
    return hundreds.toString().padStart(2, '0');
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg w-20 h-64 relative border-2 border-gray-600 shadow-lg overflow-hidden">
      {/* Title */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-300 font-semibold">
        V/S
      </div>
      
      {/* Vertical scale */}
      <div className="absolute right-1 top-8 bottom-8 w-16">
        {marks.map((mark, index) => (
          <div
            key={index}
            className="absolute w-full flex items-center justify-end"
            style={{ top: `${mark.yPercent}%` }}
          >
            {/* Scale labels */}
            {mark.showLabel && (
              <div className="mr-1 text-xs font-mono text-white">
                {mark.label}
              </div>
            )}
            
            {/* Tick marks */}
            <div className={`bg-white h-0.5 ${
              mark.isMajor ? 'w-4' : 'w-2'
            } ${mark.value === 0 ? 'bg-yellow-400 w-6' : 'bg-white'}`}></div>
          </div>
        ))}
      </div>
      
      {/* Center reference pointer */}
      <div 
        className="absolute left-2 top-1/2 w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-yellow-400 transform -translate-y-1/2 z-10"
      ></div>
      
      {/* Current value indicator line */}
      <div 
        className="absolute left-8 w-6 h-0.5 bg-cyan-400 transform -translate-y-1/2 transition-all duration-300 z-20"
        style={{ top: `${currentYPercent}%` }}
      ></div>
      
      {/* Current value display */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black px-2 py-1 border border-gray-400 rounded z-30">
        <div className="text-cyan-400 font-bold text-lg font-mono">
          {formatCurrentValue()}
        </div>
        <div className="text-gray-400 text-xs text-center">
          {verticalSpeed >= 0 ? '▲' : '▼'}
        </div>
      </div>
      
      {/* Unit label */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
        FPM
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none z-40"></div>
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none z-40"></div>
    </div>
  );
};

export default VerticalSpeedIndicator;