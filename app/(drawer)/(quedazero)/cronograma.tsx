
import AprovacoStatus from "@/components/aprovacaoStatus";
import LoadingScreen from "@/components/carregamento";
import StatusIndicator from '@/components/StatusIndicator';
import { useGetActivity } from '@/hooks/atividade/get';
import { useGet } from '@/hooks/crud/get/get';
import { useGetUsuario } from '@/hooks/usuarios/get';
import { useItemsStore } from '@/store/storeOcorrencias';
import { IAtividade } from '@/types/IAtividade';
import { AntDesign, Entypo, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRouter } from 'expo-router';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import Calendario from '../../../components/calendario';
import { StyledMainContainer } from '../../../styles/StyledComponents';

interface PickerRef {
  open: () => void;
  close: () => void;
  focus: () => void;
  blur: () => void;
  getValue: () => string;
}

interface GroupedData {
  id: string;
  data: string;
  hora: string;
  localizacao: {
    local: string;
    dimensao: string;
  };
  predio: string;
  status: string | any;
  dataConclusao: string;
  horaConclusao: string;
  aprovacao: string;
  dataAprovacao: string | null;
  foto: string[];
}

//Formata a data no padrão 'dddd [ - ] DD [de] MMMM' e deixa a primeira letra da semana em maiúscula
const formatDateHeader = (dateStr: string) => {
  const date = moment(dateStr, 'DD/MM/YYYY');
  return date.format('dddd [ - ] DD [de] MMMM').replace(/^\w/, c => c.toUpperCase());
};

//Extrai a data e hora de uma string no formato 'DD/MM/YYYY HH:mm'
const extractDateTime = (dateTime: string) => {
  const [date, fullTime] = dateTime.split(' ');
  const [hours, minutes] = fullTime.split(':');
  const time = `${hours}:${minutes}`;
  return { date, time };
};

