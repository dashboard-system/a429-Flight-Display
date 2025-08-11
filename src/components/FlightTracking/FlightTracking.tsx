import React, { useState, useEffect, useRef } from "react";

// Types
export interface FlightData {
  latitude: number;
  longitude: number;
  altitude: number;
  airspeed: number;
  groundspeed: number;
  true_track_angle: number;
  timestamp: Date;
}

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

// Global type declarations for Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
    gm_authFailure?: () => void;
  }
}

// Constants
const MAP_CONSTANTS = {
  DEFAULT_ZOOM: 4,
  GOOGLE_MAPS_ZOOM: 6,
  MAX_FLIGHT_PATH_POINTS: 100,
  AIRCRAFT_MARKER_SCALE: 1,
  FLIGHT_PATH_STROKE_WIDTH: 4,
  SIMULATED_MAP_STROKE_WIDTH: 3,
  UPDATE_TIMEOUT: 5000, // 5 seconds
} as const;

// Fake city data for simulated map
const FAKE_CITIES = [
  { name: "New York", position: { top: "25%", left: "33%" } },
  { name: "Chicago", position: { top: "50%", left: "25%" } },
  { name: "Dallas", position: { bottom: "33%", right: "25%" } },
  { name: "Denver", position: { top: "33%", left: "16%" } },
  { name: "Los Angeles", position: { bottom: "25%", left: "12%" } },
] as const;

// Fake landmass data for simulated map
const FAKE_LANDMASSES = [
  { 
    className: "absolute top-1/4 left-1/4 w-1/3 h-1/2 bg-green-800 opacity-40 rounded-full transform rotate-12"
  },
  { 
    className: "absolute top-1/3 right-1/4 w-1/4 h-1/3 bg-green-700 opacity-30 rounded-lg"
  },
  { 
    className: "absolute bottom-1/4 left-1/3 w-1/2 h-1/4 bg-green-800 opacity-35 rounded-full"
  },
] as const;

// Google Maps dark theme styles
const GOOGLE_MAPS_DARK_STYLES = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#1d2c4d" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8ec3b9" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#1a3646" }]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#4b6878" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#0e1626" }]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [{ "color": "#023e58" }]
  }
] as const;

// Map utilities
const mapUtils = {
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
    
    const x = width / 2 + (lng - centerLng) * scale * width / 360;
    const y = height / 2 - (lat - centerLat) * scale * height / 180;
    
    return { x, y };
  },

  /**
   * Generate SVG path for flight path visualization
   */
  generateFlightPathSVG: (
    flightPath: FlightPath[],
    mapCenter: { lat: number; lng: number },
    zoom: number,
    width: number,
    height: number
  ): string => {
    if (flightPath.length < 2) return "";
    
    const pathCommands = flightPath.map((point, index) => {
      const { x, y } = mapUtils.latLngToScreen(point.lat, point.lng, mapCenter, zoom, width, height);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    });
    
    return pathCommands.join(" ");
  },
};

