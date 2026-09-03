import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  restaurantLat: number;
  restaurantLng: number;
  restaurantName: string;
  userLat: number;
  userLng: number;
  userName: string;
  partnerLat?: number;
  partnerLng?: number;
  isOutForDelivery?: boolean;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  restaurantLat,
  restaurantLng,
  restaurantName,
  userLat,
  userLng,
  userName,
  partnerLat,
  partnerLng,
  isOutForDelivery,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const partnerMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const restCoord: [number, number] = [restaurantLat, restaurantLng];
    const userCoord: [number, number] = [userLat, userLng];

    // Create Leaflet Map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Tile layer (CartoDB Positron / OSM clean aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom Icon Helpers
    const createCustomIcon = (html: string, className = '') => {
      return L.divIcon({
        html,
        className,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });
    };

    // 1. Restaurant Marker (Amber/Orange)
    const restIconHtml = `
      <div style="background: linear-gradient(135deg, #f97316, #ef4444); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); border: 2px solid white;">
        <span style="font-size: 16px;">🍳</span>
      </div>
    `;
    const restMarker = L.marker(restCoord, {
      icon: createCustomIcon(restIconHtml),
    }).addTo(map);
    restMarker.bindPopup(`<b>${restaurantName}</b><br/>Order pick-up location`);

    // 2. User Delivery Marker (Emerald Green with pulsing wave)
    const userIconHtml = `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(16, 185, 129, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="background: #10b981; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); border: 2px solid white; z-index: 2;">
          <span style="font-size: 15px;">📍</span>
        </div>
      </div>
    `;
    const userMarker = L.marker(userCoord, {
      icon: createCustomIcon(userIconHtml),
    }).addTo(map);
    userMarker.bindPopup(`<b>${userName}</b><br/>Your delivery location`);

    // 3. Polyline between restaurant and user
    const routeCoords: [number, number][] = [
      restCoord,
      // mid-point slight curve for realistic street route
      [
        (restCoord[0] + userCoord[0]) / 2 + 0.0015,
        (restCoord[1] + userCoord[1]) / 2 - 0.001,
      ],
      userCoord,
    ];

    L.polyline(routeCoords, {
      color: '#f97316',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 8',
    }).addTo(map);

    // 4. Delivery Partner Marker (Electric Blue with Scooter)
    const initPartnerLat = partnerLat || (restCoord[0] + userCoord[0]) / 2;
    const initPartnerLng = partnerLng || (restCoord[1] + userCoord[1]) / 2;

    const partnerIconHtml = `
      <div style="background: #2563eb; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.5); border: 2.5px solid white; animation: bounce 2s infinite;">
        <span style="font-size: 18px;">🛵</span>
      </div>
    `;
    const partnerMarker = L.marker([initPartnerLat, initPartnerLng], {
      icon: createCustomIcon(partnerIconHtml),
      zIndexOffset: 1000,
    }).addTo(map);
    partnerMarker.bindPopup('<b>Delivery Partner</b><br/>On the way with your food!');
    partnerMarkerRef.current = partnerMarker;

    // Fit map bounds to view all points comfortably
    const bounds = L.latLngBounds([restCoord, userCoord, [initPartnerLat, initPartnerLng]]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [restaurantLat, restaurantLng, restaurantName, userLat, userLng, userName, partnerLat, partnerLng]);

  // Smoothly move partner marker if out for delivery
  useEffect(() => {
    if (!isOutForDelivery || !partnerMarkerRef.current || !mapInstanceRef.current) return;

    let progress = 0.2;
    const interval = setInterval(() => {
      progress += 0.04;
      if (progress >= 0.95) {
        clearInterval(interval);
        return;
      }
      // interpolate between restaurant and user coordinates
      const curLat = restaurantLat + (userLat - restaurantLat) * progress;
      const curLng = restaurantLng + (userLng - restaurantLng) * progress;

      if (partnerMarkerRef.current) {
        partnerMarkerRef.current.setLatLng([curLat, curLng]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isOutForDelivery, restaurantLat, restaurantLng, userLat, userLng]);

  return (
    <div className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
