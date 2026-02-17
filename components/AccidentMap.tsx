import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Accident, RoadUserType } from '../types';
import { FLANDERS_CENTER, DEFAULT_ZOOM } from '../constants';

// Fix for default Leaflet icon assets not loading in React
const createCustomIcon = (type: RoadUserType) => {
  const color = type === RoadUserType.CYCLIST ? '#ef4444' : '#f97316'; // Red for bike, Orange for pedestrian
  
  // Create an SVG string
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>`;

  return new L.DivIcon({
    className: 'custom-pin',
    html: `<div style="width: 32px; height: 32px; filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07));">${svg}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface AccidentMapProps {
  accidents: Accident[];
  onSelectAccident: (accident: Accident) => void;
  selectedAccidentId: string | null;
}

// Component to handle map flying when selection changes
const MapUpdater = ({ selectedAccident }: { selectedAccident: Accident | undefined }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedAccident) {
      map.flyTo([selectedAccident.coordinates.lat, selectedAccident.coordinates.lng], 14, {
        duration: 1.5
      });
    }
  }, [selectedAccident, map]);
  return null;
};

const AccidentMap: React.FC<AccidentMapProps> = ({ accidents, onSelectAccident, selectedAccidentId }) => {
  const selectedAccident = accidents.find(a => a.id === selectedAccidentId);

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={FLANDERS_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="outline-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater selectedAccident={selectedAccident} />

        {accidents.map((accident) => (
          <Marker
            key={accident.id}
            position={[accident.coordinates.lat, accident.coordinates.lng]}
            icon={createCustomIcon(accident.type)}
            eventHandlers={{
              click: () => onSelectAccident(accident),
            }}
          >
            <Popup className="font-sans">
              <div className="p-1">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{accident.locationName}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
                  accident.type === RoadUserType.CYCLIST 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {accident.type}
                </span>
                <p className="text-gray-600 text-xs mb-2">{accident.date}</p>
                <button 
                  onClick={() => onSelectAccident(accident)}
                  className="text-blue-600 text-xs font-semibold hover:underline"
                >
                  Bekijk details & analyse &rarr;
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend overlay */}
      <div className="absolute bottom-6 right-6 bg-white p-3 rounded-lg shadow-lg z-[1000] text-sm border border-gray-100">
        <h4 className="font-semibold text-gray-700 mb-2">Legende</h4>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Fietser</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-600">Voetganger</span>
        </div>
      </div>
    </div>
  );
};

export default AccidentMap;
