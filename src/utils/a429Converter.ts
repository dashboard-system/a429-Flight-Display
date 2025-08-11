// ARINC 429 Data Conversion Utility
// Standalone utility for converting between ARINC 429 raw data and flight data

// ARINC 429 Word Class
export class ARINC429Word {
  label: number;
  sdi: number;
  data: number;
  ssm: number;
  parity: number;

  constructor(label: number, sdi: number, data: number, ssm: number) {
    this.label = label;
    this.sdi = sdi;
    this.data = data;
    this.ssm = ssm;
    this.parity = this.calculateParity();
  }

  calculateParity(): number {
    const word = (this.label << 24) | (this.sdi << 22) | (this.data << 3) | (this.ssm << 1);
    let bits = 0;
    for (let i = 0; i < 31; i++) {
      if (word & (1 << i)) bits++;
    }
    return bits % 2 === 0 ? 1 : 0;
  }

  // Convert to 32-bit integer representation
  toInt32(): number {
    return (this.label << 24) | (this.sdi << 22) | (this.data << 3) | (this.ssm << 1) | this.parity;
  }

  // Create from 32-bit integer
  static fromInt32(word: number): ARINC429Word {
    const label = (word >> 24) & 0xFF;
    const sdi = (word >> 22) & 0x03;
    const data = (word >> 3) & 0x7FFFF;
    const ssm = (word >> 1) & 0x03;
    return new ARINC429Word(label, sdi, data, ssm);
  }
}

// ARINC 429 Labels (Octal format)
export const ARINC429_LABELS = {
  ALTITUDE: 0o203,
  AIRSPEED: 0o206,
  MACH: 0o207,
  HEADING: 0o222,
  VERTICAL_SPEED: 0o365,
  PITCH: 0o324,
  ROLL: 0o325,
  TEMPERATURE: 0o211,
} as const;

// Sign Status Matrix values
export const SSM = {
  NORMAL_OPERATION: 0b11,
  NO_COMPUTED_DATA: 0b00,
  FUNCTIONAL_TEST: 0b01,
  FAILURE_WARNING: 0b10,
} as const;

// Raw ARINC 429 Data interface
export interface ARINC429RawData {
  [key: string]: ARINC429Word;
}

// Generic flight data interface
export interface FlightParameters {
  altitude?: number;           // feet
  airspeed?: number;          // knots
  mach?: number;              // Mach number
  heading?: number;           // degrees (0-360)
  vertical_speed?: number;    // feet per minute
  pitch_angle?: number;       // degrees
  roll_angle?: number;        // degrees
  temperature?: number;       // degrees Celsius
}

// Utility function to encode value into ARINC 429 format
export function encodeA429Value(value: number, scale: number = 1, label: number, sdi: number = 0): ARINC429Word {
  const encodedValue = Math.round(value * scale) & 0x7FFFF; // 19-bit data field
  return new ARINC429Word(label, sdi, encodedValue, SSM.NORMAL_OPERATION);
}

// Utility function to decode ARINC 429 value
export function decodeA429Value(word: ARINC429Word, scale: number): number {
  return word.data / scale;
}

// Convert flight parameters to ARINC 429 Raw Data
export function convertToA429RawData(flightParams: FlightParameters): ARINC429RawData {
  const rawData: ARINC429RawData = {};

  if (flightParams.altitude !== undefined) {
    rawData.altitude = encodeA429Value(flightParams.altitude, 1, ARINC429_LABELS.ALTITUDE);
  }
  if (flightParams.airspeed !== undefined) {
    rawData.airspeed = encodeA429Value(flightParams.airspeed, 128, ARINC429_LABELS.AIRSPEED);
  }
  if (flightParams.mach !== undefined) {
    rawData.mach = encodeA429Value(flightParams.mach, 8192, ARINC429_LABELS.MACH);
  }
  if (flightParams.heading !== undefined) {
    rawData.heading = encodeA429Value(flightParams.heading, 182.0444, ARINC429_LABELS.HEADING);
  }
  if (flightParams.vertical_speed !== undefined) {
    rawData.vertical_speed = encodeA429Value(flightParams.vertical_speed, 32, ARINC429_LABELS.VERTICAL_SPEED);
  }
  if (flightParams.pitch_angle !== undefined) {
    rawData.pitch = encodeA429Value(flightParams.pitch_angle, 4096, ARINC429_LABELS.PITCH);
  }
  if (flightParams.roll_angle !== undefined) {
    rawData.roll = encodeA429Value(flightParams.roll_angle, 4096, ARINC429_LABELS.ROLL);
  }
  if (flightParams.temperature !== undefined) {
    rawData.temperature = encodeA429Value(flightParams.temperature, 256, ARINC429_LABELS.TEMPERATURE);
  }

  return rawData;
}

// Convert ARINC 429 Raw Data back to flight parameters
export function convertFromA429RawData(rawData: ARINC429RawData): FlightParameters {
  const flightParams: FlightParameters = {};

  if (rawData.altitude) {
    flightParams.altitude = decodeA429Value(rawData.altitude, 1);
  }
  if (rawData.airspeed) {
    flightParams.airspeed = decodeA429Value(rawData.airspeed, 128);
  }
  if (rawData.mach) {
    flightParams.mach = decodeA429Value(rawData.mach, 8192);
  }
  if (rawData.heading) {
    flightParams.heading = decodeA429Value(rawData.heading, 182.0444);
  }
  if (rawData.vertical_speed) {
    flightParams.vertical_speed = decodeA429Value(rawData.vertical_speed, 32);
  }
  if (rawData.pitch) {
    flightParams.pitch_angle = decodeA429Value(rawData.pitch, 4096);
  }
  if (rawData.roll) {
    flightParams.roll_angle = decodeA429Value(rawData.roll, 4096);
  }
  if (rawData.temperature) {
    flightParams.temperature = decodeA429Value(rawData.temperature, 256);
  }

  return flightParams;
}

// Convert raw data to array of 32-bit words (for transmission)
export function rawDataToWords(rawData: ARINC429RawData): number[] {
  return Object.values(rawData).map(word => word.toInt32());
}

// Convert array of 32-bit words back to raw data
export function wordsToRawData(words: number[], labels: string[]): ARINC429RawData {
  const rawData: ARINC429RawData = {};
  
  words.forEach((word, index) => {
    if (labels[index]) {
      rawData[labels[index]] = ARINC429Word.fromInt32(word);
    }
  });

  return rawData;
}

// Validate ARINC 429 word
export function validateA429Word(word: ARINC429Word): boolean {
  return word.calculateParity() === word.parity;
}

// Get parameter name by label
export function getLabelName(label: number): string | undefined {
  const labelMap = Object.entries(ARINC429_LABELS).find(([, value]) => value === label);
  return labelMap ? labelMap[0] : undefined;
}