export default function Cronograma() {

  const router = useRouter();
  const { setitems } = useItemsStore();
  const [open, setOpen] = useState(false);
  const { data: supervisores } = useGetUsuario({})
  const enviromentPickerRef = useRef<PickerRef>(null);
  const supervisorPickerRef = useRef<PickerRef>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const { data: environment } = useGet({ url: "environment" });
  const animatedHeight = useRef(new Animated.Value(360)).current;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonthAnchor, setCurrentMonthAnchor] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'));
  const [filter, setFilter] = useState({ supervisor: { id: 0, label: "" }, environment: { id: 0, label: "" } });
  const [activeFilters, setActiveFilters] = useState<Array<{ type: 'supervisor' | 'environment' | 'date'; label: string; value: any; onRemove: () => void; }>>([]);
  const monthRange = useMemo(() => {
    if (selectedDate) {
      const day = moment(selectedDate).format('YYYY-MM-DD');
      return { startDate: day, endDate: day };
    }
    const start = moment(currentMonthAnchor).startOf('month').format('YYYY-MM-DD');
    const end = moment(currentMonthAnchor).endOf('month').format('YYYY-MM-DD');
    return { startDate: start, endDate: end };
  }, [selectedDate, currentMonthAnchor]);

  const { data, refetch } = useGetActivity({ pageSize: null, type: "Atividade", pagination: false, startDate: monthRange.startDate, endDate: monthRange.endDate, supervisorId: filter.supervisor.id, environmentId: filter.environment.id });

  useFocusEffect(
    useCallback(() => {
      if (refetch) {
        refetch();
      }
    }, [refetch])
  );

  useEffect(() => {
    Animated.timing(animatedHeight, { toValue: showCalendar ? 360 : 100, duration: 300, useNativeDriver: false }).start();
  }, [showCalendar]);

  // Sincroniza os filtros ativos
  useEffect(() => {
    const newActiveFilters = [];

    if (filter.supervisor.id !== 0) {
      newActiveFilters.push({
        type: 'supervisor',
        label: `Supervisor: ${filter.supervisor.label}`,
        value: filter.supervisor.id,
        onRemove: () => setFilter(prev => ({ ...prev, supervisor: { id: 0, label: "" } }))
      });
    }

    if (filter.environment.id !== 0) {
      newActiveFilters.push({
        type: 'environment',
        label: `Ambiente: ${filter.environment.label}`,
        value: filter.environment.id,
        onRemove: () => setFilter(prev => ({ ...prev, environment: { id: 0, label: "" } }))
      });
    }

    if (selectedDate) {
      newActiveFilters.push({
        type: 'date',
        label: `Data: ${moment(selectedDate).format('DD/MM/YYYY')}`,
        value: selectedDate,
        onRemove: () => setSelectedDate(undefined)
      });
    }

    setActiveFilters(newActiveFilters as { type: "environment" | "supervisor" | "date"; label: string; value: any; onRemove: () => void; }[]);
  }, [filter, selectedDate]);

  const onDismiss = () => setOpen(false);

  // Callback invocado quando o usuário seleciona uma data única
  const onConfirmSingle = (params: { date: CalendarDate }) => {
    setOpen(false);
    setSelectedDate(params.date || undefined);
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setFilter({ supervisor: { id: 0, label: "" }, environment: { id: 0, label: "" } });
    setSelectedDate(undefined);
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return filter.supervisor.id !== 0 || filter.environment.id !== 0 || selectedDate !== undefined;
  }, [filter, selectedDate]);

  // Agrupa as atividades por data
  const sections = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const grouped: Record<string, GroupedData[]> = {};
    const currentDate = moment();
    const currentMonth = currentDate.month();
    const currentYear = currentDate.year();

    data.forEach((item: any) => {
      const { date } = extractDateTime(item.dateTime);
      const key = formatDateHeader(date);

      if (!grouped[key]) grouped[key] = [];

      let horaConclusaoFormatada = "";
      if (item.statusEnum === "COMPLETED" && item.approvalDate) {
        const approvalMoment = moment(item.approvalDate);
        horaConclusaoFormatada = approvalMoment.format('HH:mm');
      }

      grouped[key].push({
        id: item.id.toString(),
        data: date,
        hora: extractDateTime(item.dateTime).time,
        localizacao: {
          local: item.environment ?? "",
          dimensao: item.dimension
        },
        predio: item?.local?.building,
        status: item.statusEnum,
        dataConclusao: item.statusEnum === "COMPLETED" ?
          (item.approvalDate ? moment(item.approvalDate).format('DD/MM/YYYY') : date) : "",
        horaConclusao: horaConclusaoFormatada,
        aprovacao: item.approvalStatus ?? "",
        dataAprovacao: item.approvalDate ? moment(item.approvalDate).format('DD/MM/YYYY HH:mm') : null,
        foto: []
      });
    });

    return Object.entries(grouped)
      .map(([title, data]) => ({ title, data }))
      .sort((a, b) => {
        const dateA = moment(a.data[0].data, "DD/MM/YYYY");
        const dateB = moment(b.data[0].data, "DD/MM/YYYY");

        // Verifica se as datas estão no mês atual
        const isAInCurrentMonth = dateA.month() === currentMonth && dateA.year() === currentYear;
        const isBInCurrentMonth = dateB.month() === currentMonth && dateB.year() === currentYear;

        // Se ambas estão no mês atual ou ambas não estão, ordena por data decrescente
        if (isAInCurrentMonth === isBInCurrentMonth) {
          return dateB.valueOf() - dateA.valueOf();
        }

        // Se apenas uma está no mês atual, ela vem primeiro
        return isAInCurrentMonth ? -1 : 1;
      });
  }, [data]);

  // Componente para renderizar os filtros ativos
  const renderActiveFilters = () => {

    // Retorna null se não houver filtros ativos
    if (activeFilters.length === 0) {
      return null;
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.activeFiltersContainer}
        contentContainerStyle={styles.activeFiltersContent}
      >
        {activeFilters.map((filterItem) => (
          <View key={`${filterItem.type}-${filterItem.value}`} style={styles.filterChip}>
            <Text style={styles.filterChipText} numberOfLines={1}>
              {filterItem.label}
            </Text>
            <TouchableOpacity
              onPress={filterItem.onRemove}
              style={styles.removeFilterButton}
            >
              <AntDesign name="close" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={clearFilters}
          style={[styles.filterChip, styles.clearAllButton]}
        >
          <Text style={styles.clearAllText}>Limpar Tudo</Text>
          <MaterialIcons name="clear" size={14} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const onSelected = (id: any, rota: string) => {
    const getData = data?.filter((item: IAtividade) => item.id == id);
    if (getData) {
      setitems(getData[0]);
    }
    router.push(rota as never);
  };

  if (!data) {
    return (<LoadingScreen />)
  }

  return (
    <View style={{ flex: 1 }}>

      <DatePickerModal
        locale="pt-BR"
        mode="single"
        visible={open}
        onDismiss={onDismiss}
        date={selectedDate}
        onConfirm={onConfirmSingle}
        presentationStyle="pageSheet"
        label="Selecione uma data"
        saveLabel="Confirmar"
      />

      <Picker
        style={{ display: "none" }}
        ref={supervisorPickerRef as React.MutableRefObject<Picker<number> | null>}
        selectedValue={filter.supervisor.id}
        onValueChange={(itemValue, itemIndex) => {
          setFilter((prevState) => ({ ...prevState, supervisor: { id: itemValue, label: supervisores?.[itemIndex]?.name } }));
        }}
      >
        <Picker.Item label="Selecione um supervisor" value={0} />
        {supervisores?.map((supervisor: { id: number; name: string }) => (
          <Picker.Item key={supervisor.id} label={supervisor.name} value={supervisor.id} />
        ))}
      </Picker>

      <Picker
        style={{ display: "none" }}
        ref={enviromentPickerRef as React.MutableRefObject<Picker<number> | null>}
        selectedValue={filter.environment.id}
        onValueChange={(itemValue, itemIndex) => {
          setFilter((prevState) => ({ ...prevState, environment: { id: itemValue, label: environment?.[itemIndex]?.name } }));
        }}
      >
        <Picker.Item label="Selecione um ambiente" value={0} />
        {environment?.map((environment: { id: number; name: string }) => (
          <Picker.Item key={environment.id} label={environment.name} value={environment.id} />
        ))}
      </Picker>

      <Animated.View style={{
        overflow: "hidden",
        height: animatedHeight,
        backgroundColor: "#186B53",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}>
        <Calendario
          onMonthChange={(dateString) => {
            setCurrentMonthAnchor(dateString);
          }}
          onDaySelect={(dateString) => {
            setSelectedDate(moment(dateString, 'YYYY-MM-DD').toDate());
          }}
        />
      </Animated.View>

      <TouchableOpacity
        onPress={() => setShowCalendar(!showCalendar)}
        style={[styles.toggleButton, {
          backgroundColor: showCalendar ? "#166f56" : "#186B53",
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }]}
      >
        <AntDesign name={showCalendar ? "up" : "down"} size={20} color="#fff" />
        <Text style={styles.toggleButtonText}>
          {showCalendar ? "Recolher calendário" : "Expandir calendário"}
        </Text>
      </TouchableOpacity>

      <StyledMainContainer>
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={{ flexDirection: "column", gap: 10, }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, height: 50, marginBottom: 10 }}>
              <TouchableOpacity style={styles.filterButton} onPress={() => enviromentPickerRef.current?.focus()} >
                <FontAwesome6 name="location-dot" size={15} color="#43575F" />
                <Text style={styles.filterButtonText}>{filter.environment.label ? filter.environment.label : "Ambiente"}</Text>
                <AntDesign name="caretdown" size={10} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => supervisorPickerRef.current?.focus()}>
                <FontAwesome6 name="user-tie" size={15} color="#43575F" />
                <Text style={styles.filterButtonText}>{filter.supervisor.label ? filter.supervisor.label : "Supervisor"}</Text>
                <AntDesign name="caretdown" size={10} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOpen(true)} style={[styles.filterButton]}>
                {selectedDate ? (
                  <Text style={{ color: '#000', fontWeight: '500', fontSize: 12 }}>
                    {moment(selectedDate).format('DD/MM/YYYY')}
                  </Text>
                ) : (
                  <Text style={{ color: '#000', fontWeight: '500', fontSize: 12 }}>Selecione uma data</Text>
                )}
                <Entypo name="calendar" size={15} color="#186B53" />
              </TouchableOpacity>
            </ScrollView>

            {/* Lista de filtros ativos */}
            {renderActiveFilters()}

            {sections.length > 0 ? (
              <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                contentContainerStyle={{ gap: 10 }}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Text style={styles.sectionHeader}>{title}</Text>
                    <View style={{ flex: 1, height: 1, marginLeft: 10, backgroundColor: "#81A8B8" }} />
                  </View>
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onSelected(item.id, "detalharAtividade")}>
                    <Text style={styles.horaText}>{item.hora}</Text>
                    <View style={styles.mainOccurrenceItem}>
                      <View style={styles.occurrenceItem}>
                        <View style={styles.contentInfoConteiner}>
                          <View style={styles.photoContainer}>
                            {item?.foto?.[0] ? (
                              <ImageBackground
                                source={{ uri: item.foto[0] }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                                imageStyle={styles.imageStyle}
                              />
                            ) : (
                              <View style={styles.placeholderImage}>
                                <FontAwesome6 name="image" size={24} color="#ccc" />
                              </View>
                            )}
                          </View>
                          <View style={styles.detailsSection}>
                            <View style={styles.dateSection}>
                              <Text style={styles.dateTimeText}>{item?.data} / {item?.hora}</Text>
                            </View>
                            <View style={styles.locationSection}>
                              <FontAwesome5 name="building" size={13} color="black" />
                              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                                <Text style={styles.locationText}>
                                  Ambiente:
                                </Text>
                                <Text style={styles.locationText}>
                                  {item?.localizacao?.local}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.locationSection}>
                              <Entypo name="location-pin" size={15} color="black" />
                              <Text style={styles.locationText}>{item?.predio}</Text>
                            </View>
                            <StatusIndicator status={item.status} />
                          </View>
                        </View>
                        <View style={styles.approvalContainer}>
                          <AprovacoStatus status={item.aprovacao ?? "Sem Aprovacao"} date={item.dataAprovacao ?? undefined} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
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
            )}
          </View>
        </ScrollView>
      </StyledMainContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  emptyContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: -10,
    zIndex: 10,
  },
  toggleButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 12,
  },
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
  clearFilterButton: {
    backgroundColor: "#E74C3C",
    borderColor: "#C0392B",
  },
  filterButtonText: {
    color: '#000',
    fontSize: 12,
  },
  clearFilterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '400',
    color: '#404944',
  },
  horaText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
    color: '#212525',
  },
  mainOccurrenceItem: {
    width: "100%",
    height: 180,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: "#d9d9d9",
    borderRadius: 10,
    overflow: "hidden"
  },
  occurrenceItem: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contentInfoConteiner: {
    padding: 7,
    height: "75%",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  imageStyle: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: "800",
  },
  locationText: {
    letterSpacing: -0.5,
    fontSize: 14,
  },
  photoContainer: {
    width: "35%",
    height: "100%",
  },
  detailsSection: {
    width: "60%",
    height: "100%",
    gap: 5,
    padding: 5
  },
  dateSection: {
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  locationSection: {
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  approvalContainer: {
    width: "100%",
    height: 40,
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
  // Novos estilos para os filtros ativos
  activeFiltersContainer: {
    maxHeight: 50,
  },
  activeFiltersContent: {
    gap: 8,
    alignItems: 'center',
    paddingVertical: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#186B53',
    paddingHorizontal: 12,
    height: 35,
    borderRadius: 1000,
    gap: 6,
  },
  filterChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    maxWidth: 150,
  },
  removeFilterButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 2,
  },
  clearAllButton: {
    backgroundColor: '#E74C3C',
  },
  clearAllText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});