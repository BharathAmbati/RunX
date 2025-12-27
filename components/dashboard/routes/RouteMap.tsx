"use client";

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, RotateCcw, Save, Trash2 } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';

// Custom Marker Icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Helper to calculate distance
const calculateTotalDistance = (points: LatLngExpression[]) => {
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = L.latLng(points[i]);
        const p2 = L.latLng(points[i + 1]);
        total += p1.distanceTo(p2);
    }
    return (total / 1000).toFixed(2); // km
};

function MapEvents({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
    useMapEvents({
        click: onMapClick,
    });
    return null;
}

interface RouteMapProps {
    isRunning: boolean;
    onDistanceUpdate?: (dist: number) => void;
}

export default function RouteMap({ isRunning, onDistanceUpdate }: RouteMapProps) {
    // Default to San Francisco
    const [center, setCenter] = useState<LatLngExpression>([37.7749, -122.4194]);
    const [markers, setMarkers] = useState<LatLngExpression[]>([]);
    const [distance, setDistance] = useState("0.00");
    const [routeGeometry, setRouteGeometry] = useState<LatLngExpression[]>([]); // Dense path
    const [remainingRoute, setRemainingRoute] = useState<LatLngExpression[]>([]); // Dense path for sim
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setCenter([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, []);

    // Fetch Route from OSRM when markers change
    useEffect(() => {
        const fetchRoute = async () => {
            if (markers.length < 2) {
                setRouteGeometry([]);
                return;
            }

            setIsLoadingRoute(true);
            try {
                // Construct coordinates string for OSRM: lon,lat;lon,lat...
                const coordsString = markers.map(m => {
                    const latLng = L.latLng(m);
                    return `${latLng.lng},${latLng.lat}`;
                }).join(';');

                // Verify coordsString is valid
                if(!coordsString) return;

                const response = await fetch(`https://router.project-osrm.org/route/v1/foot/${coordsString}?overview=full&geometries=geojson`);
                if (!response.ok) throw new Error('Failed to fetch route');
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    // OSRM returns GeoJSON coordinates [lng, lat], Leaflet needs [lat, lng]
                    const latLngs = route.geometry.coordinates.map((idx: number[]) => L.latLng(idx[1], idx[0]));
                    setRouteGeometry(latLngs);
                    
                    const distKm = (route.distance / 1000).toFixed(2);
                    setDistance(distKm);
                    if (onDistanceUpdate) onDistanceUpdate(parseFloat(distKm));
                }
            } catch (error) {
                console.error("OSRM Fetch Error:", error);
                // Fallback to straight lines if API fails
                setRouteGeometry([...markers]);
                const dist = calculateTotalDistance(markers);
                setDistance(dist);
                if (onDistanceUpdate) onDistanceUpdate(parseFloat(dist));
            } finally {
                setIsLoadingRoute(false);
            }
        };

        if(!isRunning) {
            fetchRoute();
        }
    }, [markers, isRunning]);

    // Initialize remaining route for simulation
    useEffect(() => {
        if (isRunning && routeGeometry.length > 0) {
            setRemainingRoute([...routeGeometry]);
        }
    }, [isRunning, routeGeometry]);

    // Sync remaining distance during simulation
    useEffect(() => {
        if (isRunning && onDistanceUpdate) {
            // Calculate distance of remaining path
            // For a dense path, this is heavy. 
            // Optimization: Approximate or Calculate once and subtract or recalculate only 'remaining' part
            const remDist = calculateTotalDistance(remainingRoute);
            onDistanceUpdate(parseFloat(remDist));
        }
    }, [remainingRoute, isRunning]);

    // Simulation: "Run" the route (Dense Path Vanishing)
    useEffect(() => {
        if (!isRunning || remainingRoute.length === 0) return;

        const interval = setInterval(() => {
            setRemainingRoute(prev => {
                if (prev.length <= 1) {
                    clearInterval(interval);
                    return prev;
                }
                // Determine how many points to remove to simulate speed.
                // OSRM points can be close or far.
                // Let's remove chunks based on index for smoother "vanishing" animation than 1 point
                // Remove 2-3 points per tick for visible progress on dense routes
                const STEP = 2; 
                return prev.slice(STEP);
            });
        }, 1000); 

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (isRunning || isLoadingRoute) return; 
        setMarkers(prev => [...prev, e.latlng]);
        // The effect will trigger fetchRoute
    };

    const handleClear = () => {
        setMarkers([]);
        setRouteGeometry([]);
        setDistance("0.00");
        if (onDistanceUpdate) onDistanceUpdate(0);
    };

    const handleUndo = () => {
        setMarkers(prev => prev.slice(0, -1));
        // The effect will trigger fetchRoute
    };

    const handleSave = () => {
        if (markers.length < 2) {
            toast.error("Plot a route with at least 2 points!");
            return;
        }
        toast.success(`Route saved! Distance: ${distance} km`);
    };

    const handleDragEnd = (index: number, e: L.DragEndEvent) => {
        if (isRunning) return;
        const marker = e.target;
        const position = marker.getLatLng();
        const newMarkers = [...markers];
        newMarkers[index] = position;
        setMarkers(newMarkers);
    };

    return (
        <div className="w-full h-full relative group">
            <MapContainer center={center} zoom={13} zoomControl={false} style={{ height: "100%", width: "100%", zIndex: 0 }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {!isRunning && <MapEvents onMapClick={handleMapClick} />}
                
                {/* Markers (User Waypoints) */}
                {markers.map((position, idx) => (
                    <Marker 
                        key={`marker-${idx}`} 
                        position={position} 
                        icon={icon} 
                        draggable={!isRunning}
                        eventHandlers={{
                            dragend: (e) => handleDragEnd(idx, e),
                        }}
                    />
                ))}
                
                {/* Route Path (Polyline) */}
                {/* Show simulated remaining route when running, else show full planned route */}
                {(isRunning ? remainingRoute : routeGeometry).length > 1 && (
                     <Polyline 
                        positions={isRunning ? remainingRoute : routeGeometry} 
                        color={isRunning ? "#b91c1c" : "#06b6d4"} 
                        weight={4} 
                        opacity={0.8} 
                        dashArray="10, 10" 
                    />
                )}

                {isLoadingRoute && (
                     <div className="absolute top-4 right-4 z-[1000] bg-black/60 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold font-mono animate-pulse">
                        Solving Route...
                    </div>
                )}
            </MapContainer>

            {/* Controls Overlay - Hidden when Running */}
            {!isRunning && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-4 w-[90%] max-w-md">
                    
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-full flex justify-between items-center shadow-2xl">
                        <div>
                            <div className="text-zinc-400 text-xs uppercase tracking-widest font-medium">Total Distance</div>
                            <div className="text-3xl font-bold text-white font-mono">{distance} <span className="text-sm text-zinc-500 font-sans">km</span></div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={handleUndo}
                                disabled={markers.length === 0}
                                className="p-3 hover:bg-white/10 rounded-xl text-zinc-300 transition-colors disabled:opacity-50"
                                title="Undo last point"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleClear}
                                disabled={markers.length === 0}
                                className="p-3 hover:bg-white/10 rounded-xl text-red-400 transition-colors disabled:opacity-50"
                                title="Clear all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <GradientButton 
                        variant="cyan" 
                        className="w-full shadow-lg shadow-cyan-500/20"
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Route
                    </GradientButton>
                </div>
            )}
            
            {/* Instructions Hint */}
            {!isRunning && markers.length === 0 && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[500] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-zinc-300 text-sm animate-pulse pointer-events-none">
                    Click anywhere to start plotting your route
                </div>
            )}
        </div>
    );
}
