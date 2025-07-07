import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
type Location = {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
};

type MapScreenProps = {
  location: any;
  showMap: () => void;
};
const MapScreen = ({ location, showMap }: MapScreenProps) => {
  // const [selectedLocation, setSelectedLocation] = useState<Location | null>(
  //   location
  // );

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  }, [location]);

  const initialRegion: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Marker
          key={location.destino_final}
          coordinate={{
            latitude: location?.latitude,
            longitude: location?.longitude,
          }}
        />
      </MapView>

      {/* {selectedLocation && (
        <View style={styles.containerinfoBox}>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
            }}
            onPress={() => {
              setSelectedLocation(null);
              showMap();
            }}
          >
            <AntDesign name="closecircle" size={30} color="red" />
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.title}>{selectedLocation.title}</Text>
            <Text>{selectedLocation.description}</Text>
          </View>
        </View>
      )}
        */}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
  },
  map: {
    width: "100%",
    height: "100%",
  },
  containerinfoBox: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    gap: 10,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
