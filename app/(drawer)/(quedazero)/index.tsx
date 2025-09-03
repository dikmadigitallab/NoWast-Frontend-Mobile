import Donut from "@/components/charts/donut/donut";
import ExecutionPie from "@/components/charts/executionPie/executionPie";
import JustifyPie from "@/components/charts/justifyPie/justifyPie";
import OcurrencePie from "@/components/charts/ocurrencePie/ocurrencePie";
import Pie from "@/components/charts/pie/pie";
import { useAuth } from "@/contexts/authProvider";
import { useGet } from "@/hooks/crud/get/get";
import { useGetDashboard } from "@/hooks/dashboard/useGet";
import { AntDesign, Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
interface PickerRef { open: () => void; close: () => void; focus: () => void; blur: () => void; getValue: () => string; }

export default function Dashboard() {

  const { user } = useAuth();
  const router = useRouter();
  const [openDate, setOpenDate] = useState(false);
  const sectorPickerRef = useRef<PickerRef>(null);
  const buildingPickerRef = useRef<PickerRef>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: setores } = useGet({ url: "sector" });
  const enviromentPickerRef = useRef<PickerRef>(null);
  const { data: predios } = useGet({ url: "building" });
  const animation = useRef(new Animated.Value(0)).current;
  const { data: ambientes } = useGet({ url: "environment" });
  const [activeTab, setActiveTab] = useState<"atividades" | "colaboradores">("atividades");
  const [dateRange, setDateRange] = useState<{ startDate: Date | undefined; endDate: Date | undefined; }>({ startDate: undefined, endDate: undefined });
  const [activeFilters, setActiveFilters] = useState<Array<{ type: 'environment' | 'sector' | 'building' | 'date'; label: string; value: any; onRemove: () => void; }>>([]);
  const [filter, setFilter] = useState({ endDate: endOfMonth, startDate: startOfMonth, userId: '', sector: { label: '', id: 0 }, environment: { label: '', id: 0 }, building: { label: '', id: 0 } });

  const { data: justificativas } = useGetDashboard({
    url: 'dashboard/justifications',
    startDate: filter.startDate,
    endDate: filter.endDate,
    userId: filter.userId,
    sectorId: filter.sector.id,
    environmentId: filter.environment.id,
    buildingId: filter.building.id
  });

  const { data: atividades } = useGetDashboard({
    url: 'dashboard/activities',
    startDate: filter.startDate,
    endDate: filter.endDate,
    userId: filter.userId,
    sectorId: filter.sector.id,
    environmentId: filter.environment.id,
    buildingId: filter.building.id
  });

  const { data: ocorrencias } = useGetDashboard({
    url: 'dashboard/occurrences',
    startDate: filter.startDate,
    endDate: filter.endDate,
    userId: filter.userId,
    sectorId: filter.sector.id,
    environmentId: filter.environment.id,
    buildingId: filter.building.id
  });

  // Sincroniza os filtros ativos
  useEffect(() => {
    const newActiveFilters = [];

    if (filter.environment.id !== 0) {
      newActiveFilters.push({
        type: 'environment',
        label: `Ambiente: ${filter.environment.label}`,
        value: filter.environment.id,
        onRemove: () => setFilter(prev => ({ ...prev, environment: { id: 0, label: "" } }))
      });
    }

    if (filter.sector.id !== 0) {
      newActiveFilters.push({
        type: 'sector',
        label: `Setor: ${filter.sector.label}`,
        value: filter.sector.id,
        onRemove: () => setFilter(prev => ({ ...prev, sector: { id: 0, label: "" } }))
      });
    }

    if (filter.building.id !== 0) {
      newActiveFilters.push({
        type: 'building',
        label: `Prédio: ${filter.building.label}`,
        value: filter.building.id,
        onRemove: () => setFilter(prev => ({ ...prev, building: { id: 0, label: "" } }))
      });
    }

    if (filter.startDate !== startOfMonth || filter.endDate !== endOfMonth) {
      const startDateLabel = filter.startDate ? new Date(filter.startDate).toLocaleDateString('pt-BR') : '';
      const endDateLabel = filter.endDate ? new Date(filter.endDate).toLocaleDateString('pt-BR') : '';

      newActiveFilters.push({
        type: 'date',
        label: `Período: ${startDateLabel} - ${endDateLabel}`,
        value: { startDate: filter.startDate, endDate: filter.endDate },
        onRemove: () => {
          setFilter(prev => ({
            ...prev,
            startDate: startOfMonth,
            endDate: endOfMonth
          }));
          setDateRange({ startDate: undefined, endDate: undefined });
        }
      });
    }

    setActiveFilters(newActiveFilters as SetStateAction<{ type: "environment" | "sector" | "building" | "date"; label: string; value: any; onRemove: () => void; }[]>);
  }, [filter]);

  const onDismiss = useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const onConfirm = useCallback(
    (params: { startDate: CalendarDate; endDate: CalendarDate }) => {
      setOpenDate(false);
      setDateRange({
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined
      });

      if (params.startDate && params.endDate) {
        const startDateStr = `${params.startDate.getFullYear()}-${String(params.startDate.getMonth() + 1).padStart(2, '0')}-${String(params.startDate.getDate()).padStart(2, '0')}`;
        const endDateStr = `${params.endDate.getFullYear()}-${String(params.endDate.getMonth() + 1).padStart(2, '0')}-${String(params.endDate.getDate()).padStart(2, '0')}`;

        setFilter(prev => ({
          ...prev,
          startDate: startDateStr,
          endDate: endDateStr
        }));
      }
    },
    [setOpenDate, setDateRange, setFilter]
  );

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setFilter({
      startDate: startOfMonth,
      endDate: endOfMonth,
      userId: '',
      sector: { id: 0, label: '' },
      environment: { id: 0, label: '' },
      building: { id: 0, label: '' }
    });
    setDateRange({ startDate: undefined, endDate: undefined });
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return filter.environment.id !== 0 || filter.sector.id !== 0 || filter.building.id !== 0 ||
      filter.startDate !== startOfMonth || filter.endDate !== endOfMonth;
  }, [filter]);

  // Componente para renderizar os filtros ativos
  const renderActiveFilters = () => {
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
          <View key={`${filterItem.type}-${JSON.stringify(filterItem.value)}`} style={styles.filterChip}>
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

  const toggleButtons = () => {
    Animated.spring(animation, {
      toValue: isExpanded ? 0 : 1,
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const tagStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
      { scale: animation },
    ],
    opacity: animation,
  };

  const ocorrenciaStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -150],
        }),
      },
      { scale: animation },
    ],
    opacity: animation,
  };

  const pieDataJustificativass = [
    { value: 54, color: '#177AD5', title: 'Falta' },
    { value: 40, color: '#79D2DE', title: 'Atestado' },
    { value: 20, color: '#ED6665', title: 'Falta de Máquina' },
    { value: 15, color: '#FFC107', title: 'Mud. Prior. Dikma' },
    { value: 10, color: '#8BC34A', title: 'Mud. Prior. Cliente' },
    { value: 8, color: '#9C27B0', title: 'Quebra' },
  ];

  const colaboradores = [
    {
      title: "Limpeza por Setor",
      volume: [
        { title: "Maior Volume", patio_carvao: 2.450, trat_gas: 1.450, Trat_gas_2: 2.450 },
        { title: "Menor Volume", patio_carvao: 2.450, trat_gas: 1.450, Trat_gas_2: 2.450 },
      ]
    },
    {
      title: "Limpeza por Ambiente",
      volume: [
        { title: "Maior Volume", patio_carvao: 2.450, trat_gas: 1.450, Trat_gas_2: 2.450 },
        { title: "Menor Volume", patio_carvao: 2.450, trat_gas: 1.450, Trat_gas_2: 2.450 },
      ]
    },
    {
      title: "Limpeza por Tipo",
      volume: [
        { title: "Maior Volume", patio_carvao: 2.450, trat_gas: 1.450, Trat_gas_2: 2.450 },
        { title: "Menor Volume", patio_carvao: 2.450, trat_gas: 1.450, Trat_gas_2: 2.450 },
      ]
    },
  ];

  const renderAtividades = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.contentCard}>
        <View style={{ height: 50 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterButtonsContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setOpenDate(true)}>
              <MaterialCommunityIcons name="calendar" size={24} color="black" />
              <Text>Data</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>

            {
              user?.userType == "ADM_DIKMA" && (
                <TouchableOpacity style={styles.filterButton} onPress={() => buildingPickerRef.current?.focus()} >
                  <FontAwesome6 name="location-dot" size={15} color="#43575F" />
                  <Text style={styles.filterButtonText}>{filter.building.label ? filter.building.label : "Prédios"}</Text>
                  <AntDesign name="caretdown" size={10} color="black" />
                </TouchableOpacity>
              )
            }

            <TouchableOpacity style={styles.filterButton} onPress={() => sectorPickerRef.current?.focus()} >
              <FontAwesome6 name="location-dot" size={15} color="#43575F" />
              <Text style={styles.filterButtonText}>{filter.sector.label ? filter.sector.label : "Setores"}</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterButton} onPress={() => enviromentPickerRef.current?.focus()} >
              <FontAwesome6 name="location-dot" size={15} color="#43575F" />
              <Text style={styles.filterButtonText}>{filter.environment.label ? filter.environment.label : "Ambiente"}</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Lista de filtros ativos */}
        {renderActiveFilters()}

        <Pie data={atividades} />
        <Donut data={atividades} />
        <ExecutionPie data={atividades} />
        <JustifyPie data={justificativas} />
        <OcurrencePie data={ocorrencias} />

      </View>
    </ScrollView >
  );

  const renderColaboradores = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.contentCard}>
        <TouchableOpacity style={[styles.filterButton, { width: "40%" }]}>
          <MaterialCommunityIcons name="calendar" size={24} color="black" />
          <Text>Data</Text>
          <AntDesign name="caretdown" size={10} color="black" />
        </TouchableOpacity>
        <View style={{ gap: 15 }}>
          {colaboradores.map((loc, index) => (
            <View key={index} style={styles.mainLocContainer}>
              <Text style={{ fontSize: 18, color: "#43575F", fontWeight: "bold", marginBottom: 10 }}>
                {loc.title}
              </Text>
              {loc.volume.map((vol, volIndex) => (
                <View key={volIndex} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather
                      name={vol.title === "Maior Volume" ? "arrow-up-right" : "arrow-down-left"}
                      size={24}
                      color={vol.title === "Maior Volume" ? "#00A614" : "#FFA44D"}
                    />
                    <Text style={{
                      fontSize: 16,
                      color: vol.title === "Maior Volume" ? "#00A614" : "#FFA44D",
                      fontWeight: 500
                    }}>
                      {vol.title}
                    </Text>
                  </View>
                  <View style={styles.containerLoc}>
                    <Text style={{ fontSize: 14, color: "#43575F" }}>Pátio Carvão:</Text>
                    <View style={{ flex: 1, height: 1, marginHorizontal: 8, borderWidth: 0.5, borderColor: "#000", borderStyle: "dashed" }} />
                    <Text>{vol.patio_carvao}</Text>
                  </View>
                  <View style={styles.containerLoc}>
                    <Text>Trat. Gás:</Text>
                    <Text style={{ flex: 1, alignSelf: "center" }}>{vol.trat_gas}</Text>
                    <Text>{vol.trat_gas}</Text>
                  </View>
                  <View style={styles.containerLoc}>
                    <Text>Trat. Gás 2:</Text>
                    <Text style={{ flex: 1 }}>{vol.Trat_gas_2}</Text>
                    <Text>{vol.Trat_gas_2}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
          <View style={styles.chartColumn}>
            <View style={[styles.pieWrapper, { width: '100%' }]}>
              <Text style={styles.pieTitle}>QTD. M² Limpo por Setor</Text>
              <PieChart data={pieDataJustificativass} showText textColor="black" radius={150} textSize={20} focusOnPress showValuesAsLabels showTextBackground textBackgroundRadius={26} />
            </View>
            <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
              {pieDataJustificativass.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.title}</Text>
                  </View>
                  <Text style={[styles.legendValue, { fontSize: 18, color: item.color }]}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.chartColumn}>
            <View style={[styles.pieWrapper, { width: '100%' }]}>
              <Text style={styles.pieTitle}>QTD. M² Limpo por Ambiente</Text>
              <PieChart data={pieDataJustificativass} showText textColor="black" radius={150} textSize={20} focusOnPress showValuesAsLabels showTextBackground textBackgroundRadius={26} />
            </View>
            <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
              {pieDataJustificativass.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.title}</Text>
                  </View>
                  <Text style={[styles.legendValue, { fontSize: 18, color: item.color }]}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.chartColumn}>
            <View style={[styles.pieWrapper, { width: '100%' }]}>
              <Text style={styles.pieTitle}>QTD. M² Limpo por Tipo</Text>
              <PieChart data={pieDataJustificativass} showText textColor="black" radius={150} textSize={20} focusOnPress showValuesAsLabels showTextBackground textBackgroundRadius={26} />
            </View>
            <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
              {pieDataJustificativass.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.title}</Text>
                  </View>
                  <Text style={[styles.legendValue, { fontSize: 18, color: item.color }]}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>

      <Picker
        style={{ display: "none" }}
        ref={enviromentPickerRef as React.MutableRefObject<Picker<number> | null>}
        selectedValue={filter?.environment?.id}
        onValueChange={(itemValue, itemIndex) => {
          setFilter((prevState) => ({ ...prevState, environment: { id: itemValue, label: ambientes?.[itemIndex]?.name } }));
        }}
      >
        {ambientes?.map((environment: { id: number; name: string }) => (
          <Picker.Item key={environment.id} label={environment.name} value={environment.id} />
        ))}
      </Picker>

      <Picker
        style={{ display: "none" }}
        ref={sectorPickerRef as React.MutableRefObject<Picker<number> | null>}
        selectedValue={filter?.sector?.id}
        onValueChange={(itemValue, itemIndex) => {
          setFilter((prevState) => ({ ...prevState, sector: { id: itemValue, label: setores?.[itemIndex]?.name } }));
        }}
      >
        {setores?.map((sector: { id: number; name: string }) => (
          <Picker.Item key={sector.id} label={sector.name} value={sector.id} />
        ))}
      </Picker>

      <Picker
        style={{ display: "none" }}
        ref={buildingPickerRef as React.MutableRefObject<Picker<number> | null>}
        selectedValue={filter?.building?.id}
        onValueChange={(itemValue, itemIndex) => {
          setFilter((prevState) => ({ ...prevState, building: { id: itemValue, label: predios?.[itemIndex]?.name } }));
        }}
      >
        {predios?.map((predio: { id: number; name: string }) => (
          <Picker.Item key={predio.id} label={predio.name} value={predio.id} />
        ))}
      </Picker>

      <View style={styles.sectionHeaderWrapper}>
        <TouchableOpacity
          style={[styles.sectionHeader, { borderRightColor: '#186b5427', borderRightWidth: 1 }]}
          onPress={() => setActiveTab("atividades")}
        >
          <View />
          <Text style={styles.sectionTitle}>Atividades</Text>
          <View style={[styles.activeBar, { opacity: activeTab === "atividades" ? 1 : 0 }]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setActiveTab("colaboradores")}
        >
          <View />
          <Text style={styles.sectionTitle}>Colaborador</Text>
          <View style={[styles.activeBar, { opacity: activeTab === "colaboradores" ? 1 : 0 }]} />
        </TouchableOpacity>
      </View>

      {activeTab === "atividades" ? renderAtividades() : renderColaboradores()}

      {(user?.userType === "ADM_DIKMA" || user?.userType === "OPERATIONAL") && (
        <View style={styles.fabContainer}>
          <Animated.View style={[styles.fabButton, tagStyle]}>
            <TouchableOpacity
              onPress={() => {
                toggleButtons();
                router.push("/tag" as never)
              }}
              style={[styles.innerButton, { backgroundColor: "#28A745" }]}
            >
              <MaterialCommunityIcons name="cellphone-nfc" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.fabButton, ocorrenciaStyle]}>
            <TouchableOpacity
              onPress={() => {
                toggleButtons();
                router.push("/criarOcorrencia" as never)
              }}
              style={[styles.innerButton, { backgroundColor: "#FF3B30" }]}
            >
              <AntDesign name="form" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.mainButton} onPress={toggleButtons}>
            <AntDesign name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <DatePickerModal
        locale="pt-BR"
        mode="range"
        visible={openDate}
        onDismiss={onDismiss}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onConfirm={onConfirm}
        presentationStyle="pageSheet"
        label="Selecione um período"
        saveLabel="Confirmar"
      />

    </View>
  );
}

// Estilos atualizados para incluir os novos componentes de filtro
const styles = StyleSheet.create({
  filterButtonText: {
    color: '#000',
    fontSize: 12,
  },
  filterButtonsContainer: {
    gap: 10,
    height: "100%",
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
  clearFilterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "500",
    marginLeft: 20
  },
  sectionHeaderWrapper: {
    width: "100%",
    flexDirection: "row",
    borderBottomColor: "#186b5427",
    borderBottomWidth: 1,
    justifyContent: "space-between"
  },
  sectionHeader: {
    width: "50%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000"
  },
  activeBar: {
    height: 5,
    width: "60%",
    backgroundColor: "#28A745",
    marginTop: 5,
    borderRadius: 2
  },
  contentCard: {
    padding: 10,
    gap: 20,
    width: Dimensions.get('window').width - 20
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F7F9FB",
  },
  pieTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#43575F",
    marginBottom: 10
  },
  chartColumn: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 10,
    marginBottom: 20
  },
  pieWrapper: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center"
  },
  pieLegend: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center"
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 100
  },
  legendText: {
    fontSize: 16,
    color: "#43575F"
  },
  legendValue: {
    fontSize: 20,
    color: "#43575F",
    marginLeft: 20
  },
  mainLocContainer: {
    borderWidth: 1,
    borderColor: "#E8F5E9",
    padding: 15,
    borderRadius: 10,
  },
  containerLoc: {
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    alignItems: "center",
  },
  mainButton: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#186B53",
    elevation: 6,
  },
  fabButton: {
    position: "absolute",
    bottom: 0,
    right: 8,
  },
  innerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 10,
    elevation: 5,
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