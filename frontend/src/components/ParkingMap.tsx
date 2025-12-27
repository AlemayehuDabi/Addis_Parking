import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ParkingLot } from '@/types/parking';
import { motion } from 'framer-motion';

interface ParkingMapProps {
  lots: ParkingLot[];
  selectedLot: ParkingLot | null;
  onSelectLot: (lot: ParkingLot) => void;
  mapboxToken?: string;
}

export const ParkingMap = ({ lots, selectedLot, onSelectLot, mapboxToken }: ParkingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Fallback to a placeholder map if no token
  const hasToken = mapboxToken && mapboxToken.length > 0;

  useEffect(() => {
    if (!mapContainer.current || !hasToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [38.7636, 9.0054], // Addis Ababa
      zoom: 13,
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    map.current.on('load', () => {
      lots.forEach((lot) => {
        const el = document.createElement('div');
        el.className = 'parking-marker';
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="absolute h-12 w-12 rounded-full ${
              lot.availableSlots > 10 ? 'bg-success/30' : lot.availableSlots > 0 ? 'bg-warning/30' : 'bg-destructive/30'
            } animate-ping"></div>
            <div class="relative h-10 w-10 rounded-full ${
              lot.availableSlots > 10 ? 'bg-success' : lot.availableSlots > 0 ? 'bg-warning' : 'bg-destructive'
            } flex items-center justify-center text-xs font-bold text-white shadow-lg">
              ${lot.availableSlots}
            </div>
          </div>
        `;

        el.addEventListener('click', () => onSelectLot(lot));

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lot.longitude, lot.latitude])
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [lots, hasToken, mapboxToken, onSelectLot]);

  // Fly to selected lot
  useEffect(() => {
    if (map.current && selectedLot) {
      map.current.flyTo({
        center: [selectedLot.longitude, selectedLot.latitude],
        zoom: 16,
        duration: 1500,
      });
    }
  }, [selectedLot]);

  if (!hasToken) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-secondary to-muted">
        {/* Stylized placeholder map */}
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 10}
                x2="100"
                y2={i * 10}
                stroke="currentColor"
                strokeWidth="0.2"
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 10}
                y1="0"
                x2={i * 10}
                y2="100"
                stroke="currentColor"
                strokeWidth="0.2"
              />
            ))}
          </svg>
        </div>

        {/* Lot markers */}
        {lots.map((lot, index) => (
          <motion.button
            key={lot.id}
            onClick={() => onSelectLot(lot)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`absolute flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 ${
              lot.availableSlots > 10
                ? 'bg-success'
                : lot.availableSlots > 0
                ? 'bg-warning'
                : 'bg-destructive'
            } ${selectedLot?.id === lot.id ? 'ring-4 ring-ring ring-offset-2 ring-offset-background' : ''}`}
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + (index % 2) * 30}%`,
            }}
            aria-label={`${lot.name}, ${lot.availableSlots} spots available`}
          >
            <span className="text-sm font-bold text-primary-foreground">
              {lot.availableSlots}
            </span>
          </motion.button>
        ))}

        {/* Map info overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-card rounded-lg p-3">
            <p className="text-center text-sm text-muted-foreground">
              📍 Addis Ababa, Ethiopia
            </p>
            <p className="mt-1 text-center text-xs text-muted-foreground/70">
              Tap a marker to view parking lot details
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
};
