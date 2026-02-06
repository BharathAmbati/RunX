"use client";

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RotateCcw, Save, Trash2 } from 'lucide-react';
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
    return total / 1000; // km
};

function MapEvents({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
    useMapEvents({
        click: onMapClick,
    });
    return null;
}

interface RouteMapProps {
    isRunning: boolean;
    isPaused?: boolean;
    onDistanceUpdate?: (dist: number) => void;
}

export default function RouteMap({ isRunning, isPaused = false, onDistanceUpdate }: RouteMapProps) {
    // Default to San Francisco
    const [center, setCenter] = useState<LatLngExpression>([37.7749, -122.4194]);
    const [markers, setMarkers] = useState<LatLngExpression[]>([]);
    const [distance, setDistance] = useState(0);
    const [routeGeometry, setRouteGeometry] = useState<LatLngExpression[]>([]); // Dense path
    const [remainingRoute, setRemainingRoute] = useState<LatLngExpression[]>([]); // Dense path for sim
    const [snappedPosition, setSnappedPosition] = useState<LatLngExpression | null>(null);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const watchIdRef = useRef<number | null>(null);
    const locationErrorShownRef = useRef(false);

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

                // Add timeout to prevent hanging
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(
                    `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${coordsString}?overview=full&geometries=geojson`,
                    { signal: controller.signal }
                );
                clearTimeout(timeoutId);

                if (!response.ok) throw new Error('Route API unavailable');
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    // OSRM returns GeoJSON coordinates [lng, lat], Leaflet needs [lat, lng]
                    const latLngs = route.geometry.coordinates.map((idx: number[]) => L.latLng(idx[1], idx[0]));
                    setRouteGeometry(latLngs);
                    
                    const distKm = route.distance / 1000;
                    setDistance(distKm);
                    if (onDistanceUpdate) onDistanceUpdate(distKm);
                }
            } catch (error) {
                console.warn("Route fetch failed, falling back to straight lines:", error);
                // Silently fallback to straight lines if API fails (network issues, timeout, etc.)
                setRouteGeometry([...markers]);
                const dist = calculateTotalDistance(markers);
                setDistance(dist);
                if (onDistanceUpdate) onDistanceUpdate(dist);
            } finally {
                setIsLoadingRoute(false);
            }
        };

        if(!isRunning) {
            fetchRoute();
        }
    }, [markers, isRunning, onDistanceUpdate]);

    // Initialize remaining route when run starts
    useEffect(() => {
        if (isRunning && routeGeometry.length > 0) {
            setRemainingRoute([...routeGeometry]);
        }
    }, [isRunning, routeGeometry]);

    // Track user position to update remaining distance while running
    useEffect(() => {
        if (!isRunning || isPaused) {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            return;
        }

        if (!navigator.geolocation) return;
        locationErrorShownRef.current = false;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                if (!routeGeometry || routeGeometry.length < 2) return;

                const current = L.latLng(pos.coords.latitude, pos.coords.longitude);
                const points = routeGeometry.map((p) => L.latLng(p));

                // Find nearest point index (sample to avoid heavy loops)
                const step = Math.max(1, Math.floor(points.length / 200));
                let nearestIndex = 0;
                let nearestDist = Infinity;
                for (let i = 0; i < points.length; i += step) {
                    const d = current.distanceTo(points[i]);
                    if (d < nearestDist) {
                        nearestDist = d;
                        nearestIndex = i;
                    }
                }

                // Refine locally around nearest
                const start = Math.max(0, nearestIndex - step);
                const end = Math.min(points.length - 1, nearestIndex + step);
                for (let i = start; i <= end; i += 1) {
                    const d = current.distanceTo(points[i]);
                    if (d < nearestDist) {
                        nearestDist = d;
                        nearestIndex = i;
                    }
                }

                const remaining = points.slice(nearestIndex);
                setRemainingRoute(remaining);
                setSnappedPosition(remaining[0] ?? null);

                let remainingMeters = 0;
                for (let i = 0; i < remaining.length - 1; i += 1) {
                    remainingMeters += remaining[i].distanceTo(remaining[i + 1]);
                }
                const remainingKm = remainingMeters / 1000;
                if (onDistanceUpdate) onDistanceUpdate(remainingKm);
            },
            () => {
                if (!locationErrorShownRef.current) {
                    toast.error("Enable location to track route progress.");
                    locationErrorShownRef.current = true;
                }
                // If location fails, keep existing remaining route
            },
            { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, [isRunning, isPaused, routeGeometry, onDistanceUpdate]);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (isRunning || isLoadingRoute) return; 
        setMarkers(prev => [...prev, e.latlng]);
        // The effect will trigger fetchRoute
    };

    const handleClear = () => {
        setMarkers([]);
        setRouteGeometry([]);
        setDistance(0);
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
        toast.success(`Route saved! Distance: ${distance.toFixed(2)} km`);
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

                {/* Snapped current position (while running) */}
                {isRunning && snappedPosition && (
                    <Marker position={snappedPosition} />
                )}
                
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
                            <div className="text-3xl font-bold text-white font-mono">{distance.toFixed(2)} <span className="text-sm text-zinc-500 font-sans">km</span></div>
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
