# ARINC 429 Flight Display

React components for building primary flight displays (PFD) with ARINC 429 data visualization and raw data conversion utilities.

## Screenshots

### Primary Flight Display
![Flight Display](https://github.com/dashboard-system/a429-Flight-Display/blob/main/screenshots/flight_display.png)
*Complete PFD with attitude, airspeed, altitude, heading, and vertical speed indicators*

### Flight Tracking
![Flight Tracking](https://github.com/dashboard-system/a429-Flight-Display/blob/main/screenshots/flight_tracking.png)  
*Real-time flight tracking with Google Maps integration*

## Installation

```bash
npm install a429-flight-display
```

## Usage

### Basic Usage

```tsx
import { AircraftPFD, useA429ValuesSimulator, defaultFlightData } from 'a429-flight-display';
import 'a429-flight-display/style.css';

function App() {
  // Use the enhanced flight data simulator with realistic ARINC 429 parameters
  const flightData = useA429ValuesSimulator(defaultFlightData);
  
  return <AircraftPFD flightData={flightData} />;
}
```

### ARINC 429 Raw Data Simulation

```tsx
import { useA429RawDataSimulator, defaultFlightData } from 'a429-flight-display';

function App() {
  // Get both raw ARINC 429 data and processed flight data
  const { rawData, flightData } = useA429RawDataSimulator(defaultFlightData);
  
  // rawData contains ARINC429Word objects with proper encoding
  // flightData contains the processed flight parameters
  
  return <AircraftPFD flightData={flightData} />;
}
```

### Data Conversion Utilities

```tsx
import { 
  convertToA429RawData,
  convertFromA429RawData,
  convertFlightParamsToA429,
  convertA429ToFlightParams,
  FlightParameters
} from 'a429-flight-display';

// Convert flight data to ARINC 429 format
const flightParams: FlightParameters = {
  altitude: 35000,
  airspeed: 285,
  heading: 270,
  vertical_speed: 0
};

// Convert to raw ARINC 429 data
const rawData = convertFlightParamsToA429(flightParams);

// Convert back to flight parameters  
const decodedParams = convertA429ToFlightParams(rawData);

// Work with 32-bit word arrays for transmission
import { rawDataToWords, wordsToRawData } from 'a429-flight-display';

const words = rawDataToWords(rawData);
const reconstructedData = wordsToRawData(words, ['altitude', 'airspeed', 'heading']);
```

### Individual Components

```tsx
import { 
  AttitudeIndicator, 
  AirspeedIndicator, 
  AltitudeIndicator,
  HeadingIndicator,
  VerticalSpeedIndicator,
  ARINC429DataBus,
  FlightTracking
} from 'a429-flight-display';
import 'a429-flight-display/style.css';

function CustomPFD() {
  const flightData = useA429ValuesSimulator(defaultFlightData);
  
  return (
    <div>
      <AttitudeIndicator pitch={flightData.pitch_angle} roll={flightData.roll_angle} />
      <AirspeedIndicator airspeed={flightData.airspeed} />
      <AltitudeIndicator altitude={flightData.altitude} />
      <HeadingIndicator heading={flightData.true_heading} />
      <VerticalSpeedIndicator verticalSpeed={flightData.vertical_speed} />
      <FlightTracking flightData={flightData} apiKey="your-google-maps-api-key" />
      <ARINC429DataBus flightData={flightData} />
    </div>
  );
}
```

## Components

- **AircraftPFD** - Complete primary flight display
- **FlightDisplay** - Main flight instruments display
- **AttitudeIndicator** - Artificial horizon with pitch/roll
- **AirspeedIndicator** - Airspeed tape display
- **AltitudeIndicator** - Altitude tape display  
- **HeadingIndicator** - Heading compass display
- **VerticalSpeedIndicator** - Vertical speed indicator
- **FlightTracking** - Real-time flight tracking with map integration
- **ARINC429DataBus** - Live ARINC 429 data visualization

## ARINC 429 Features

### Raw Data Generation
- Realistic ARINC 429 word encoding with proper scales
- Support for common aviation parameters (altitude, airspeed, heading, etc.)
- Automatic parity calculation and validation
- Sign Status Matrix (SSM) support

### Data Conversion
- **convertToA429RawData** / **convertFlightParamsToA429** - Convert flight parameters to ARINC 429 format
- **convertFromA429RawData** / **convertA429ToFlightParams** - Decode ARINC 429 data to flight parameters
- **rawDataToWords** - Convert to 32-bit integer array for transmission
- **wordsToRawData** - Reconstruct from 32-bit integer array
- **validateA429Word** - Verify parity and data integrity

### Supported ARINC 429 Labels
- **203** (Octal) - Altitude
- **206** (Octal) - Airspeed  
- **207** (Octal) - Mach Number
- **222** (Octal) - Heading
- **365** (Octal) - Vertical Speed
- **324** (Octal) - Pitch Angle
- **325** (Octal) - Roll Angle
- **211** (Octal) - Temperature

## API Reference

### Hooks
- `useA429ValuesSimulator(initialData)` - Enhanced flight data simulator
- `useA429RawDataSimulator(initialData)` - Raw ARINC 429 data simulator

### Conversion Functions
- `convertToA429RawData(flightData)` - Convert FlightData to ARINC 429
- `convertFromA429RawData(rawData)` - Convert ARINC 429 to flight parameters
- `convertFlightParamsToA429(params)` - Generic parameter conversion
- `convertA429ToFlightParams(rawData)` - Generic parameter decoding

### Utility Functions
- `rawDataToWords(rawData)` - Convert to transmission format
- `wordsToRawData(words, labels)` - Reconstruct from words
- `validateA429Word(word)` - Validate word integrity
- `getLabelName(label)` - Get parameter name from label

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import { 
  FlightData, 
  FlightParameters,
  ARINC429Word, 
  ARINC429RawData,
  ARINC429_LABELS, 
  SSM 
} from 'a429-flight-display';
```

## Standalone Converter Package

For applications that only need ARINC 429 conversion without React components, a standalone converter package is available. See `a429-converter-package.json` for npm publishing configuration.

## License

ISC
