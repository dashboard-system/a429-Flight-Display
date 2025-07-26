import React from 'react';
import { JSX } from 'react/jsx-runtime';

interface AttitudeIndicatorProps {
  pitch: number;
  roll: number;
}

const AttitudeIndicator: React.FC<AttitudeIndicatorProps> = ({ pitch, roll }) => {
  const pixelsPerDegree = 3;
  
  const generatePitchLadder = () => {
    const lines = [];
    for (let angle = -30; angle <= 30; angle += 5) {
      if (angle === 0) continue; // Skip horizon line
      
      const isMajor = angle % 10 === 0;
      
      lines.push(
        <div key={angle} className="absolute flex items-center justify-center w-full">
          <div
            className="flex items-center justify-center"
            style={{
              transform: `translateY(${-angle * pixelsPerDegree}px)`,
            }}
          >
            {/* Pitch line */}
            <div
              className={`bg-white ${
                isMajor ? 'h-0.5 w-16' : 'h-0.5 w-8'
              }`}
            ></div>
            
            {/* Pitch angle text for major lines */}
            {isMajor && (
              <>
                <span className="text-white text-xs font-mono ml-2 select-none">
                  {Math.abs(angle)}
                </span>
                <div className={`bg-white h-0.5 w-16 ml-2`}></div>
                <span className="text-white text-xs font-mono ml-2 select-none">
                  {Math.abs(angle)}
                </span>
              </>
            )}
          </div>
        </div>
      );
    }
    return lines;
  };

  const generateBankMarkings = () => {
    const markings: JSX.Element[] = [];
    const angles = [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60];
    
    angles.forEach((angle) => {
      const isMajor = [0, -30, 30, -60, 60].includes(angle);
      const isStandard = [-10, -20, 10, 20, -45, 45].includes(angle);
      
      markings.push(
        <div
          key={angle}
          className="absolute top-1 left-1/2 origin-bottom transform -translate-x-1/2"
          style={{
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transformOrigin: 'center 92px',
          }}
        >
          <div
            className={`bg-white ${
              isMajor ? 'w-0.5 h-4' : isStandard ? 'w-0.5 h-3' : 'w-0.5 h-2'
            }`}
          ></div>
          {(angle === -30 || angle === 30 || angle === -60 || angle === 60) && (
            <div className="text-white text-xs font-mono text-center mt-1 select-none">
              {Math.abs(angle)}
            </div>
          )}
        </div>
      );
    });
    
    return markings;
  };

  return (
    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-600 shadow-2xl bg-gray-900">
      {/* Attitude Sphere */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-amber-500"
        style={{
          transform: `rotate(${roll}deg) translateY(${pitch * pixelsPerDegree}px)`,
          transformOrigin: "center center",
          width: '200%',
          height: '200%',
          left: '-50%',
          top: '-50%',
        }}
      >
        {/* Horizon Line */}
        <div 
          className="absolute left-0 right-0 h-1 bg-white"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        ></div>
        
        {/* Pitch Ladder */}
        <div 
          className="absolute inset-0 flex justify-center items-center"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {generatePitchLadder()}
        </div>
      </div>

      {/* Bank Angle Markings */}
      <div className="absolute inset-0">
        {generateBankMarkings()}
      </div>

      {/* Bank Angle Pointer */}
      <div 
        className="absolute top-1 left-1/2 w-0 h-0 border-l-3 border-r-3 border-b-6 border-transparent border-b-yellow-400 transform -translate-x-1/2 z-20"
        style={{
          transform: `translateX(-50%) rotate(${roll}deg)`,
          transformOrigin: 'center 92px',
        }}
      ></div>

      {/* Aircraft Symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        {/* Main body */}
        <div className="relative flex items-center justify-center">
          {/* Wings */}
          <div className="w-12 h-1 bg-yellow-400"></div>
          {/* Fuselage */}
          <div className="absolute w-1 h-6 bg-yellow-400"></div>
          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-yellow-400 rounded-full"></div>
        </div>
      </div>

      {/* Fixed Bank Reference Triangle */}
      <div className="absolute top-2 left-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-white transform -translate-x-1/2 z-10"></div>
    </div>
  );
};

export default AttitudeIndicator;
