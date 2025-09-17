import React, { useEffect, useRef, useState } from 'react';
import { IssueReport } from '../../types';

// Add google to window type to fix TypeScript errors related to missing Google Maps type definitions.
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapsStepProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<IssueReport>) => void;
  location?: { lat: number; lng: number };
}

const GoogleMapsStep: React.FC<GoogleMapsStepProps> = ({ onNext, onBack, onUpdate, location }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstance = useRef<any | null>(null);
  const markerInstance = useRef<any | null>(null);
  const autocompleteInstance = useRef<any | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocationSet, setIsLocationSet] = useState(!!location);

  const setMarkerAndLocation = (latLng: any, map: any) => {
    const clickedLocation = { lat: latLng.lat(), lng: latLng.lng() };
    if (markerInstance.current) {
      markerInstance.current.setPosition(clickedLocation);
    } else {
      markerInstance.current = new window.google.maps.Marker({
        position: clickedLocation,
        map: map,
        animation: window.google.maps.Animation.DROP,
      });
    }
    onUpdate({ location: clickedLocation });
    setIsLocationSet(true);
  };

  useEffect(() => {
    if (mapRef.current && !mapInstance.current && window.google) {
      const defaultCenter = { lat: 28.6139, lng: 77.2090 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: location || defaultCenter,
        zoom: location ? 15 : 10,
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        zoomControl: true,
        styles: [ // Custom dark mode map styles
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
          { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
          { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
          { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
          { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
          { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
          { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
          { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
          { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
          { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
        ],
      });
      mapInstance.current = map;
      setIsMapReady(true);
      
      map.addListener('click', (e: any) => {
        if (e.latLng) {
          setMarkerAndLocation(e.latLng, map);
        }
      });

      if (location) {
        markerInstance.current = new window.google.maps.Marker({
          position: location,
          map: map,
        });
      }
    }
  }, [onUpdate, location]);

  useEffect(() => {
    if (isMapReady && searchInputRef.current && !autocompleteInstance.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ["geometry", "name"],
        types: ["address"],
      });
      autocompleteInstance.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const map = mapInstance.current;
          map.setCenter(place.geometry.location);
          map.setZoom(17);
          setMarkerAndLocation(place.geometry.location, map);
        } else {
          window.alert("Could not find location: '" + place.name + "'");
        }
      });
    }
  }, [isMapReady]);

  return (
    <div className="animate-fade-in-up text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Pinpoint the Location</h2>
      <p className="text-gray-400 mb-6">Search for an address or click on the map to mark the location.</p>
      
      <div className="relative mb-4">
        <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for an address..."
            className="w-full px-4 py-3 bg-secondary-900 border border-secondary-700 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
        />
      </div>
      
      <div className="w-full h-80 bg-secondary-900 rounded-lg overflow-hidden relative border border-secondary-700">
        <div ref={mapRef} className="w-full h-full" />
        {!isMapReady && <div className="absolute inset-0 flex items-center justify-center bg-secondary-900"><p>Loading Map...</p></div>}
      </div>

       <div className="mt-8 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isLocationSet}
          className="bg-gradient-to-r from-primary-400 to-primary-600 bg-[length:200%_auto] text-secondary-950 font-bold py-3 px-8 rounded-lg shadow-lg hover:animate-gradient-shift transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLocationSet ? 'Next' : 'Pin a Location'}
        </button>
      </div>
    </div>
  );
};

export default GoogleMapsStep;