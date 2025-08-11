import { FlightData } from './flight';

// Google Maps global type declarations
declare global {
  interface Window {
    google: any;
    initMap: () => void;
    gm_authFailure?: () => void;
  }
}

// Flight Tracking Types (Google Maps related)
export interface FlightPath {
  lat: number;
  lng: number;
  timestamp: Date;
  altitude: number;
  speed: number;
}

export interface FlightTrackingProps {
  flightData: FlightData;
  width?: number;
  height?: number;
  apiKey?: string;
}