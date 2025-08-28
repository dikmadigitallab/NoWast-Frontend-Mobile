import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

interface Location {
  latitude: number | string; // Aceita ambos number e string
  longitude: number | string;
}

type MapScreenProps = {
  location: Location | null;
};

// Função para converter valores para número
const parseCoordinate = (value: number | string): number => {
  if (typeof value === 'string') {
    return parseFloat(value);
  }
  return value;
};

const MapScreen = ({ location }: MapScreenProps) => {
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (location && mapRef.current) {
      const lat = parseCoordinate(location.latitude);
      const lng = parseCoordinate(location.longitude);

      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  }, [location]);

  // Região inicial padrão
  const defaultRegion: Region = {
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Determinar a região inicial convertendo para número se necessário
  const initialRegion: Region = location
    ? {
      latitude: parseCoordinate(location.latitude),
      longitude: parseCoordinate(location.longitude),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }
    : defaultRegion;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: parseCoordinate(location.latitude),
              longitude: parseCoordinate(location.longitude),
            }}
          />
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});