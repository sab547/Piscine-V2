'use client';

import { useEffect, useRef, useState } from 'react';
import L, { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Pool {
  id: string;
  nom: string;
  latitude: number;
  longitude: number;
  lastVisit?: string;
  status: 'recent' | 'warning' | 'alert';
}

interface PoolMapProps {
  pools: Pool[];
  onPoolSelect?: (pool: Pool) => void;
}

export default function PoolMap({ pools, onPoolSelect }: PoolMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !pools.length) return;

    // Initialize map (centered on PACA region, France)
    const map = L.map(mapRef.current).setView([43.9, 6.6], 8);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Color map for status
    const statusColors = {
      recent: '#10b981', // green
      warning: '#f59e0b', // amber
      alert: '#ef4444', // red
    };

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each pool
    const bounds = new LatLngBounds([]);

    pools.forEach(pool => {
      if (!pool.latitude || !pool.longitude) return;

      const color = statusColors[pool.status];

      // Create custom HTML icon
      const html = `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
        </div>
      `;

      const marker = L.marker([pool.latitude, pool.longitude], {
        icon: L.divIcon({
          html,
          iconSize: [32, 32],
          className: 'pool-marker',
        }),
      }).addTo(map);

      // Add popup with pool info
      const popupContent = `
        <div style="font-family: Arial, sans-serif;">
          <strong>${pool.nom}</strong><br/>
          <small style="color: #666;">
            Statut: <span style="color: ${color}; font-weight: bold;">
              ${pool.status === 'recent' ? '✓ Récent' : pool.status === 'warning' ? '⚠ Attention' : '⚠ Alerte'}
            </span>
          </small>
          ${pool.lastVisit ? `<br/><small style="color: #999;">Dernier passage: ${new Date(pool.lastVisit).toLocaleDateString('fr-FR')}</small>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);

      // Handle click
      marker.on('click', () => {
        if (onPoolSelect) {
          onPoolSelect(pool);
        }
      });

      markersRef.current.push(marker);
      bounds.extend([pool.latitude, pool.longitude]);
    });

    // Fit bounds if we have pools
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup handled on next effect run or unmount
    };
  }, [pools, onPoolSelect]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
    >
      {!pools.length && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-600">Aucune piscine à afficher</p>
        </div>
      )}
    </div>
  );
}
