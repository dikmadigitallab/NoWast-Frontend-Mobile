import AprovacoStatus from '@/components/aprovacaoStatus';
import { useGetActivity } from '@/hooks/atividade/get';
import { AntDesign, Entypo, FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from 'expo-router';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import Calendario from '../../../components/calendario';
import { StatusContainer, StyledMainContainer } from '../../../styles/StyledComponents';
import { getStatusColor } from '../../../utils/statusColor';

// Interface para tipar os dados da API
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
  products: any[];
  statusEnum: string;
  supervisor: string;
  tools: any[];
  transports: any[];
  userActivities: any[];
}

const formatDateHeader = (dateStr: string) => {
  const date = moment(dateStr, 'DD/MM/YYYY');
  return date.format('dddd [ - ] DD [de] MMMM').replace(/^\w/, c => c.toUpperCase());
};

// Função para extrair data e hora do campo dateTime (formato 00:00)
const extractDateTime = (dateTime: string) => {
  const [date, fullTime] = dateTime.split(' ');
  const [hours, minutes] = fullTime.split(':');
  const time = `${hours}:${minutes}`; // Formato 00:00

  return { date, time };
};

export default function Cronograma() {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState<{ startDate?: Date; endDate?: Date }>({});
  const [atividadeSelecionada, setAtividadeSelecionada] = useState({ atividade: "", label: "" });
  const pickerRef = useRef<any>(null);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const { data, refetch, loading } = useGetActivity({});

  useFocusEffect(
    useCallback(() => {
      if (refetch) {
        refetch();
      }
      setAtividadeSelecionada({ atividade: "", label: "" });
    }, [refetch])
  );

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: showCalendar ? 360 : 100,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [showCalendar]);

  function openSelect() {
    pickerRef.current?.focus();
  }

  const onDismiss = () => setOpen(false);

  const onConfirm = ({ startDate, endDate }: any) => {
    setOpen(false);
    setRange({ startDate, endDate });
  };

  // Processar os dados da API para o formato esperado pela SectionList
  const sections = useMemo<any[]>(() => {
    if (!data || !Array.isArray(data)) return [];

    const grouped: Record<string, any[]> = {};

    data.forEach((item: ActivityData) => {
      const { date } = extractDateTime(item.dateTime);
      const key = formatDateHeader(date);

      if (!grouped[key]) grouped[key] = [];

      // Formatar hora de conclusão para o formato 00:00
      let horaConclusaoFormatada = "";
      if (item.statusEnum === "COMPLETED" && item.approvalDate) {
        const approvalMoment = moment(item.approvalDate);
        horaConclusaoFormatada = approvalMoment.format('HH:mm');
      }

      grouped[key].push({
        id: item.id.toString(),
        data: date,
        hora: extractDateTime(item.dateTime).time, // Já está no formato 00:00
        localizacao: {
          local: item.environment,
          origem: `Dimensão: ${item.dimension}`
        },
        nome: `Atividade ${item.id} - ${item.environment}`,
        status: item.statusEnum === "COMPLETED" ? "Concluído" : "Pendente",
        dataConclusao: item.statusEnum === "COMPLETED" ?
          (item.approvalDate ? moment(item.approvalDate).format('DD/MM/YYYY') : date) : "",
        horaConclusao: horaConclusaoFormatada,
        aprovacao: item.approvalStatus,
        dataAprovacao: item.approvalDate ? moment(item.approvalDate).format('DD/MM/YYYY HH:mm') : null,
        foto: [] // Placeholder para fotos
      });
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [data]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando atividades...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <DatePickerModal
        locale="pt-BR"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
        presentationStyle="pageSheet"
        label="Selecione uma data"
        saveLabel="Confirmar"
      />
      <Picker
        style={{ display: "none" }}
        ref={pickerRef}
        selectedValue={atividadeSelecionada.atividade}
      >
        <Picker.Item label="Atividades" value="atividades" />
        <Picker.Item label="Ocorrências" value="ocorrências" />
      </Picker>

      <Animated.View style={{ overflow: "hidden", height: animatedHeight, backgroundColor: "#186B53" }}>
        <Calendario />
      </Animated.View>
      <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={[styles.toggleButton, { backgroundColor: showCalendar ? "#166f56" : "#186B53" }]}>
        <AntDesign name={showCalendar ? "up" : "down"} size={20} color={showCalendar ? "#00ab7b" : "#fff"} />
      </TouchableOpacity>
      <StyledMainContainer>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
            <TouchableOpacity style={styles.filterButton} onPress={openSelect} >
              <FontAwesome6 name="location-dot" size={15} color="#43575F" />
              <Text style={styles.filterButtonText}>Ambiente</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={openSelect}>
              <FontAwesome6 name="user-tie" size={15} color="#43575F" />
              <Text style={styles.filterButtonText}>Supervisor</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOpen(true)} style={[styles.filterButton]}>
              {range.startDate && range.endDate ? (
                <Text style={{ color: '#000', fontWeight: '500', fontSize: 12 }}>
                  {moment(range.startDate).format('DD/MM/YYYY')} - {moment(range.endDate).format('DD/MM/YYYY')}
                </Text>
              )
                : (<Text style={{ color: '#000', fontWeight: '500', fontSize: 12 }}>Selecione um período</Text>)
              }
              <Entypo name="calendar" size={15} color="#186B53" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {sections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma atividade encontrada</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: Dimensions.get('window').height - 750 }}
            renderSectionHeader={({ section: { title } }) => (
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <Text style={styles.sectionHeader}>{title}</Text>
                <View style={{ flex: 1, height: 1, marginLeft: 10, backgroundColor: "#81A8B8" }} />
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.horaText}>{item.hora}</Text>
                <View style={styles.mainOccurrenceItem}>
                  <View style={styles.occurrenceItem}>

                    <View style={styles.contentInfoConteiner}>
                      <View style={styles.photoContainer}>
                        {item?.foto?.[0] ? (
                          <ImageBackground
                            source={item.foto[0]}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                            imageStyle={styles.imageStyle}
                          />
                        ) : (
                          <View style={styles.placeholderImage}>
                            <FontAwesome6 name="image" size={24} color="#ccc" />
                            <Text style={styles.placeholderText}>Sem imagem</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.detailsSection}>
                        <View style={styles.dateSection}>
                          <Text style={styles.dateTimeText}>{item?.data} / {item?.hora}</Text>
                        </View>
                        <View style={styles.locationSection}>
                          <Text style={styles.locationText}>
                            {item?.localizacao?.local} - {item?.localizacao?.origem}
                          </Text>
                        </View>
                        <View style={styles.locationSection}>
                          <Text style={styles.locationText}>{item?.nome}</Text>
                        </View>
                        <StatusContainer backgroundColor={getStatusColor(item?.status)}>
                          <Text style={[styles.statusText, { color: "#fff" }]}>
                            {item?.status === "Concluído" ?
                              `Concluído em ${item?.dataConclusao} / ${item?.horaConclusao}` :
                              item?.status}
                          </Text>
                        </StatusContainer>
                      </View>
                    </View>

                    <View style={styles.approvalContainer}>
                      <AprovacoStatus status={item.aprovacao !== null ? item.aprovacao : "Sem Aprovacao"} date={item.dataAprovacao} />
                    </View>

                  </View>
                </View>
              </View>
            )}
          />
        )}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5
  },
  filterButton: {
    height: 40,
    width: 160,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#d9d9d9",
    backgroundColor: "#fff"
  },
  filterButtonText: {
    color: '#000',
    fontSize: 12,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '400',
    color: '#404944',
  },
  itemContainer: {
    marginBottom: 15,
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
    gap: 3,
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
    alignItems: "flex-start",
  },
  approvalContainer: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
  },
});