import AprovacaoStatus from "@/components/aprovacaoStatus";
import { AntDesign, FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapScreen from "../../../components/renderMapOcorrencias";
import { AudioPlayer } from "../../../components/reprodutorAudio";
import { useOcorrenciasStore } from "../../../store/storeOcorrencias";
import { StatusContainer, StyledMainContainer } from "../../../styles/StyledComponents";
import { getStatusColor } from "../../../utils/statusColor";

const images = [
  require("../../../assets/images/ocorrencias.png"),
  require("../../../assets/images/ocorrencias.png"),
  require("../../../assets/images/ocorrencias.png"),
  require("../../../assets/images/ocorrencias.png"),
  require("../../../assets/images/ocorrencias.png"),
  require("../../../assets/images/ocorrencias.png"),
];

export default function DetalharOcorrencia() {
  const router = useRouter();
  const { ocorrenciaSelecionada } = useOcorrenciasStore();

  if (!ocorrenciaSelecionada) {
    return (
      <StyledMainContainer>
        <Text style={styles.title}>Detalhar Ocorrência</Text>
        <Text style={styles.text}>Nenhuma ocorrência selecionada.</Text>
      </StyledMainContainer>
    );
  }

  return (
    <StyledMainContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerDescription}>Descrição da ocorrência, aqui vai ficar a descrição que foi digitada da ocorrência.</Text>
            </View>

            <View style={styles.linha}>
              <View style={styles.coluna}>
                <Entypo name="calendar" size={15} color="#43575F" />
              </View>
              <Text style={styles.text}>
                {ocorrenciaSelecionada.data} - {ocorrenciaSelecionada.hora}
              </Text>
            </View>

            <View style={[styles.linha, { height: "auto", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.coluna}>
                <Entypo name="flag" size={15} color="#43575F" />
              </View>
              <StatusContainer backgroundColor={getStatusColor(ocorrenciaSelecionada?.status)}>
                <Text style={styles.statusTextWhite}>
                  {ocorrenciaSelecionada?.status === "Concluído" ?
                    `Concluído em ${ocorrenciaSelecionada?.dataConclusao} / ${ocorrenciaSelecionada?.horaConclusao}` :
                    ocorrenciaSelecionada?.status}
                </Text>
              </StatusContainer>
            </View>

            <View style={styles.linha}>
              <View style={styles.coluna}>
                <FontAwesome6 name="user-tie" size={15} color="#43575F" />
              </View>
              <Text style={styles.textBold}>Encarregado:</Text>
              <Text style={styles.text}>{ocorrenciaSelecionada.nome}</Text>
            </View>

            <View style={[styles.linha, { height: 140, alignItems: "flex-start" }]}>
              <View style={styles.coluna}>
                <AntDesign name="camera" size={15} color="#43575F" />
              </View>
              <View style={{ flexDirection: "column", gap: 10 }}>
                <Text style={styles.text}>Fotos Registradas: {ocorrenciaSelecionada.data_fotos_registradas} - {ocorrenciaSelecionada.hora_fotos_registradas}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterButtonsContainer}>
                  {images.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={image} style={styles.image} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.linha}>
              <View style={styles.coluna}>
                <MaterialCommunityIcons name="wheel-barrow" size={15} color="#43575F" />
              </View>
              <Text style={styles.textBold}>Material:</Text>
              <Text style={styles.text}>{ocorrenciaSelecionada.material}</Text>
            </View>

            <View style={styles.linha}>
              <View style={styles.coluna}>
                <MaterialCommunityIcons name="weight" size={15} color="#43575F" />
              </View>
              <Text style={styles.text}>{ocorrenciaSelecionada.peso}</Text>
            </View>

            <View style={styles.linha}>
              <View style={styles.coluna}>
                <FontAwesome5 name="briefcase-medical" size={15} color="#43575F" />
              </View>
              <Text style={styles.textBold}>Causa da queda:</Text>
              <Text style={styles.text}>{ocorrenciaSelecionada.causa_queda}</Text>
            </View>

            <View style={styles.linha}>
              <View style={styles.coluna}>
                <FontAwesome name="exclamation-triangle" size={15} color="#43575F" />
              </View>
              <Text style={styles.text}>{ocorrenciaSelecionada.status}</Text>
            </View>

            <View style={[styles.linha, { height: 320, alignItems: "flex-start" }]}>
              <View style={styles.coluna}>
                <FontAwesome6 name="location-dot" size={15} color="#43575F" />
              </View>
              <View style={styles.locationDetails}>
                <View style={styles.locationTextContainer}>
                  <View style={styles.coluna_localizacao}>
                    <Text style={styles.textBold}>Localização</Text>
                    <Text style={styles.text}>Local: {ocorrenciaSelecionada.localizacao.local}</Text>
                    <Text style={styles.text}>Origem: {ocorrenciaSelecionada.localizacao.origem}</Text>
                    <Text style={styles.text}>Origem: {ocorrenciaSelecionada.localizacao.origem_detalhado}</Text>
                    <Text style={styles.text}>Destino: {ocorrenciaSelecionada.localizacao.destino_final}</Text>
                  </View>
                </View>
                <View style={styles.mapContainer}>
                  <MapScreen location={ocorrenciaSelecionada.localizacao} showMap={() => true} />
                </View>
              </View>
            </View>

            <View style={styles.linha}>
              <View style={styles.coluna}>
                <FontAwesome6 name="helmet-safety" size={15} color="#43575F" />
              </View>
              <Text style={styles.textBold}>EPI:</Text>
              <Text style={styles.text}>Capacete - Luva - bota</Text>
            </View>

            <View style={[styles.linha, { height: 100, alignItems: "flex-start" }]}>
              <View style={styles.coluna}>
                <FontAwesome name="microphone" size={15} color="#43575F" />
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text style={[styles.textBold, { marginBottom: 10 }]}>Descrição por audio</Text>
                <AudioPlayer source="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
              </View>
            </View>

            <View style={styles.linha}>
              <View style={styles.coluna}>
                <FontAwesome5 name="box-open" size={15} color="#43575F" />
              </View>
              <Text style={styles.textBold}>Produtos:</Text>
              <Text style={styles.text}>Nenhum</Text>
            </View>
          </View>

          {ocorrenciaSelecionada?.aprovacao !== null ? (
            <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden" }}>
              <AprovacaoStatus status={ocorrenciaSelecionada?.aprovacao} date={ocorrenciaSelecionada?.dataAprovacao} />
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.justifyButton}>
                <Text style={{ color: "#404944", fontSize: 16 }}>REPROVAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/detalharAtividade" as never)}
                style={styles.doneButton}>
                <Text style={styles.doneButtonText}>APROVAR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </StyledMainContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#43575F",
    fontSize: 30,
    fontWeight: "bold",
  },
  wrapper: {
    flex: 1,
    gap: 20,
    flexDirection: "column",
  },
  container: {
    flexDirection: "column",
    gap: 2,
    paddingBottom: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
  },
  headerDescription: {
    color: "#43575F",
    fontSize: 14
  },
  text: {
    fontSize: 14,
    color: "#43575F",
  },
  textBold: {
    fontSize: 14,
    color: "#43575F",
    fontWeight: "bold"
  },
  statusTextWhite: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 40
  },
  coluna: {
    height: 35,
    width: 35,
    backgroundColor: "#EBEBEB",
    padding: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  imageContainer: {
    width: 150,
    height: 100,
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  coluna_localizacao: {
    flexDirection: "column"
  },
  locationDetails: {
    flexDirection: "column",
    gap: 10,
    width: "90%"
  },
  locationTextContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
    marginLeft: 2
  },
  mapContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#ccc",
    borderRadius: 20,
    overflow: "hidden"
  },
  filterButtonsContainer: {
    paddingRight: 50,
  },
  buttonsContainer: {
    gap: 10,
    padding: 10,
    marginBottom: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  justifyButton: {
    gap: 10,
    width: "48%",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#186B53",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  doneButton: {
    gap: 10,
    width: "48%",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#186B53",
    justifyContent: "center",
    backgroundColor: "#186B53"
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16
  }
});