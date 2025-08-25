import { useAuth } from "@/contexts/authProvider";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function Dashboard() {

  const { user } = useAuth();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState<"atividades" | "colaboradores">("atividades");

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

  const pieData = [
    { value: 35, color: "#2E97FC", gradientCenterColor: "#2E97FC" },
    { value: 50, color: "#00A614", gradientCenterColor: "#00A614" },
    { value: 25, color: "#FFA44D", gradientCenterColor: "#FFA44D" },
  ];

  const pieData3 = [
    { value: 80, prazo: "Dentro do prazo", percent: 56, color: '#28A745' },
    { value: 20, prazo: "Fora do prazo", percent: 40, color: '#DC3545' }
  ];

  const pieDataJustificativas = [
    { value: 54, color: '#177AD5', title: 'Falta' },
    { value: 40, color: '#79D2DE', title: 'Atestado' },
    { value: 20, color: '#ED6665', title: 'Falta de Máquina' },
    { value: 15, color: '#FFC107', title: 'Mud. Prior. Dikma' },
    { value: 10, color: '#8BC34A', title: 'Mud. Prior. Cliente' },
    { value: 8, color: '#9C27B0', title: 'Quebra' },
  ];

  const pieDataOcorrencias = [
    { value: 39, color: '#4CAF50', title: 'Nenhum' },
    { value: 38, color: '#FFC107', title: 'Leve' },
    { value: 27, color: '#F44336', title: 'Grave' },
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
            <TouchableOpacity style={styles.filterButton}>
              <MaterialCommunityIcons name="calendar" size={24} color="black" />
              <Text>Data</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text>Localização</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text>Prédios</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text>Setores</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text>Ambientes</Text>
              <AntDesign name="caretdown" size={10} color="black" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.chartRow}>
          <View style={styles.pieWrapper}>
            <Text style={styles.pieTitle}>Atividades</Text>
            <PieChart data={pieData} donut showGradient sectionAutoFocus radius={90} innerRadius={60} innerCircleColor={"#fff"} strokeColor={"#f7f9fb"} strokeWidth={6} centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.percentageText}>47%</Text>
                <Text style={styles.centerLabelText}>Excellent</Text>
              </View>
            )}
            />
          </View>
          <View style={styles.pieLegend}>
            {pieData.map((item, index) => (
              <View key={index}>
                <View style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>Concluídas</Text>
                </View>
                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.chartRow}>
          <View style={styles.pieWrapper}>
            <Text style={styles.pieTitle}>Aprovações</Text>
            <PieChart data={pieData} donut showGradient sectionAutoFocus radius={90} innerRadius={65} innerCircleColor={"#fff"} strokeColor={"#f7f9fb"} strokeWidth={19} centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.percentageText}>123.42</Text>
                <Text style={styles.centerLabelText}>Total</Text>
              </View>
            )}
            />
          </View>
          <View style={styles.pieLegend}>
            {pieData.map((item, index) => (
              <View key={index}>
                <View style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>Concluídas</Text>
                </View>
                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.chartColumn}>
          <Text style={{ alignSelf: "center", fontSize: 22, color: "#43575F", fontWeight: "bold" }}>Execuções</Text>
          <View style={[styles.pieWrapper, { width: '100%' }]}>
            <PieChart data={pieData3} donut showGradient sectionAutoFocus radius={80} innerRadius={70} innerCircleColor={"#fff"} strokeColor={"#f7f9fb"} centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.percentageText}>132</Text>
                <Text style={styles.centerLabelText}>Total</Text>
              </View>
            )}
            />
          </View>
          <View style={[styles.pieLegend, { width: '100%', flexDirection: 'row', gap: 50 }]}>
            {pieData3.map((item, index) => (
              <View key={index} style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                <View style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendText, { fontSize: 14, letterSpacing: -0.5 }]}>{item.prazo}</Text>
                </View>
                <Text style={[styles.legendValue, { fontSize: 20, color: item.color }]}>{item.value} | {item.percent}%</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.chartColumn}>
          <View style={[styles.pieWrapper, { width: '100%' }]}>
            <Text style={styles.pieTitle}>Motivos das justificativas</Text>
            <PieChart data={pieDataJustificativas} showText textColor="black" radius={150} textSize={20} focusOnPress showValuesAsLabels showTextBackground textBackgroundRadius={26}
            />
          </View>
          <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
            {pieDataJustificativas.map((item, index) => (
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
          <Text style={{ alignSelf: "center", fontSize: 22, color: "#43575F", fontWeight: "bold" }}>Ocorrências</Text>
          <View style={[styles.pieWrapper, { width: '100%' }]}>
            <PieChart data={pieDataOcorrencias} donut radius={80} innerRadius={65} innerCircleColor={"#F7F9FB"} strokeColor={"#f7f9fb"} showGradient sectionAutoFocus centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.percentageText}>100%</Text>
                <Text style={styles.centerLabelText}>Total</Text>
              </View>
            )}
            />
          </View>
          <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
            {pieDataOcorrencias.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.title}</Text>
                </View>
                <Text style={[styles.legendValue, { fontSize: 18, color: item.color }]}>{item.value}%</Text>
              </View>
            ))}
          </View>
        </View>
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
              <PieChart data={pieDataJustificativas} showText textColor="black" radius={150} textSize={20} focusOnPress showValuesAsLabels showTextBackground textBackgroundRadius={26} />
            </View>
            <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
              {pieDataJustificativas.map((item, index) => (
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
              <PieChart data={pieDataJustificativas} showText textColor="black" radius={150} textSize={20} focusOnPress showValuesAsLabels showTextBackground textBackgroundRadius={26} />
            </View>
            <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
              {pieDataJustificativas.map((item, index) => (
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
              <PieChart data={pieDataJustificativas} showText textColor="black" radius={150} textSize={20} focusOnPress showValuesAsLabels showTextBackground textBackgroundRadius={26} />
            </View>
            <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
              {pieDataJustificativas.map((item, index) => (
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
    </View>
  );
}

const styles = StyleSheet.create({
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

  contentWrapper: {
    width: "100%",
    gap: 10
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    alignSelf: "center",
    width: "95%",
    overflow: "hidden"
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#43575F",
    marginBottom: 20
  },
  pieTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#43575F",
    marginBottom: 10
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
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
  centerLabel: {
    justifyContent: "center",
    alignItems: "center"
  },
  percentageText: {
    fontSize: 22,
    color: "#000",
    fontWeight: "bold"
  },
  centerLabelText: {
    fontSize: 14,
    color: "#000"
  },
  pieLegend: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center"
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
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
  containerButtons: {
    zIndex: 999,
    width: "100%",
    flexDirection: "row",
    position: "absolute",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    bottom: 10,
  },
  buttons: {
    gap: 5,
    width: "49%",
    borderWidth: 1,
    borderRadius: 12,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#186B53",
    justifyContent: "center",
    backgroundColor: "#186B53"
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
  innerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});