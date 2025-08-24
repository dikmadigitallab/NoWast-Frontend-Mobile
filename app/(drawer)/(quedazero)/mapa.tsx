import AprovacoStatus from "@/components/aprovacaoStatus";
import LoadingScreen from "@/components/carregamento";
import { useGetActivity } from "@/hooks/atividade/get";
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import "moment/locale/pt-br";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { getStatusImage } from "../../../utils/getStatusImage";

interface ActivityData {
  activityFiles: any[];
  approvalDate: string | null;
  approvalStatus: string;
  checklist: any[];
  dateTime: string;
  dimension: number;
  environment: string;
  id: number;
  justification: string | null;
  manager: string;
  ppe: any;
  local: {
    latitude: number | string;
    longitude: number | string;
  };
  products: any[];
  statusEnum: string;
  supervisor: string;
  tools: any[];
  transports: any[];
  userActivities: any[];
}

const extractDateTime = (dateTime: string) => {
  const [date, fullTime] = dateTime.split(' ');
  const [hours, minutes] = fullTime.split(':');
  const time = `${hours}:${minutes}`;
  return { date, time };
};

const initialRegion: Region = {
  latitude: -20.3155,
  longitude: -40.3128,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function Mapa() {
  const { data, refetch, loading } = useGetActivity({});
  const [selectedLocation, setSelectedLocation] = useState<ActivityData | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<MapView>(null);

  useFocusEffect(
    useCallback(() => {
      if (refetch) {
        refetch();
        setSelectedLocation(null);
      }
    }, [refetch])
  );

  const handleMapLoaded = () => {
    setMapLoaded(true);
  };

  const formatApprovalDate = (approvalDate: string | null) => {
    if (!approvalDate) return { date: "", time: "" };

    try {
      const [datePart, timePart] = approvalDate.split(' ');
      if (datePart && timePart) {
        const [hours, minutes] = timePart.split(':');
        return {
          date: datePart,
          time: `${hours}:${minutes}`
        };
      }

      const momentDate = moment(approvalDate);
      if (momentDate.isValid()) {
        return {
          date: momentDate.format('DD/MM/YYYY'),
          time: momentDate.format('HH:mm')
        };
      }

      return { date: "", time: "" };
    } catch (error) {
      console.error("Erro ao formatar data de aprovação:", error);
      return { date: "", time: "" };
    }
  };


  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}


      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onMapLoaded={handleMapLoaded}
        onLayout={handleMapLoaded}
      >
        {data?.map((activity: ActivityData) => {
          const lat = Number(activity.local?.latitude);
          const lng = Number(activity.local?.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Coordenadas inválidas para atividade ${activity.id}`);
            return null;
          }

          return (
            <Marker
              key={activity.id}
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
              onPress={() => setSelectedLocation(activity)}
            >
              <Image
                style={styles.markerImage}
                resizeMode="contain"
                source={getStatusImage(activity.statusEnum) as never}
              />
            </Marker>
          );
        })}
      </MapView>

      <View style={{ position: 'absolute', top: 10, left: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
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

          <View style={styles.mainInfoContainer}>

            <View style={{
              width: "20%",
              height: '100%',
              backgroundColor: '#f0f0f0',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <MaterialCommunityIcons name="image-off-outline" size={40} color="#385866" />
            </View>

            <View style={styles.infoContent}>
              <View style={styles.row}>
                <Entypo name="calendar" size={15} color="black" />
                <Text style={styles.text}>
                  {extractDateTime(selectedLocation.dateTime).date} / {extractDateTime(selectedLocation.dateTime).time}
                </Text>
              </View>
              <View style={styles.row}>
                <FontAwesome name="user" size={15} color="#385866" />
                <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                  {selectedLocation.supervisor}
                </Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="location" size={15} color="#385866" />
                <View style={styles.flex1}>
                  <Text style={styles.text}>
                    Dimensão: {selectedLocation.dimension}m² - {selectedLocation.environment}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ width: "100%", height: 40 }}>
            <AprovacoStatus status={selectedLocation.approvalStatus} date={formatApprovalDate(selectedLocation.approvalDate).date} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    position: 'relative',
  },
  markerImage: {
    width: 36,
    height: 36,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  mainInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  infoBox: {
    position: "absolute",
    bottom: 10,
    overflow: "hidden",
    width: "95%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignSelf: "center",
    shadowColor: "#000",
    borderRadius: 12,
    backgroundColor: "#fff",
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
    gap: 5
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
});