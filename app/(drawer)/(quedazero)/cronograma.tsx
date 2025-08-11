import { Dados } from '@/data';
import { AntDesign, Entypo, FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useMemo, useRef, useState } from 'react';
import { ImageBackground, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import Calendario from '../../../components/calendario';
import { StatusContainer, StyledMainContainer } from '../../../styles/StyledComponents';
import { getStatusColor } from '../../../utils/statusColor';

const formatDateHeader = (dateStr: any) => {
  const date = moment(dateStr, 'DD/MM/YYYY');
  return date.format('dddd [ - ] DD [de] MMMM').replace(/^\w/, c => c.toUpperCase());
};

export default function Cronograma() {

  const [range, setRange] = useState<{ startDate: Date | undefined; endDate: Date | undefined; }>({ startDate: undefined, endDate: undefined });
  const [open, setOpen] = useState(false);
  const onDismiss = () => setOpen(false);

  const [atividadeSelecionada, setAtividadeSelecionada] = useState({ atividade: "", label: "" });


  const pickerRef = useRef<any>(null);

  const atividades = ["Atividades", "Ocorrências"];

  function openSelect() {
    pickerRef.current?.focus();
  }


  const onConfirm = ({ startDate, endDate }: any) => {
    setOpen(false);
    setRange({ startDate, endDate });
  };

  const sections = useMemo<any[]>(() => {

    const grouped: Record<string, any[]> = {};

    Dados.forEach((item) => {
      const key = formatDateHeader(item.data);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });


    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [Dados]);


  return (
    <>
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
      <Calendario />
      <StyledMainContainer>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
            <TouchableOpacity style={styles.filterButton} onPress={openSelect} >
              <FontAwesome6 name="location-dot" size={15} color="#43575F" />
              <Text>Sinterização</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={openSelect}>
              <FontAwesome6 name="user-tie" size={15} color="#43575F" />
              <Text>2+ Seelecionado</Text>
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
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, gap: 10 }}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.sectionHeader}>{title}</Text>
              <View style={{ width: "100%", height: 1, marginLeft: 10, backgroundColor: "#81A8B8" }} />
            </View>
          )}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.horaText}>{item.hora}</Text>
              <View style={styles.mainOccurrenceItem}>
                <View style={styles.occurrenceItem}>
                  <View style={styles.photoContainer}>
                    {item?.foto?.[0] && (
                      <ImageBackground
                        source={item.foto[0]}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                        imageStyle={styles.imageStyle}
                      />
                    )}
                  </View>
                  <View style={styles.detailsSection}>
                    <View style={styles.dateSection}>
                      <Text style={styles.dateTimeText}>{item?.data} / {item?.hora}</Text>
                    </View>
                    <View style={styles.locationSection}>
                      <Text style={styles.locationText}>
                        {item?.localizacao?.local} -  {item?.localizacao?.origem}
                      </Text>
                    </View>
                    <View style={styles.locationSection}>
                      <Text style={styles.locationText}>{item?.nome}</Text>
                    </View>
                    <StatusContainer backgroundColor={getStatusColor(item?.status)}>
                      <Text style=
                        {[styles.statusText, { color: "#fff" }]}>
                        {item?.status === "Concluído" ? `Concluído em ${item?.dataConclusao} / ${item?.horaConclusao}` : item?.status}
                      </Text>
                    </StatusContainer>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </StyledMainContainer>
    </>
  );
};


const styles = StyleSheet.create({
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
    height: 120,
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
    padding: 7,
    flexDirection: "row",
    gap: 10
  },
  imageStyle: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: "800",
  },
  locationText: {
    letterSpacing: -0.5,
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
});


