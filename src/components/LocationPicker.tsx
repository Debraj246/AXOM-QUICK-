import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const HomeIcon = L.divIcon({
  className: 'home-marker',
  html: `<div class="w-8 h-8 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface LocationPickerProps {
  onLocationSelect: (latlng: { lat: number, lng: number }) => void;
  initialPos?: [number, number];
}

function LocationMarker({ onLocationSelect, initialPos }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>(initialPos || [26.3267, 91.0044]);
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect({ lat, lng });
    },
  });

  return (
    <Marker position={position} icon={HomeIcon} />
  );
}

export default function LocationPicker({ onLocationSelect, initialPos }: LocationPickerProps) {
  return (
    <div className="w-full h-64 rounded-3xl overflow-hidden border border-white/10 relative">
      <MapContainer 
        center={initialPos || [26.3267, 91.0044]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <LocationMarker onLocationSelect={onLocationSelect} initialPos={initialPos} />
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-[400] glass px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-emerald-400 border-emerald-500/20">
        <MapPin size={12} />
        TAP TO PIN LOCATION
      </div>
    </div>
  );
}
