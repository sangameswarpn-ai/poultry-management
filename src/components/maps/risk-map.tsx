'use client';

import { useEffect, useRef, useState } from 'react';
import { mockFarms } from '@/mock-data';

interface RiskMapProps {
  filterRisk?: string;
  showBuffers?: boolean;
  simMortality?: number;
  simCompliance?: number;
  highlightClusters?: any[];
  diseaseReports?: any[];
}

export default function RiskMap({
  filterRisk = 'ALL',
  showBuffers = false,
  simMortality = 20,
  simCompliance = 92,
  highlightClusters = [],
  diseaseReports = []
}: RiskMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{ markers: any; buffers: any } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 1. Initialize Leaflet Map once on Component Mount
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

      // If map was somehow already initialized in this ref container, do not initialize again
      if (mapInstanceRef.current) return;

      // Initialize map centering around Namakkal (Tamil Nadu)
      mapInstance = L.map(mapRef.current!).setView([11.2189, 78.1672], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance);

      // Create Layer Groups and attach to map instance
      const bufferGroup = L.layerGroup().addTo(mapInstance);
      const markerGroup = L.layerGroup().addTo(mapInstance);

      layersRef.current = {
        markers: markerGroup,
        buffers: bufferGroup
      };

      mapInstanceRef.current = mapInstance;
      setMapLoaded(true);
    }).catch(err => console.error('Leaflet load error:', err));

    // Cleanup map instance on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersRef.current = null;
      }
    };
  }, []);

  // 2. Redraw map markers and containment buffers when filter state/sliders update
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !layersRef.current) return;

    import('leaflet').then((L) => {
      const { markers, buffers } = layersRef.current!;

      // Clear layers from previous renders to avoid duplicate rendering
      markers.clearLayers();
      buffers.clearLayers();

      // Redraw farms with updated simulation parameters
      mockFarms.forEach((farm) => {
        let activeRisk = farm.riskLevel;
        let activeCompliance = farm.biosecurityScore;
        let activeMortality = farm.mortalityCount;

        // Apply sliders parameters to Farm-1 (Sri Murugan)
        if (farm.id === 'frm-1') {
          activeCompliance = simCompliance;
          activeMortality = simMortality;
          
          // Compute simulated risk index
          const riskIndex = (activeMortality * 2.5) + (100 - activeCompliance);
          if (riskIndex >= 70) activeRisk = 'CRITICAL';
          else if (riskIndex >= 45) activeRisk = 'HIGH';
          else if (riskIndex >= 25) activeRisk = 'MEDIUM';
          else activeRisk = 'LOW';
        }

        // Apply risk level filter selection
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

        // Draw containment buffer zones if active
        if (showBuffers && (activeRisk === 'CRITICAL' || activeRisk === 'HIGH')) {
          L.circle([farm.lat, farm.lng], {
            radius: 3500, // 3.5 km ring
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: '5, 5'
          }).addTo(buffers);
        }

        // Draw farm circle marker dot
        L.circleMarker([farm.lat, farm.lng], {
          radius: 9,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        })
          .addTo(markers)
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

      // Draw custom disease reports
      if (diseaseReports && diseaseReports.length > 0) {
        diseaseReports.forEach((rep: any) => {
          L.circleMarker([rep.lat, rep.lng], {
            radius: 6,
            fillColor: '#8b5cf6', // purple-500
            color: '#ffffff',
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.9,
          })
            .addTo(markers)
            .bindPopup(
              `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
                <b style="font-size:12px; display:block; margin-bottom:4px; color:#4c1d95;">Symptom Report</b>
                <b>Location:</b> ${rep.village}<br/>
                <b>Symptoms:</b> ${rep.symptoms.join(', ')}<br/>
                <b>Status:</b> ${rep.status}<br/>
                <b>Date:</b> ${new Date(rep.date || Date.now()).toLocaleDateString()}
              </div>`
            );
        });
      }

      // Draw outbreak clusters
      if (highlightClusters && highlightClusters.length > 0) {
        highlightClusters.forEach((cl: any) => {
          L.circle([cl.lat, cl.lng], {
            radius: 5000, // 5km radius zone
            color: '#ef4444', // red-500
            fillColor: '#ef4444',
            fillOpacity: 0.18,
            weight: 1.5,
            dashArray: '6, 6'
          })
            .addTo(buffers)
            .bindPopup(
              `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
                <b style="font-size:12px; display:block; margin-bottom:4px; color:#991b1b;">⚠️ OUTBREAK CLUSTER: ${cl.id}</b>
                <b>Risk Level:</b> <span style="color:#ef4444; font-weight:bold;">${cl.riskLevel} (${cl.riskScore}/100)</span><br/>
                <b>Status:</b> <b>${cl.status}</b><br/>
                <b>Affected Villages:</b> ${cl.villages.join(', ')}<br/>
                <b>Total Deaths:</b> ${cl.mortalityCount}<br/>
                <b>Total Sick:</b> ${cl.sickCount}
              </div>`
            );
        });
      }
    }).catch(err => console.error('Leaflet layer drawing error:', err));
  }, [mapLoaded, filterRisk, showBuffers, simMortality, simCompliance, highlightClusters, diseaseReports]);

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
