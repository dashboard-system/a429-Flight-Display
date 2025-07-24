import React from 'react';

interface HeadingIndicatorProps {
  heading: number;
}

const HeadingIndicator: React.FC<HeadingIndicatorProps> = ({ heading }) => {
  const headings = ['N', '03', '06', 'E', '12', '15', 'S', '21', '24', 'W', '30', '33'];
  return (
    <div className="bg-gray-900 text-white rounded-lg w-64 h-16 relative overflow-hidden border-2 border-gray-600">
      <div className="absolute top-0 left-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-yellow-400 transform -translate-x-1/2"></div>
      <div 
        className="absolute top-4 flex transition-transform duration-300"
        style={{ transform: `translateX(${128 - (heading / 360) * 384}px)` }}
      >
        {headings.concat(headings).map((dir, i) => (
          <div key={i} className="w-8 flex justify-center text-xs font-mono">
            {dir}
          </div>
        ))}
      </div>
      <div className="absolute bottom-1 left-1/2 bg-black px-2 py-1 border border-white text-green-400 font-bold text-sm transform -translate-x-1/2">
        {Math.round(heading).toString().padStart(3, '0')}°
      </div>
    </div>
  );
};

export default HeadingIndicator;