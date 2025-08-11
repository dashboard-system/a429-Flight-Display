import { FlightPath } from "../types/googleMaps";

// Map coordinate conversion utilities
export const mapUtils = {
  /**
   * Convert lat/lng coordinates to screen coordinates using Mercator projection
   */
  latLngToScreen: (
    lat: number, 
    lng: number, 
    mapCenter: { lat: number; lng: number }, 
    zoom: number, 
    width: number, 
    height: number
  ) => {
    const centerLat = mapCenter.lat;
    const centerLng = mapCenter.lng;
    
    // Simple Mercator projection approximation
    const scale = Math.pow(2, zoom) / 360;
    const x = width / 2 + 
      ((lng - centerLng) * scale * Math.cos((centerLat * Math.PI) / 180) * width) / 100;
    const y = height / 2 - ((lat - centerLat) * scale * height) / 100;
    
    return { x, y };
  },

  /**
   * Generate SVG path string from flight path points
   */
  generateFlightPathSVG: (
    flightPath: FlightPath[], 
    mapCenter: { lat: number; lng: number }, 
    zoom: number, 
    width: number, 
    height: number
  ): string => {
    if (flightPath.length < 2) return "";

    let path = "";
    flightPath.forEach((point, index) => {
      const { x, y } = mapUtils.latLngToScreen(point.lat, point.lng, mapCenter, zoom, width, height);
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  },

  /**
   * Create aircraft marker icon configuration for Google Maps
   */
  createAircraftIcon: (rotation: number) => ({
    path: "M 0,-18 L -6,-6 L -18,-4 L -18,0 L -6,2 L -3,10 L -6,12 L -3,14 L 0,12 L 4,14 L 6,12 L 3,10 L 6,2 L 18,0 L 18,-4 L 6,-6 Z",
    fillColor: "#fbbf24",
    fillOpacity: 1,
    strokeColor: "#f59e0b",
    strokeWeight: 1,
    scale: 1,
    rotation: rotation || 0,
    anchor: new window.google.maps.Point(0, 0),
  }),

  /**
   * Create flight path polyline configuration for Google Maps
   */
  createFlightPathPolyline: (map: any) => new window.google.maps.Polyline({
    path: [],
    geodesic: true,
    strokeColor: "#10b981",
    strokeOpacity: 1.0,
    strokeWeight: 4,
    map: map,
    icons: [{
      icon: {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 2,
        strokeColor: '#10b981'
      },
      offset: '0',
      repeat: '20px'
    }]
  }),

  /**
   * Format aircraft tooltip text
   */
  formatAircraftTooltip: (altitude: number, groundspeed: number): string => {
    return `Aircraft - Alt: ${Math.round(altitude)}ft, Speed: ${Math.round(groundspeed)}kts`;
  },

  /**
   * Handle Google Maps API loading errors
   */
  handleGoogleMapsError: (
    setMapError: (error: string) => void,
    setUseSimulatedMap: (use: boolean) => void,
    setIsMapLoaded: (loaded: boolean) => void
  ) => {
    return {
      onScriptError: () => {
        setMapError("Failed to load Google Maps script");
        setUseSimulatedMap(true);
        setIsMapLoaded(true);
      },
      onAuthFailure: () => {
        setMapError("Google Maps API authentication failed - check API key restrictions");
        setUseSimulatedMap(true);
        setIsMapLoaded(true);
      },
      onTimeout: () => {
        setMapError("Google Maps failed to load - using simulated map");
        setUseSimulatedMap(true);
        setIsMapLoaded(true);
      }
    };
  },

  /**
   * Update Google Maps aircraft marker
   */
  updateGoogleMapsMarker: (
    marker: any,
    lat: number,
    lng: number,
    rotation: number,
    altitude: number,
    groundspeed: number
  ) => {
    if (!marker) return;

    marker.setPosition({ lat, lng });
    marker.setIcon(mapUtils.createAircraftIcon(rotation));
    marker.setTitle(mapUtils.formatAircraftTooltip(altitude, groundspeed));
  },

  /**
   * Update Google Maps flight path
   */
  updateGoogleMapsFlightPath: (
    polyline: any,
    flightPath: FlightPath[]
  ) => {
    if (!polyline) return;

    const pathCoords = flightPath.map(point => ({
      lat: point.lat,
      lng: point.lng
    }));
    polyline.setPath(pathCoords);
  }
};