# ARINC 429 Flight Display

React components for building primary flight displays (PFD) with ARINC 429 data visualization.

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

### Individual Components

```tsx
import { 
  AttitudeIndicator, 
  AirspeedIndicator, 
  AltitudeIndicator,
  HeadingIndicator,
  VerticalSpeedIndicator,
  ARINC429DataBus 
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
      <ARINC429DataBus flightData={flightData} />
    </div>
  );
}
```

## Components

- **AircraftPFD** - Complete primary flight display
- **AttitudeIndicator** - Artificial horizon with pitch/roll
- **AirspeedIndicator** - Airspeed tape display
- **AltitudeIndicator** - Altitude tape display  
- **HeadingIndicator** - Heading compass display
- **VerticalSpeedIndicator** - Vertical speed indicator
- **ARINC429DataBus** - Live ARINC 429 data visualization

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import { FlightData, ARINC429Word, ARINC429_LABELS, SSM } from 'a429-flight-display';
```

## License

ISC