const FlightTracking: React.FC<FlightTrackingProps> = ({
  flightData,
  width = 800,
  height = 600,
  apiKey,
}) => {
  const [flightPath, setFlightPath] = useState<FlightPath[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [zoom, setZoom] = useState(MAP_CONSTANTS.DEFAULT_ZOOM);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [useSimulatedMap, setUseSimulatedMap] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const aircraftMarkerRef = useRef<any>(null);
  const flightPathPolylineRef = useRef<any>(null);

  // Load Google Maps API
  useEffect(() => {
    // If no API key provided, use simulated map
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      setUseSimulatedMap(true);
      setIsMapLoaded(true);
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsMapLoaded(true);
      setUseSimulatedMap(false);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Wait for existing script to load
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkLoaded);
          setIsMapLoaded(true);
          setUseSimulatedMap(false);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        if (!window.google || !window.google.maps) {
          setMapError("Google Maps failed to load");
          setUseSimulatedMap(true);
          setIsMapLoaded(true);
        }
      }, 10000);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        setIsMapLoaded(true);
        setUseSimulatedMap(false);
        setMapError(null);
      } else {
        setMapError("Google Maps API failed to initialize");
        setUseSimulatedMap(true);
        setIsMapLoaded(true);
      }
    };

    script.onerror = () => {
      setMapError("Failed to load Google Maps script");
      setUseSimulatedMap(true);
      setIsMapLoaded(true);
    };

    // Global error handler for Google Maps authentication failures
    window.gm_authFailure = () => {
      setMapError("Google Maps authentication failed");
      setUseSimulatedMap(true);
      setIsMapLoaded(true);
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (window.gm_authFailure) {
        delete window.gm_authFailure;
      }
    };
  }, [apiKey]);

  // Initialize Google Maps
  useEffect(() => {
    if (!isMapLoaded || useSimulatedMap || !mapRef.current || mapInstanceRef.current) {
      return;
    }

    if (!window.google || !window.google.maps) {
      setMapError("Google Maps not available");
      setUseSimulatedMap(true);
      return;
    }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: flightData.latitude || 40.7128,
          lng: flightData.longitude || -74.006,
        },
        zoom: MAP_CONSTANTS.GOOGLE_MAPS_ZOOM,
        mapTypeId: window.google.maps.MapTypeId.TERRAIN,
        styles: GOOGLE_MAPS_DARK_STYLES,
      });

      mapInstanceRef.current = map;

      // Create aircraft marker
      const aircraftIcon = {
        path: 'M 0,-18 L -6,-6 L -18,-4 L -18,0 L -6,2 L -3,10 L -6,12 L -3,14 L 0,12 L 4,14 L 6,12 L 3,10 L 6,2 L 18,0 L 18,-4 L 6,-6 Z',
        fillColor: '#fbbf24',
        fillOpacity: 1,
        strokeColor: '#f59e0b',
        strokeWeight: 1,
        scale: 1,
        rotation: flightData.true_track_angle || 0,
        anchor: new window.google.maps.Point(0, 0),
      };

      aircraftMarkerRef.current = new window.google.maps.Marker({
        position: { lat: flightData.latitude, lng: flightData.longitude },
        map: map,
        icon: aircraftIcon,
        title: `Altitude: ${Math.round(flightData.altitude)} ft, Speed: ${Math.round(flightData.groundspeed)} mph`,
      });

      // Create flight path polyline
      flightPathPolylineRef.current = new window.google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
      });

    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
      setMapError('Failed to initialize Google Maps');
      setUseSimulatedMap(true);
    }
  }, [isMapLoaded, useSimulatedMap, flightData.latitude, flightData.longitude]);

  // Update Google Maps elements
  const updateGoogleMapsElements = (flightPath: FlightPath[]) => {
    if (!mapInstanceRef.current || !aircraftMarkerRef.current || !flightPathPolylineRef.current || useSimulatedMap) {
      return;
    }

    try {
      // Update aircraft marker position and rotation
      const aircraftIcon = {
        path: 'M 0,-18 L -6,-6 L -18,-4 L -18,0 L -6,2 L -3,10 L -6,12 L -3,14 L 0,12 L 4,14 L 6,12 L 3,10 L 6,2 L 18,0 L 18,-4 L 6,-6 Z',
        fillColor: '#fbbf24',
        fillOpacity: 1,
        strokeColor: '#f59e0b',
        strokeWeight: 1,
        scale: 1,
        rotation: flightData.true_track_angle || 0,
        anchor: new window.google.maps.Point(0, 0),
      };

      aircraftMarkerRef.current.setPosition({
        lat: flightData.latitude,
        lng: flightData.longitude,
      });
      aircraftMarkerRef.current.setIcon(aircraftIcon);
      aircraftMarkerRef.current.setTitle(
        `Altitude: ${Math.round(flightData.altitude)} ft, Speed: ${Math.round(flightData.groundspeed)} mph`
      );

      // Update flight path
      const pathCoords = flightPath.map(point => ({
        lat: point.lat,
        lng: point.lng
      }));
      flightPathPolylineRef.current.setPath(pathCoords);

      // Center map on aircraft
      mapInstanceRef.current.setCenter({
        lat: flightData.latitude,
        lng: flightData.longitude,
      });

    } catch (error) {
      console.warn('Google Maps update failed:', error);
      // Don't fall back to simulated map on update errors, just continue
    }
  };

  // Update flight path with new position data
  useEffect(() => {
    const newPoint: FlightPath = {
      lat: flightData.latitude,
      lng: flightData.longitude,
      timestamp: flightData.timestamp,
      altitude: flightData.altitude,
      speed: flightData.groundspeed,
    };

    setFlightPath((prev) => {
      const updated = [...prev.slice(-MAP_CONSTANTS.MAX_FLIGHT_PATH_POINTS + 1), newPoint];
      
      // Update Google Maps if active
      if (!useSimulatedMap && isMapLoaded) {
        updateGoogleMapsElements(updated);
      }
      
      return updated;
    });

    // Update map center for simulated map
    if (useSimulatedMap) {
      setMapCenter({ lat: flightData.latitude, lng: flightData.longitude });
    }
  }, [
    flightData.latitude,
    flightData.longitude,
    flightData.timestamp,
    flightData.altitude,
    flightData.groundspeed,
    useSimulatedMap,
    isMapLoaded,
  ]);

  const handleZoomIn = () => {
    if (useSimulatedMap) {
      setZoom((prev) => Math.min(10, prev + 1));
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (useSimulatedMap) {
      setZoom((prev) => Math.max(1, prev - 1));
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
  };

  const handleCenterOnAircraft = () => {
    if (useSimulatedMap) {
      setMapCenter({
        lat: flightData.latitude,
        lng: flightData.longitude,
      });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({
        lat: flightData.latitude,
        lng: flightData.longitude,
      });
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 shadow-2xl">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-white text-xl font-bold mb-2">Flight Tracking</h2>
        <div className="flex space-x-4 text-sm">
          <div className="text-gray-400">
            Position:{" "}
            <span className="text-cyan-400">
              {flightData.latitude.toFixed(4)}°,{" "}
              {flightData.longitude.toFixed(4)}°
            </span>
          </div>
          <div className="text-gray-400">
            Track:{" "}
            <span className="text-green-400">
              {Math.round(flightData.true_track_angle)}°
            </span>
          </div>
        </div>
      </div>

      {/* Map Display */}
      <div className="relative rounded-lg overflow-hidden" style={{ width, height }}>
        {/* Loading State */}
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-white">Loading map...</div>
          </div>
        )}

        {/* Error Notification */}
        {mapError && (
          <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs z-10">
            {mapError} - Using simulated map
          </div>
        )}

        {/* Map Content */}
        {useSimulatedMap ? (
          // Simulated Map Display
          <div className="relative bg-blue-950 rounded-lg overflow-hidden" style={{ width, height }}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-950">
              {/* Simulate landmasses */}
              {FAKE_LANDMASSES.map((landmass, index) => (
                <div key={index} className={landmass.className} />
              ))}
            </div>

            {/* Grid overlay */}
            <svg className="absolute inset-0" width={width} height={height}>
              <defs>
                <pattern
                  id="grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width={width} height={height} fill="url(#grid)" />
            </svg>

            {/* Cities/Waypoints overlay */}
            <div className="absolute inset-0 text-white text-xs">
              {FAKE_CITIES.map((city, index) => (
                <div key={index} className="absolute flex items-center" style={city.position}>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1" />
                  <span>{city.name}</span>
                </div>
              ))}
            </div>

            {/* Flight path visualization */}
            <svg className="absolute inset-0" width={width} height={height}>
              {/* Flight path line */}
              {flightPath.length > 1 && (
                <path
                  d={mapUtils.generateFlightPathSVG(flightPath, mapCenter, zoom, width, height)}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6,3"
                  opacity="1.0"
                />
              )}

              {/* Historical positions */}
              {flightPath.slice(0, -1).map((point, index) => {
                const { x, y } = mapUtils.latLngToScreen(point.lat, point.lng, mapCenter, zoom, width, height);
                const opacity = Math.max(0.3, (index + 1) / flightPath.length);
                const radius = Math.max(1.5, 3 * ((index + 1) / flightPath.length));
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={radius}
                    fill="#10b981"
                    opacity={opacity}
                    stroke="#059669"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Current aircraft position */}
              {flightPath.length > 0 && (
                <g
                  transform={`translate(${
                    mapUtils.latLngToScreen(flightData.latitude, flightData.longitude, mapCenter, zoom, width, height).x
                  }, ${
                    mapUtils.latLngToScreen(flightData.latitude, flightData.longitude, mapCenter, zoom, width, height).y
                  }) rotate(${flightData.true_track_angle})`}
                >
                  {/* Aircraft body */}
                  <path
                    d="M 0,-18 L -6,-6 L -18,-4 L -18,0 L -6,2 L -3,10 L -6,12 L -3,14 L 0,12 L 4,14 L 6,12 L 3,10 L 6,2 L 18,0 L 18,-4 L 6,-6 Z"
                    fill="#fbbf24"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                </g>
              )}
            </svg>
          </div>
        ) : (
          // Google Maps Display
          <div ref={mapRef} className="w-full h-full" style={{ width, height }} />
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-xs transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-xs transition-colors"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleCenterOnAircraft}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-xs transition-colors"
            title="Center on Aircraft"
          >
            📍
          </button>
        </div>
      </div>

      {/* Flight Information Panel */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-800 p-3 rounded border">
          <div className="text-gray-400 text-xs">Ground Speed</div>
          <div className="text-green-400 font-mono text-lg">
            {Math.round(flightData.groundspeed)} mph
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded border">
          <div className="text-gray-400 text-xs">True Airspeed</div>
          <div className="text-cyan-400 font-mono text-lg">
            {Math.round(flightData.airspeed)} mph
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded border">
          <div className="text-gray-400 text-xs">Altitude</div>
          <div className="text-blue-300 font-mono text-lg">
            {Math.round(flightData.altitude).toLocaleString()} ft
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded border">
          <div className="text-gray-400 text-xs">To Arrival</div>
          <div className="text-white font-mono text-lg">5:18</div>
        </div>
      </div>
    </div>
  );
};

export default FlightTracking;