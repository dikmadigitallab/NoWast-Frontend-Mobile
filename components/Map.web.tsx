import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

// Declarações de tipos para Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
    }
    
    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      addListener(eventName: string, handler: () => void): void;
    }
    
    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      disableDefaultUI?: boolean;
    }
    
    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map;
      icon?: string;
    }
    
    interface LatLng {
      lat(): number;
      lng(): number;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  }
}

export type LatLng = { latitude: number; longitude: number };
export type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

export type MapProps = {
  style?: StyleProp<ViewStyle>;
  initialRegion: Region;
  marker?: LatLng | null;
  markers?: Array<{
    id?: string | number;
    position: LatLng;
    image?: ImageSourcePropType;
    onPress?: () => void;
  }>;
};

export type MapHandle = {
  animateToRegion: (region: Region, durationMs?: number) => void;
};

const Map = forwardRef<MapHandle, MapProps>(({ style, initialRegion, marker, markers }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const multiMarkersRef = useRef<google.maps.Marker[]>([]);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region: Region) => {
      if (!mapRef.current) return;
      const center = { lat: region.latitude, lng: region.longitude };
      mapRef.current.setCenter(center);
      const zoom = regionToZoom(region.latitudeDelta);
      mapRef.current.setZoom(zoom);
    },
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    // Safeguard if google is not available
    if (typeof window === "undefined" || typeof window.google === "undefined" || !window.google?.maps) {
      console.warn("Google Maps API não está disponível");
      return;
    }
    const map = new window.google.maps.Map(containerRef.current, {
      center: { lat: initialRegion.latitude, lng: initialRegion.longitude },
      zoom: regionToZoom(initialRegion.latitudeDelta),
      disableDefaultUI: true,
    });
    mapRef.current = map;

    if (marker) {
      markerRef.current = new window.google.maps.Marker({
        position: { lat: marker.latitude, lng: marker.longitude },
        map,
      });
    }

    return () => {
      markerRef.current?.setMap(null);
      markerRef.current = null;
      // google maps cleans up when container is removed
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!marker) {
      markerRef.current?.setMap(null);
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        position: { lat: marker.latitude, lng: marker.longitude },
        map: mapRef.current,
      });
    } else {
      markerRef.current.setPosition({ lat: marker.latitude, lng: marker.longitude });
    }
  }, [marker]);

  useEffect(() => {
    if (!mapRef.current) return;
    // clear existing
    multiMarkersRef.current.forEach(m => m.setMap(null));
    multiMarkersRef.current = [];
    markers?.forEach(m => {
      const mk = new window.google.maps.Marker({
        position: { lat: m.position.latitude, lng: m.position.longitude },
        map: mapRef.current!,
        // icon mapping could be added here if needed
      });
      if (m.onPress) {
        mk.addListener("click", () => m.onPress && m.onPress());
      }
      multiMarkersRef.current.push(mk);
    });
  }, [markers]);

  return <div ref={containerRef} style={style as React.CSSProperties} />;
});

function regionToZoom(latitudeDelta: number): number {
  // Simple heuristic: smaller delta => higher zoom
  const zoom = Math.round(8 - Math.log2(latitudeDelta));
  return Math.max(1, Math.min(20, zoom));
}

export default Map;


