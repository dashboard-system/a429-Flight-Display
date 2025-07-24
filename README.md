# ARINC 429 Flight Display

React components for building primary flight displays (PFD) with ARINC 429 data visualization.

## Installation

```bash
npm install a429-flight-display
```

## Usage

### Basic Usage

```tsx
import { AircraftPFD, FlightData } from 'a429-flight-display';
import 'a429-flight-display/style.css';

const flightData: FlightData = {
  altitude: 35000,
  airspeed: 250,
  mach: 0.78,
  heading: 90,
  verticalSpeed: 1500,
  pitch: 5,
  roll: -2,
  temperature: -45
};

function App() {
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
  return (
    <div>
      <AttitudeIndicator pitch={5} roll={-2} />
      <AirspeedIndicator airspeed={250} />
      <AltitudeIndicator altitude={35000} />
      <HeadingIndicator heading={90} />
      <VerticalSpeedIndicator verticalSpeed={1500} />
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