import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Region } from "react-native-maps";
// import { ocorrencias } from "../../../data";
import { IOcorrencias } from "../../../types/IOcorrencias";

const Mapa: React.FC = () => {

  const [selectedLocation, setSelectedLocation] = useState<IOcorrencias | null>(null);

  const initialRegion: Region = {
    latitude: -20.3155,
    longitude: -40.3128,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };


  const images = [
    require("../../../assets/pontos/nenhum.png"),
    require("../../../assets/pontos/leve.png"),
    require("../../../assets/pontos/grave.png"),
  ];


  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {/* {ocorrencias.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.localizacao.latitude,
              longitude: loc.localizacao.longitude,
            }}
            pinColor="red"
            onPress={() => setSelectedLocation(loc as any)}
          >
            <Image
              style={styles.markerImage}
              resizeMode="contain"
              source={getStatusImage(loc?.status) as never}
            />
          </Marker>
        ))} */}
      </MapView>

      {selectedLocation && (
        <View style={styles.infoBox}>
          <Image
            style={styles.image}
            source={selectedLocation?.foto[0]}
            resizeMode="cover"
          />
          <View style={styles.infoContent}>
            <View style={styles.row}>
              <Entypo name="calendar" size={15} color="black" />
              <Text style={styles.text}>
                {selectedLocation?.data} / {selectedLocation?.hora}
              </Text>
            </View>
            <View style={styles.row}>
              <FontAwesome name="user" size={15} color="#385866" />
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                {selectedLocation?.nome}
              </Text>
            </View>
            <View style={styles.addressRow}>
              <Ionicons name="location" size={15} color="#385866" />
              <View style={styles.flex1}>
                <Text style={styles.text}>
                  {selectedLocation?.localizacao?.local} -{" "}
                  {selectedLocation?.localizacao?.origem} - {selectedLocation?.peso}
                </Text>
              </View>
            </View>
            <View style={[styles.completedTag, styles.completedBg]}>
              <Text style={[styles.statusText, styles.whiteText]}>
                Concluído {selectedLocation?.dataConclusao} - {selectedLocation?.horaConclusao}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerImage: {
    width: 36,
    height: 36,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  infoBox: {
    position: "absolute",
    bottom: 10,
    width: "95%",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "28%",
    height: "100%",
    borderRadius: 5,
  },
  infoContent: {
    width: "70%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },
  flex1: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  completedTag: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    gap: 3,
  },
  completedBg: {
    backgroundColor: "#1FB431",
  },
  whiteText: {
    color: "#fff",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});


export default Mapa;
