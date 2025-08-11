import React from 'react';
import { VerticalTapeProps } from '../../types';

const VerticalTape: React.FC<VerticalTapeProps> = ({
  value,
  title,
  unit,
  unitTooltip,
  generateMarks,
  getValueColor = () => 'text-white',
  isMajorTick = (val) => val % 20 === 0,
  formatValue = (val) => val.toString(),
  formatCurrentValue = (val) => Math.round(val).toString(),
  pixelsPerUnit = 2,
  pointerSide = 'right',
  className = '',
}) => {
  const marks = generateMarks(value);
  const isLeftPointer = pointerSide === 'left';
  console.log();
  
  return (
    <div className={`bg-gray-900 text-white rounded-lg w-32 h-64 relative overflow-hidden border-2 border-gray-600 flex flex-col ${className}`}>
      {/* Title Label */}
      <div className="text-center text-xs font-bold text-gray-300 py-1 border-b border-gray-600">
        {title}
      </div>

      {/* Scale Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Scale */}
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="relative h-48 mx-2">
            {marks.map((mark) => {
              const relativePosition = (value - mark) * pixelsPerUnit;
              const centerY = 96; // Half of container height (192px / 2)
              const finalY = centerY + relativePosition;

              // Only show marks that are within the main display area
              if (Math.abs(relativePosition) > 90 || finalY < 0 || finalY > 202) {
                return null;
              }

              const isMajor = isMajorTick(mark);

              return (
                <div
                  key={mark}
                  className="absolute flex items-center w-full"
                  style={{
                    top: `${finalY}px`,
                    transform: "translateY(-50%)",
                    flexDirection: isLeftPointer ? 'row-reverse' : 'row',
                  }}
                >
                  {/* Value numbers - positioned based on pointer side */}
                  {isMajor && (
                    <div
                      className={`text-xs font-mono w-8 ${
                        isLeftPointer ? 'text-left' : 'text-right'
                      } ${getValueColor(mark)}`}
                    >
                      {formatValue(mark)}
                    </div>
                  )}

                  {/* Tick marks */}
                  <div
                    className={`${isLeftPointer ? 'mr-1' : 'ml-1'} bg-white ${
                      isMajor ? 'h-0.5 w-4' : 'h-0.5 w-2'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Value Pointer */}
        <div
          className={`absolute ${
            isLeftPointer ? 'left-2' : 'right-2'
          } top-1/2 w-0 h-0 ${
            isLeftPointer
              ? 'border-t-4 border-b-4 border-r-6 border-transparent border-r-yellow-400'
              : 'border-t-4 border-b-4 border-l-6 border-transparent border-l-yellow-400'
          } transform -translate-y-1/2 z-20`}
        ></div>

        {/* Current Value Display Box */}
        <div
          className={`absolute top-1/2 ${
            isLeftPointer ? 'left-8' : 'right-8'
          } bg-black px-2 py-1 border border-white text-yellow-400 font-bold text-sm transform -translate-y-1/2 z-10 min-w-[3rem] text-center`}
        >
          {formatCurrentValue(value)}
        </div>
      </div>

      {/* Units Label */}
      <div className="relative group text-center text-xs text-gray-300 py-1 border-t border-gray-600">
        <span className="cursor-help">{unit}</span>
        {unitTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none max-w-32 text-center whitespace-normal">
            {unitTooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalTape;