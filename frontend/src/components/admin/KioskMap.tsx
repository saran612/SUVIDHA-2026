'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix missing marker icons issue in leaflet with React
if (typeof window !== 'undefined') {
    const _0x1a = L.Icon.Default.prototype as any;
    delete _0x1a._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

const locs = ['Municipal Office', 'Railway Station', 'District Hospital', 'Commercial Hub', 'Bus Terminal', 'City Mall', 'Market Zone', 'Public Library', 'Civil Court'];

const kiosks = Array.from({ length: 42 }).map((_, i) => {
    const isOffline = i === 3 || i === 12 || i === 27 || i === 35;
    const isWarning = i % 9 === 0 && !isOffline;
    const status = isOffline ? 'Offline' : (isWarning ? 'Warning' : 'Online');

    // Spread markers somewhat randomly but consistently based on index
    const baseLat = 28.6139; // Central Delhi lat
    const baseLng = 77.2090; // Central Delhi lng

    // Math.sin/cos provides pseudo-random distribution around the center
    const latOffset = (Math.sin(i * 153.2) * 0.15);
    const lngOffset = (Math.cos(i * 245.7) * 0.15);

    return {
        id: `K-${(i + 1).toString().padStart(3, '0')}`,
        name: `${locs[i % locs.length]} - Zone ${Math.floor(i / locs.length) + 1}`,
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
        status: status
    };
});

export default function KioskMap() {
    return (
        <MapContainer
            center={[28.5800, 77.2200]}
            zoom={11}
            className="absolute inset-0 w-full h-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {kiosks.map(k => (
                <Marker key={k.id} position={[k.lat, k.lng]}>
                    <Popup>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold">{k.name}</span>
                            <span className={`text-xs font-black uppercase ${k.status === 'Online' ? 'text-emerald-600' : (k.status === 'Warning' ? 'text-amber-500' : 'text-rose-600')}`}>
                                {k.status}
                            </span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
