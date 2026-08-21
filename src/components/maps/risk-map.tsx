'use client';

import { useEffect, useRef, useState } from 'react';
import { mockFarms } from '@/mock-data';

export default function RiskMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let mapInstance: any = null;

    // Load Leaflet dynamically to avoid SSR document exceptions
    import('leaflet').then((L) => {
      // Load Leaflet CSS dynamically
      const linkId = 'leaflet-css';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Initialize map centering around Namakkal (Tamil Nadu)
      mapInstance = L.map(mapRef.current!).setView([11.2189, 78.1672], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance);

      // Place circle markers for all 15 farms
      mockFarms.forEach((farm) => {
        const markerColor =
          farm.riskLevel === 'CRITICAL'
            ? '#ef4444' // Red
            : farm.riskLevel === 'HIGH'
            ? '#f97316' // Orange
            : farm.riskLevel === 'MEDIUM'
            ? '#eab308' // Yellow
            : '#22c55e'; // Green

        L.circleMarker([farm.lat, farm.lng], {
          radius: 8,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .addTo(mapInstance)
          .bindPopup(
            `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
              <b style="font-size:12px; display:block; margin-bottom:4px; color:var(--foreground);">${farm.name}</b>
              <b>Farmer:</b> ${farm.farmerName}<br/>
              <b>District:</b> ${farm.district}<br/>
              <b>Risk Level:</b> <span style="color:${markerColor}; font-weight:bold;">${farm.riskLevel}</span><br/>
              <b>Biosecurity:</b> ${farm.biosecurityScore}%<br/>
              <b>Mortality:</b> ${farm.mortalityCount} birds
            </div>`
          );
      });

      setMapLoaded(true);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-full bg-secondary/30" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/85 text-xs text-muted-foreground animate-pulse">
          Initializing Spatial Mapping Grid...
        </div>
      )}
    </div>
  );
}
