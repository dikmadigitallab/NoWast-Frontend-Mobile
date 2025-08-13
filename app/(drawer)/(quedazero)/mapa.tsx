import AprovacoStatus from "@/components/aprovacaoStatus";
import { Dados } from "@/data";
import { StatusContainer } from "@/styles/StyledComponents";
import { getStatusColor } from "@/utils/statusColor";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { IOcorrencias } from "../../../types/IOcorrencias";
import { getStatusImage } from "../../../utils/getStatusImage";

export default function Mapa() {

  const [selectedLocation, setSelectedLocation] = useState<IOcorrencias | null>(null);

  const initialRegion: Region = {
    latitude: -20.3155,
    longitude: -40.3128,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>

      <MapView style={styles.map} initialRegion={initialRegion}>
        {Dados.map((loc) => (
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
        ))}
      </MapView>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Entypo name="calendar" size={15} color="#186B53" />
          <Text>Data</Text>
          <AntDesign name="caretdown" size={10} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text>Ocorrências</Text>
          <AntDesign name="caretdown" size={10} color="black" />
        </TouchableOpacity>
      </View>

      {selectedLocation && (
        <View style={styles.infoBox}>
          <View style={styles.infoBoxContent}>
            <View style={styles.infoHeader}>
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
                <StatusContainer backgroundColor={getStatusColor(selectedLocation?.status)}>
                  <Text style={[styles.statusText, { color: "#fff" }]}>
                    {selectedLocation?.status === "Concluído"
                      ? `Concluído em ${selectedLocation?.dataConclusao} / ${selectedLocation?.horaConclusao}`
                      : selectedLocation?.status}
                  </Text>
                </StatusContainer>
              </View>
            </View>

            <View style={styles.approvalContainer}>
              <AprovacoStatus
                status={selectedLocation.aprovacao !== null ? selectedLocation.aprovacao : "Sem Aprovacao"}
                date={selectedLocation.dataAprovacao}
              />
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
  filterContainer: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5
  },
  filterButton: {
    height: 40,
    width: 120,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#d9d9d9",
    backgroundColor: "#fff"
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
    overflow: "hidden",
    bottom: Dimensions.get("window").height * 0.1,
    width: "95%",
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
  infoBoxContent: {
    width: "100%",
    flexDirection: "column",
    gap: 5
  },
  infoHeader: {
    flexDirection: "row",
    gap: 10,
    padding: 5
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
    fontSize: 14,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  approvalContainer: {
    width: "100%",
    height: 40
  }
});