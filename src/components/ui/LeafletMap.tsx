"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
    center: [number, number];
    zoom: number;
    mainProperty: { lat: number; lng: number; name: string };
    neighbors: { lat: number; lng: number; name: string; slug: string }[];
}

const LeafletMap = ({ center, zoom, mainProperty, neighbors }: LeafletMapProps) => {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", zIndex: 0 }} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Abstract location for main property: Circle */}
            <Circle
                center={[mainProperty.lat, mainProperty.lng]}
                pathOptions={{ fillColor: '#3b82f6', color: '#3b82f6', fillOpacity: 0.2 }}
                radius={300} // 300 meters radius
            >
                <Popup>
                    Approximate location of {mainProperty.name}
                </Popup>
            </Circle>

            {/* Markers for neighbors */}
            {neighbors.map((neighbor, idx) => (
                <Marker key={idx} position={[neighbor.lat, neighbor.lng]}>
                    <Popup>
                        <a href={`/homes/${neighbor.slug}`} className="font-bold text-blue-600 hover:underline">
                            {neighbor.name}
                        </a>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default LeafletMap;
