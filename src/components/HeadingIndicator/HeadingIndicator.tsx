import React from 'react';

interface HeadingIndicatorProps {
  heading: number;
}

const HeadingIndicator: React.FC<HeadingIndicatorProps> = ({ heading }) => {
  const generateMarkings = () => {
    const markings = [];
    for (let i = 0; i < 72; i++) {
      const angle = i * 5;
      const isCardinal = angle % 90 === 0;
      const isMajor = angle % 30 === 0;
      const isMinor = angle % 10 === 0;
      
      let label = '';
      if (angle === 0) label = 'N';
      else if (angle === 90) label = 'E';
      else if (angle === 180) label = 'S';
      else if (angle === 270) label = 'W';
      else if (isMajor) label = (angle / 10).toString().padStart(2, '0');
      
      markings.push({
        angle,
        label,
        isCardinal,
        isMajor,
        isMinor,
        x: i * 4
      });
    }
    return markings;
  };

  const markings = generateMarkings();
  const normalizedHeading = ((heading % 360) + 360) % 360;
  const pixelsPerDegree = 4;
  const translateX = 96 - (normalizedHeading * pixelsPerDegree);

  return (
    <div className="bg-gray-900 text-white rounded-lg w-48 h-16 relative overflow-hidden border-2 border-gray-600 shadow-lg">
      {/* Center reference arrow */}
      <div className="absolute top-0 left-1/2 w-0 h-0 border-l-3 border-r-3 border-b-6 border-transparent border-b-yellow-400 transform -translate-x-1/2 z-10"></div>
      
      {/* Heading tape */}
      <div 
        className="absolute top-1 flex transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {markings.concat(markings).concat(markings).map((marking, i) => (
          <div key={i} className="relative flex flex-col items-center" style={{ width: '4px' }}>
            {/* Tick marks */}
            <div className={`bg-white ${
              marking.isCardinal ? 'w-0.5 h-4' : 
              marking.isMajor ? 'w-0.5 h-3' : 
              marking.isMinor ? 'w-px h-2' : 
              'w-px h-1'
            }`}></div>
            
            {/* Labels */}
            {marking.label && (
              <div className={`mt-0.5 text-xs font-mono whitespace-nowrap ${
                marking.isCardinal ? 'text-yellow-400 font-bold' : 'text-white'
              }`} style={{ fontSize: '10px' }}>
                {marking.label}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Digital readout */}
      <div className="absolute bottom-1 left-1/2 bg-black px-2 py-0.5 border border-gray-400 text-green-400 font-bold text-xs transform -translate-x-1/2 rounded whitespace-nowrap">
        HDG {Math.round(normalizedHeading).toString().padStart(3, '0')}°
      </div>
      
      {/* Side gradients for visual depth */}
      <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-gray-900 to-transparent pointer-events-none z-20"></div>
      <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-20"></div>
    </div>
  );
};

export default HeadingIndicator;