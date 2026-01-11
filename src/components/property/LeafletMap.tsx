"use client";


import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
// // import L from 'leaflet'; // Dynamic import instead

// We can't use L.icon at top level because L requires window
// We'll move custom icon logic to inside component if needed


// Component to handle map center updates when props change
function MapController({ center, onMoveEnd }: { center: [number, number], onMoveEnd: (lat: number, lng: number) => void }) {
    const map = useMap();

    // Fly to new center when prop changes (from search)
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);

    // Handle map move end (for getting new coordinates)
    useMapEvents({
        moveend: () => {
            const { lat, lng } = map.getCenter();
            onMoveEnd(lat, lng);
        }
    });

    return null;
}

interface InteractiveMapProps {
    center: [number, number]; // [lat, lng]
    zoom?: number;
    onCenterChange: (lat: number, lng: number) => void;
    mapType?: 'roadmap' | 'satellite';
}

export default function InteractiveMap({ center, zoom = 15, onCenterChange, mapType = 'roadmap' }: InteractiveMapProps) {

    useEffect(() => {
        // Initialize Leaflet stuff ensuring window exists
        (async function initLeaflet() {
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;

            const L = (await import('leaflet')).default;
            // @ts-ignore
            await import('leaflet/dist/leaflet.css');

            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });
        })();
    }, []);

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false} // We can add custom zoom control if needed, or stick to default
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={mapType === 'roadmap'
                    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" // Satellite alternative
                }
            />

            <MapController center={center} onMoveEnd={onCenterChange} />

            {/* We don't render a Marker here because we want a "Fixed Center Pin" overlay in the parent component for better UX (like Uber) */}
        </MapContainer>
    );
}
