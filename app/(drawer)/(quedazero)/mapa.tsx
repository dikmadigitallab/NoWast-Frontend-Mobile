import AprovacoStatus from "@/components/aprovacaoStatus";
import LoadingScreen from "@/components/carregamento";
import Map, { MapHandle } from "@/components/Map";
import SeletorPeriodo from "@/components/seletorPeriodo";
import StatusIndicator from "@/components/StatusIndicator";
import { useGetActivity } from "@/hooks/atividade/get";
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import "moment/locale/pt-br";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActivityData {
  activityFiles: any[];
  approvalDate?: string;
  approvalStatus: string;
  dateTime: string;
  dimension: number;
  environment: string;
  id: number;
  justification?: string;
  manager: string;
  products: any[];
  statusEnum?: string;
  supervisor: string;
  tools: any[];
  transports: any[];
  userActivities: any[];
  local?: {
    latitude: number;
    longitude: number;
  };
}

interface GroupedActivity {
  latitude: number;
  longitude: number;
  activities: any[];
}

const extractDateTime = (dateTime: string) => {
  const [date, fullTime] = dateTime.split(' ');
  const [hours, minutes] = fullTime.split(':');
  const time = `${hours}:${minutes}`;
  return { date, time };
};

const initialRegion = {
  latitude: -20.3155,
  longitude: -40.3128,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function Mapa() {
  const mapRef = useRef<MapHandle | null>(null);
  const pickerRef = useRef<any>(null);
  const [type, setType] = useState("Todos");
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ActivityData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showGroupedActivities, setShowGroupedActivities] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupedActivity | null>(null);
  
  // Calcular startDate e endDate baseado no mês/ano selecionado
  const getDateRange = () => {
    if (selectedMonth === undefined || selectedYear === undefined) {
      return { startDate: null, endDate: null };
    }

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const { startDate, endDate } = getDateRange();
  
  const { data, refetch, loading } = useGetActivity({ 
    type: type, 
    pagination: true,
    startDate: (startDate && endDate) ? startDate : null,
    endDate: (startDate && endDate) ? endDate : null
  });

  // Função para obter coordenadas da API
  const getCoordinates = (activity: any) => {
    const lat = Number(activity.local?.latitude);
    const lng = Number(activity.local?.longitude);
    return { lat, lng };
  };

  // Função para agrupar atividades por localização
  const groupActivitiesByLocation = (activities: any[]) => {
    const grouped: { [key: string]: GroupedActivity } = {};
    
    activities?.forEach((activity: any) => {
      const coordinates = getCoordinates(activity);
      
      // Criar uma chave única baseada nas coordenadas (arredondadas para evitar pequenas diferenças)
      const key = `${coordinates.lat.toFixed(6)}_${coordinates.lng.toFixed(6)}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          activities: []
        };
      }
      
      grouped[key].activities.push(activity);
    });
    
    return Object.values(grouped);
  };

  // Obter atividades agrupadas
  const groupedActivities = groupActivitiesByLocation(data || []);

  // Função para lidar com o clique no marcador
  const handleMarkerPress = (group: GroupedActivity) => {
    if (group.activities.length === 1) {
      // Se há apenas uma atividade, mostrar diretamente
      setSelectedLocation(group.activities[0]);
    } else {
      // Se há múltiplas atividades, mostrar a lista
      setSelectedGroup(group);
      setShowGroupedActivities(true);
    }
  };

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

  // Handler para limpar período
  const handleClearPeriod = () => {
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
  };

  // Handler para confirmar período
  const handleConfirmPeriod = () => {
    setOpen(false);
  };

  // Meses para exibição no filtro
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Função para centralizar o mapa em uma localização específica
  const centerMapOnLocation = (activity: ActivityData) => {
    const coordinates = getCoordinates(activity);
    
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
      
      setSelectedLocation(activity);
      setShowLocationList(false);
    }
  };

  return (
    <View style={styles.container}>

      <Picker
        style={{ display: "none" }}
        ref={pickerRef}
        selectedValue={type}
        onValueChange={(itemValue) => {
          setType(itemValue);
        }}
      >
        <Picker.Item label="Todos" value="Todos" />
        <Picker.Item label="Atividade" value="Atividade" />
        <Picker.Item label="Ocorrência" value="Ocorrencia" />
      </Picker>
      {loading && <LoadingScreen />}

      <Map
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        markers={groupedActivities.map((group, index) => {
          return {
            id: `group_${index}`,
            position: { latitude: group.latitude, longitude: group.longitude },
            onPress: () => handleMarkerPress(group),
            count: group.activities.length > 1 ? group.activities.length : undefined,
          };
        })}
      />

      {/* Indicador quando não há dados */}
      {data?.length === 0 && (
        <View style={styles.noDataOverlay}>
          <View style={styles.noDataContainer}>
            <MaterialCommunityIcons name="map-marker-off" size={40} color="#666" />
            <Text style={styles.noDataTitle}>Nenhum marcador encontrado</Text>
            <Text style={styles.noDataSubtitle}>
              Não há atividades ou ocorrências para exibir no mapa
            </Text>
            <Text style={styles.noDataHint}>
              Use os filtros acima para buscar por data ou tipo específico
            </Text>
          </View>
        </View>
      )}

      {/* Filtros melhorados */}
      <View style={styles.filtersContainer}>
        {/* Primeira linha: Data e Tipo */}
        <View style={styles.filtersRow}>
          <View style={styles.filterWrapper}>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={[styles.filterButton, (selectedMonth !== undefined && selectedYear !== undefined) && styles.filterButtonActive]}
            >
              <Entypo name="calendar" size={16} color={(selectedMonth !== undefined && selectedYear !== undefined) ? "#fff" : "#385866"} />
              <Text style={[styles.filterButtonText, (selectedMonth !== undefined && selectedYear !== undefined) && styles.filterButtonTextActive]}>
                {(selectedMonth !== undefined && selectedYear !== undefined) 
                  ? `${monthNames[selectedMonth - 1]}/${selectedYear}` 
                  : "Período"}
              </Text>
              {(selectedMonth !== undefined && selectedYear !== undefined) && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleClearPeriod();
                  }}
                  style={styles.clearButton}
                >
                  <AntDesign name="close" size={14} color="#fff" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.filterWrapper}>
            <TouchableOpacity
              style={[styles.filterButton, type !== "Todos" && styles.filterButtonActive]}
              onPress={() => pickerRef.current?.focus()}
            >
              <Text style={[styles.filterButtonText, type !== "Todos" && styles.filterButtonTextActive]}>
                {type}
              </Text>
              <AntDesign name="down" size={12} color={type !== "Todos" ? "#fff" : "#385866"} />
              {type !== "Todos" && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setType("Todos");
                  }}
                  style={styles.clearButton}
                >
                  <AntDesign name="close" size={14} color="#fff" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Segunda linha: Botão Locais */}
        {data && data.length > 0 && (
          <View style={styles.filtersRow}>
            <View style={styles.filterWrapper}>
              <TouchableOpacity
                style={[styles.filterButton, showLocationList && styles.filterButtonActive]}
                onPress={() => setShowLocationList(!showLocationList)}
              >
                <Ionicons name="list" size={16} color={showLocationList ? "#fff" : "#385866"} />
                <Text style={[styles.filterButtonText, showLocationList && styles.filterButtonTextActive]}>
                  Locais ({data.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {selectedLocation && (
        <View style={styles.infoBox}>
          <View style={styles.mainInfoContainer}>
            <View style={styles.imagePlaceholder}>
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
            <AprovacoStatus status={selectedLocation.approvalStatus} date={formatApprovalDate(selectedLocation.approvalDate || null).date} />
          </View>
        </View>
      )}

      {/* Modal com lista de localizações */}
      <Modal
        visible={showLocationList}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.locationListContainer}>
            <View style={styles.locationListHeader}>
              <Text style={styles.locationListTitle}>
                Localizações ({data?.length || 0})
              </Text>
              <TouchableOpacity onPress={() => setShowLocationList(false)}>
                <AntDesign name="close" size={24} color="#385866" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.locationListContent}>
              {data?.sort((a: any, b: any) => {
                // Ordenar por data do mais recente para o mais antigo
                // Converter data brasileira (DD/MM/YYYY HH:mm:ss) para Date
                const parseBrazilianDate = (dateTimeStr: string) => {
                  const [datePart, timePart] = dateTimeStr.split(' ');
                  const [day, month, year] = datePart.split('/');
                  const [hours, minutes, seconds] = timePart.split(':');
                  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
                };
                
                const dateA = parseBrazilianDate(a.dateTime);
                const dateB = parseBrazilianDate(b.dateTime);
                return dateB.getTime() - dateA.getTime(); // Mais recente primeiro
              }).map((item: any, index: number) => {
                const lat = Number(item.local?.latitude);
                const lng = Number(item.local?.longitude);
                
                if (isNaN(lat) || isNaN(lng)) return null;
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.locationItem}
                    onPress={() => centerMapOnLocation(item)}
                  >
                    <View style={styles.locationItemIcon}>
                      <Ionicons name="location" size={20} color="#186B53" />
                    </View>
                    <View style={styles.locationItemContent}>
                      <Text style={styles.locationItemTitle} numberOfLines={1}>
                        {item.environment}
                      </Text>
                      <Text style={styles.locationItemSubtitle} numberOfLines={1}>
                        {item.local?.sector || 'Setor não informado'}
                      </Text>
                      <Text style={styles.locationItemDetails} numberOfLines={1}>
                        {item.supervisor} • {extractDateTime(item.dateTime).date}
                      </Text>
                      <Text style={styles.locationItemDetails} numberOfLines={1}>
                        Dimensão: {item.dimension}m²
                      </Text>
                    </View>
                    <View style={styles.locationItemArrow}>
                      <AntDesign name="right" size={16} color="#666" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para atividades agrupadas */}
      <Modal
        visible={showGroupedActivities}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGroupedActivities(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.locationListContainer}>
            <View style={styles.locationListHeader}>
              <Text style={styles.locationListTitle}>
                Atividades no Local ({selectedGroup?.activities.length || 0})
              </Text>
              <TouchableOpacity onPress={() => setShowGroupedActivities(false)}>
                <AntDesign name="close" size={24} color="#385866" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.locationListContent}>
              {selectedGroup?.activities.sort((a: any, b: any) => {
                const parseBrazilianDate = (dateTimeStr: string) => {
                  const [datePart, timePart] = dateTimeStr.split(' ');
                  const [day, month, year] = datePart.split('/');
                  const [hours, minutes, seconds] = timePart.split(':');
                  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
                };
                
                const dateA = parseBrazilianDate(a.dateTime);
                const dateB = parseBrazilianDate(b.dateTime);
                return dateB.getTime() - dateA.getTime();
              }).map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.groupedActivityItem}
                  onPress={() => {
                    setSelectedLocation(item);
                    setShowGroupedActivities(false);
                  }}
                >
                  <View style={styles.groupedActivityMainContent}>
                    <View style={styles.groupedActivityInfo}>
                      <Text style={styles.groupedActivityTitle} numberOfLines={1}>
                        {item.environment}
                      </Text>
                      <Text style={styles.groupedActivitySubtitle} numberOfLines={1}>
                        {item.local?.sector || 'Setor não informado'}
                      </Text>
                      <Text style={styles.groupedActivityDetails} numberOfLines={1}>
                        {item.supervisor} • {extractDateTime(item.dateTime).date}
                      </Text>
                      <Text style={styles.groupedActivityDetails} numberOfLines={1}>
                        Dimensão: {item.dimension}m²
                      </Text>
                    </View>
                    <View style={styles.locationItemArrow}>
                      <AntDesign name="right" size={16} color="#666" />
                    </View>
                  </View>
                  <View style={styles.groupedActivityStatus}>
                    <StatusIndicator status={item.statusEnum} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Componente Seletor de Período */}
      <SeletorPeriodo
        visible={open}
        onClose={() => setOpen(false)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onClear={handleClearPeriod}
        onConfirm={handleConfirmPeriod}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 9999,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  filterWrapper: {
    position: "relative",
  },
  filterButton: {
    height: 40,
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#fff",
  },
  filterButtonActive: {
    backgroundColor: "#186B53",
    borderColor: "#0e8664ff",
  },
  filterButtonText: {
    color: '#385866',
    fontWeight: '600',
    fontSize: 14
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  clearButton: {
    marginLeft: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center'
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
  imagePlaceholder: {
    width: "25%",
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
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
  },
  noDataOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
  noDataContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: '80%',
    gap: 10,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#385866',
    textAlign: 'center',
  },
  noDataSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  noDataHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Estilos para o modal de lista de localizações
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', // Centralizar verticalmente
    alignItems: 'center', // Centralizar horizontalmente
    paddingHorizontal: 20, // Padding lateral
    paddingVertical: 50, // Padding vertical para não colar nas bordas
  },
  locationListContainer: {
    backgroundColor: '#fff',
    borderRadius: 20, // Bordas arredondadas em todos os lados
    maxHeight: '80%', // Aumentar altura máxima
    minHeight: '50%', // Aumentar altura mínima
    width: '100%', // Largura total
    maxWidth: 400, // Largura máxima para tablets
  },
  locationListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  locationListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#385866',
  },
  locationListContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Reduzir padding vertical
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationItemContent: {
    flex: 1,
    gap: 2, // Reduzir gap entre linhas
  },
  locationItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#385866',
  },
  locationItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  locationItemDetails: {
    fontSize: 12,
    color: '#999',
  },
  locationItemArrow: {
    marginLeft: 10,
  },
  groupedActivityItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupedActivityMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupedActivityInfo: {
    flex: 1,
    gap: 4,
  },
  groupedActivityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#385866',
  },
  groupedActivitySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  groupedActivityDetails: {
    fontSize: 12,
    color: '#999',
  },
  groupedActivityStatus: {
    width: '100%',
  },
});