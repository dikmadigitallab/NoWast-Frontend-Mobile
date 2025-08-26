import AprovacoStatus from "@/components/aprovacaoStatus";
import LoadingScreen from "@/components/carregamento";
import StatusIndicator from "@/components/StatusIndicator";
import { useGetActivity } from "@/hooks/atividade/get";
import { StyledMainContainer } from "@/styles/StyledComponents";
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import "moment/locale/pt-br";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { DatePickerModal } from 'react-native-paper-dates';
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

  const mapRef = useRef<MapView>(null);
  const pickerRef = useRef<any>(null);
  const [filter, setFilter] = useState("Todos");
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ActivityData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { data, refetch, loading } = useGetActivity({ dateTimeFrom: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : null });

  useFocusEffect(
    useCallback(() => {
      if (refetch) {
        refetch();
        setSelectedLocation(null);
      }
    }, [refetch])
  );

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

  const onDismiss = () => setOpen(false);

  const onConfirm = (params: { date: any }) => {
    setOpen(false);
    setSelectedDate(params.date);
  };

  if (data?.length === 0) {
    return (
      <StyledMainContainer>
        <View style={styles.emptyContainer}>
          <Image
            style={{ width: 130, height: 130, marginBottom: -20 }}
            source={require("../../../assets/images/adaptive-icon.png")}
          />
          <Text style={styles.emptyTitle}>Nenhum dado encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Não há atividades ou ocorrências cadastradas
          </Text>
        </View>
      </StyledMainContainer>
    );
  }

  return (
    <View style={styles.container}>

      <DatePickerModal
        locale="pt-BR"
        mode="single"
        visible={open}
        onDismiss={onDismiss}
        date={selectedDate}
        onConfirm={onConfirm}
        presentationStyle="pageSheet"
        label="Selecione uma data"
        saveLabel="Confirmar"
      />

      <Picker
        style={{ display: "none" }}
        ref={pickerRef}
        selectedValue={filter}
        onValueChange={(itemValue) => {
          setFilter(itemValue);
        }}
      >
        <Picker.Item label="Todos" value="" />
        <Picker.Item label="Atividade" value="Atividade" />
        <Picker.Item label="Ocorrência" value="Ocorrência" />
      </Picker>
      {loading && <LoadingScreen />}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {data?.map((activity: any) => {
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

      <View style={{ position: 'absolute', top: 10, left: 10, flexDirection: 'row', justifyContent: 'space-between', gap: 5 }}>

        <View style={{ width: 130, flexDirection: "column", gap: 5, position: "relative", height: 55 }}>
          <TouchableOpacity onPress={() => setOpen(true)} style={[styles.filterButton, { justifyContent: "flex-start" }]}>
            <Entypo name="calendar" size={15} color="#385866" style={{ marginRight: 5 }} />
            {selectedDate ? (
              <Text style={{ color: '#000', fontWeight: '500', fontSize: 12 }}>
                {moment(selectedDate).format('DD/MM/YYYY')}
              </Text>
            )
              :
              (<Text style={{ color: '#000', fontWeight: '500', fontSize: 12 }}>Data</Text>)}
          </TouchableOpacity>

          {selectedDate && (
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: -10,
                left: 0,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#cdcdcd",
                padding: 4,
                gap: 5
              }}
              onPress={() => setSelectedDate(undefined)}
            >
              <Text style={{ color: '#000', fontWeight: '500', fontSize: 8 }}>
                {moment(selectedDate).format('DD/MM/YYYY')}
              </Text>
              <AntDesign name="close" size={10} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ width: 130, flexDirection: "column", gap: 5, position: "relative", height: 55 }}>
          <TouchableOpacity style={styles.filterButton} onPress={() => pickerRef.current?.focus()}>
            <Text style={{ color: '#000', fontWeight: '500', fontSize: 12 }}>{filter}</Text>
            <AntDesign name="caretdown" size={10} color="black" />
          </TouchableOpacity>
          {filter && filter !== "Todos" && (
            <TouchableOpacity style={{
              position: "absolute",
              bottom: -10,
              left: 0,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#cdcdcd",
              padding: 4,
              gap: 5
            }} onPress={() => setFilter("Todos")}>
              <Text style={{ color: '#000', fontWeight: '500', fontSize: 8 }}>{filter}</Text>
              <AntDesign name="close" size={10} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {selectedLocation && (
        <View style={styles.infoBox}>
          <View style={styles.mainInfoContainer}>
            <View style={{
              width: "25%",
              height: '100%',
              backgroundColor: '#f0f0f0',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <MaterialCommunityIcons name="image-off-outline" size={40} color="#385866" />
            </View>

            <View style={styles.infoContent}>
              <View style={[styles.row, { justifyContent: "space-between", width: "100%" }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Entypo name="calendar" size={15} color="black" />
                  <Text style={styles.text}>
                    {extractDateTime(selectedLocation.dateTime).date} / {extractDateTime(selectedLocation.dateTime).time}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedLocation(null)}>
                  <AntDesign name="close" size={30} color="#385866" />
                </TouchableOpacity>
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
              <StatusIndicator status={selectedLocation.statusEnum} />
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
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: "row",
    borderColor: "#d9d9d9",
    backgroundColor: "#eff5f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 15
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#385866',
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#186B53',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  }
});