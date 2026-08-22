'use client';

import { useEffect, useRef, useState } from 'react';
import { mockFarms } from '@/mock-data';

interface RiskMapProps {
  filterRisk?: string;
  showBuffers?: boolean;
  simMortality?: number;
  simCompliance?: number;
}

export default function RiskMap({
  filterRisk = 'ALL',
  showBuffers = false,
  simMortality = 20, // defaults
  simCompliance = 92
}: RiskMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let mapInstance: any = null;

    // Load Leaflet dynamically to avoid SSR exceptions
    import('leaflet').then((L) => {
      // Load Leaflet CSS dynamically if not present
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

      // Create a layer group for outbreak buffer rings
      const bufferLayerGroup = L.layerGroup().addTo(mapInstance);
      const markerLayerGroup = L.layerGroup().addTo(mapInstance);

      // Draw farms
      mockFarms.forEach((farm) => {
        // Apply sandbox simulation logic for the active farm (frm-1)
        let activeRisk = farm.riskLevel;
        let activeCompliance = farm.biosecurityScore;
        let activeMortality = farm.mortalityCount;

        if (farm.id === 'frm-1') {
          activeCompliance = simCompliance;
          activeMortality = simMortality;
          
          // Re-calculate mock risk score on the fly
          const riskIndex = (activeMortality * 2.5) + (100 - activeCompliance);
          if (riskIndex >= 70) activeRisk = 'CRITICAL';
          else if (riskIndex >= 45) activeRisk = 'HIGH';
          else if (riskIndex >= 25) activeRisk = 'MEDIUM';
          else activeRisk = 'LOW';
        }

        // Apply risk filters
        if (filterRisk !== 'ALL' && activeRisk !== filterRisk) {
          return;
        }

        const markerColor =
          activeRisk === 'CRITICAL'
            ? '#ef4444' // Red
            : activeRisk === 'HIGH'
            ? '#f97316' // Orange
            : activeRisk === 'MEDIUM'
            ? '#eab308' // Yellow
            : '#22c55e'; // Green

        // Render outbreak zone buffers (5km radius circle rings) around Critical and High nodes
        if (showBuffers && (activeRisk === 'CRITICAL' || activeRisk === 'HIGH')) {
          L.circle([farm.lat, farm.lng], {
            radius: 3500, // 3.5 Kilometers radius
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.15,
            weight: 1.5,
            dashArray: '5, 5'
          }).addTo(bufferLayerGroup);
        }

        // Draw farm marker dot
        L.circleMarker([farm.lat, farm.lng], {
          radius: 9,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        })
          .addTo(markerLayerGroup)
          .bindPopup(
            `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
              <b style="font-size:12px; display:block; margin-bottom:4px; color:#062f22;">${farm.name}</b>
              <b>Farmer:</b> ${farm.farmerName}<br/>
              <b>District:</b> ${farm.district}<br/>
              <b>Risk Index Status:</b> <span style="color:${markerColor}; font-weight:bold;">${activeRisk}</span><br/>
              <b>Biosecurity Compliance:</b> ${activeCompliance}%<br/>
              <b>Flock Mortality:</b> ${activeMortality} birds
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
  }, [filterRisk, showBuffers, simMortality, simCompliance]);

  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-full bg-secondary/30" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/85 text-xs text-muted-foreground animate-pulse">
          Initializing Spatial GIS Outbreak Map...
        </div>
      )}
    </div>
  );
}
