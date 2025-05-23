'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locationData from '@/data/locations.json';

// 마커 아이콘 설정
const refillIcon = new L.Icon({
  iconUrl: '/icons/refill-marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const recycleIcon = new L.Icon({
  iconUrl: '/icons/recycle-marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Location {
  id: number;
  name: string;
  type: 'refill' | 'recycle';
  address: string;
  description: string;
  coordinates: [number, number];
  operatingHours: string;
  contact: string;
}

interface LocationMapProps {
  type?: 'refill' | 'recycle' | 'all';
}

const LocationMap: React.FC<LocationMapProps> = ({ type = 'all' }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [center, setCenter] = useState<[number, number]>([36.635, 127.47]); // 청주 중심 좌표

  useEffect(() => {
    // 위치 타입에 따라 필터링
    const filteredLocations = type === 'all'
      ? locationData.locations
      : locationData.locations.filter(loc => loc.type === type);
    
    setLocations(filteredLocations);

    // 필터링된 위치가 있으면 첫 번째 위치로 중심점 이동
    if (filteredLocations.length > 0) {
      setCenter(filteredLocations[0].coordinates);
    }
  }, [type]);

  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            icon={location.type === 'refill' ? refillIcon : recycleIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-1">{location.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{location.description}</p>
                <p className="text-sm mb-1">
                  <span className="font-medium">주소:</span> {location.address}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">운영시간:</span> {location.operatingHours}
                </p>
                <p className="text-sm">
                  <span className="font-medium">연락처:</span> {location.contact}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationMap; 