import React from 'react';
import { FlightData, ARINC429Word, ARINC429_LABELS, SSM } from '../../types';

interface ARINC429DataBusProps {
  flightData: FlightData;
}

const ARINC429DataBus: React.FC<ARINC429DataBusProps> = ({ flightData }) => {
  // Generate ARINC 429 words from current data
  const generateARINC429Words = (): ARINC429Word[] => {
    return [
      new ARINC429Word(ARINC429_LABELS.ALTITUDE, 0, Math.round(flightData.altitude), SSM.NORMAL_OPERATION),
      new ARINC429Word(ARINC429_LABELS.AIRSPEED, 0, Math.round(flightData.airspeed), SSM.NORMAL_OPERATION),
      new ARINC429Word(ARINC429_LABELS.MACH, 0, Math.round(flightData.mach * 100000), SSM.NORMAL_OPERATION),
      new ARINC429Word(ARINC429_LABELS.HEADING, 0, Math.round(flightData.heading), SSM.NORMAL_OPERATION),
      new ARINC429Word(ARINC429_LABELS.VERTICAL_SPEED, 0, Math.round(flightData.verticalSpeed), SSM.NORMAL_OPERATION),
      new ARINC429Word(ARINC429_LABELS.PITCH, 0, Math.round(flightData.pitch * 100), SSM.NORMAL_OPERATION),
      new ARINC429Word(ARINC429_LABELS.ROLL, 0, Math.round(flightData.roll * 100), SSM.NORMAL_OPERATION),
    ];
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-4">Live ARINC 429 Data Bus</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {generateARINC429Words().map((word, index) => {
          const labelName = Object.keys(ARINC429_LABELS).find(
            key => ARINC429_LABELS[key as keyof typeof ARINC429_LABELS] === word.label
          );
          const hexValue = '0x' + ((word.label << 24) | (word.sdi << 22) | (word.data << 3) | (word.ssm << 1) | word.parity).toString(16).toUpperCase().padStart(8, '0');
          
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="text-yellow-400 font-semibold text-sm mb-2">{labelName}</div>
              <div className="text-white font-mono text-xs space-y-1">
                <div>Label: {word.label.toString(8).padStart(3, '0')}</div>
                <div>Data: {word.data}</div>
                <div>Hex: {hexValue}</div>
              </div>
              <div className="text-green-400 text-xs mt-2">● NORMAL</div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-4 bg-gray-800 px-6 py-3 rounded-lg">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold">ARINC 429 Bus Active</span>
          <span className="text-gray-400 font-mono text-sm">12.5 kHz</span>
        </div>
      </div>
    </div>
  );
};

export default ARINC429DataBus;