import React from 'react';

interface VerticalSpeedIndicatorProps {
  verticalSpeed: number;
}

const VerticalSpeedIndicator: React.FC<VerticalSpeedIndicatorProps> = ({ verticalSpeed }) => {
  return (
    <div className="bg-gray-900 text-white p-2 rounded-lg w-20 h-48 relative border-2 border-gray-600">
      <div className="absolute left-2 top-1/2 w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-yellow-400 transform -translate-y-1/2"></div>
      <div className="absolute right-2 top-1/2 text-xs font-mono transform -translate-y-1/2">
        <div className="text-center">2</div>
        <div className="text-center mt-4">1</div>
        <div className="text-center mt-8 text-yellow-400">0</div>
        <div className="text-center mt-8">1</div>
        <div className="text-center mt-4">2</div>
      </div>
      <div 
        className="absolute left-6 w-8 h-1 bg-cyan-400 transition-transform duration-300"
        style={{ 
          top: `${120 - (verticalSpeed / 100)}px`,
          transform: 'translateY(-50%)'
        }}
      ></div>
      <div className="absolute bottom-2 left-1/2 bg-black px-1 text-cyan-400 font-bold text-xs transform -translate-x-1/2">
        {Math.round(verticalSpeed / 100) / 10}
      </div>
    </div>
  );
};

export default VerticalSpeedIndicator;