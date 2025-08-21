import AprovacoStatus from "@/components/aprovacaoStatus";
import CapturaImagens from "@/components/capturaImagens";
import { useAuth } from "@/contexts/authProvider";
import { AntDesign, FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRef, useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { TextInput } from "react-native-paper";
import MapScreen from "../../../components/renderMapOcorrencias";
import { AudioPlayer } from "../../../components/reprodutorAudio";
import { useItemsStore } from "../../../store/storeOcorrencias";
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

  const { user } = useAuth();
  const modalizeRef = useRef<Modalize | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { items } = useItemsStore();

  const closeModal = () => {
    if (modalizeRef.current) {
      modalizeRef.current.close();
    }
  };

  const deletarAlteracoes = () => {
    closeModal();
    setModalVisible(false);
  };

  if (!items) {
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
            <View style={styles.linha}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                <Entypo name="calendar" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <Text style={styles.text}>
                {items.data} - {items.hora}
              </Text>
            </View>
            <View style={[styles.linha, { height: items.justificativa ? 250 : 40, alignItems: "flex-start" }]}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                <Entypo name="flag" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <View style={{ width: "100%", gap: 10 }}>
                <StatusContainer backgroundColor={getStatusColor(items?.status)}>
                  <Text style={styles.statusTextWhite}>
                    {items?.status === "Concluído" ? `Concluído em ${items?.dataConclusao} / ${items?.horaConclusao}` : items?.status}
                  </Text>
                </StatusContainer>
                {
                  items.justificativa && (
                    <View>
                      <View style={{ flexDirection: "row", gap: 10, height: "100%" }}>
                        <View style={{ width: "100%", flexDirection: "column", gap: 10 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                            <Text style={styles.text}>Motivo: {items.justificativa.motivo}</Text>
                          </ View>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                            <Text style={styles.text}>Descrição: {items.justificativa.descricao}</Text>
                          </ View>
                          <View style={styles.imageContainer}>
                            <Image source={items.justificativa.imagem as any} style={styles.image} />
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                }
              </View>
            </View>

            <View style={styles.linha}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                <FontAwesome6 name="user-tie" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <Text style={styles.textBold}>Encarregado:</Text>
              <Text style={styles.text}>{items.nome}</Text>
            </View>

            <View style={[styles.linha, { height: 150, alignItems: "flex-start" }]}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                <AntDesign name="camera" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <View style={{ flexDirection: "column", gap: 10 }}>
                <Text style={styles.text}>Fotos Registradas: {items.data_fotos_registradas} - {items.hora_fotos_registradas}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 50 }}>
                  {images.map((image, index) => (
                    <View key={index} style={{ width: 200, height: "100%", marginRight: 10 }}>
                      <Image source={image} style={styles.image} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={styles.linha}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                <MaterialCommunityIcons name="wheel-barrow" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <Text style={styles.textBold}>Material:</Text>
              <Text style={styles.text}>{items.material}</Text>
            </View>

            <View style={styles.linha}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                <MaterialCommunityIcons name="weight" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <Text style={styles.text}>{items.peso}</Text>
            </View>

            <View style={styles.linha}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                <FontAwesome5 name="briefcase-medical" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <Text style={styles.textBold}>Causa da queda:</Text>
              <Text style={styles.text}>{items.causa_queda}</Text>
            </View>

            <View style={styles.linha}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                <FontAwesome name="exclamation-triangle" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <Text style={styles.text}>{items.status}</Text>
            </View>

            <View style={[styles.linha, { height: 320, alignItems: "flex-start", marginTop: 5 }]}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "space-between", gap: 10 }]}>
                <FontAwesome6 name="location-dot" color="#43575F" size={15} />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <View style={styles.locationDetails}>
                <View style={styles.locationTextContainer}>
                  <View style={styles.coluna_localizacao}>
                    <Text style={styles.textBold}>Localização:</Text>
                    <Text style={[styles.text, { fontWeight: "700" }]}>Prédio: <Text style={{ fontWeight: 400 }}>{items.localizacao.local}</Text></Text>
                    <Text style={[styles.text, { fontWeight: "700" }]}>Setor: <Text style={{ fontWeight: 400 }}>{items.localizacao.origem}</Text></Text>
                    <Text style={[styles.text, { fontWeight: "700" }]}>Dimensão: <Text style={{ fontWeight: 400 }}>{items.localizacao.origem_detalhado}</Text></Text>
                  </View>
                </View>
                <View style={styles.mapContainer}>
                  <MapScreen location={items.localizacao} showMap={() => true} />
                </View>
              </View>
            </View>
            <View style={styles.linha}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                <FontAwesome6 name="helmet-safety" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <Text style={styles.textBold}>EPI:</Text>
              <Text style={styles.text}>Capacete - Luva - bota</Text>
            </View>

            <View style={[styles.linha, { height: 100, alignItems: "flex-start" }]}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                <FontAwesome name="microphone" size={15} color="#43575F" />
                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text style={[styles.textBold, { marginBottom: 10 }]}>Descrição por audio</Text>
                <AudioPlayer source="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
              </View>
            </View>

            <View style={styles.linha}>
              <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                <FontAwesome5 name="box-open" size={12} color="#43575F" />
              </View>
              <View style={styles.rowWithGap}>
                <Text style={styles.textBold}>Produtos:</Text>
                <Text style={styles.text}>Nenhum</Text>
              </View>
            </View>
          </View>

          {
            (user?.userType === "ADM_DIKMA" || user?.userType === "ADM_CLIENTE") && items.aprovacao === null && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.justifyButton}>
                  <Text style={{ color: "#404944", fontSize: 16 }}>REPROVAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>APROVAR</Text>
                </TouchableOpacity>
              </View>
            )
          }

          {
            (user?.userType === "ADM_DIKMA" || user?.userType === "ADM_CLIENTE") && items.aprovacao === "Aprovado" && (
              <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                <AprovacoStatus status={items?.aprovacao} date={items?.dataAprovacao} />
              </View>
            )
          }

          {
            (user?.userType === "ADM_DIKMA" || user?.userType === "ADM_CLIENTE") && items.aprovacao === "Reprovado" && (
              <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                <AprovacoStatus status={items?.aprovacao} date={items?.dataAprovacao} />
              </View>
            )
          }

        </View>
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        modalStyle={styles.modal}
        adjustToContentHeight
        handleStyle={styles.handle}
        keyboardAvoidingBehavior="padding"
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
          contentContainerStyle: { flexGrow: 1 }
        }}
      >
        <View>
          <View style={styles.modalHeader}>
            <View style={{ width: 40 }} />
            <Text style={styles.modalTitle}>Justificar</Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.closeButton}>
              <AntDesign name="close" size={26} color="#43575F" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>Selecione o motivo e envie sua justificativa</Text>
          <View style={{ gap: 10 }}>
            <TextInput mode="outlined" label="Motivo" outlineColor="#707974" activeOutlineColor="#707974" style={{ backgroundColor: '#fff', height: 56 }} />
            <TextInput mode="outlined" label="Descrição" outlineColor="#707974" activeOutlineColor="#707974" style={{ backgroundColor: '#fff', height: 120 }} multiline={true} numberOfLines={4} />
          </View>
        </View>
        <View style={styles.fotosContainer}>
          <CapturaImagens texto="Anexe a foto abaixo (obrigatório)" qtsImagens={1} />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={{ color: "#fff", fontSize: 16 }}>ENVIAR</Text>
          </TouchableOpacity>
        </View>
      </Modalize>

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalContent}>
                <Text style={{ alignSelf: "flex-start", color: "#404944", fontSize: 20 }}>Descartar Alterações?</Text>
                <Text style={{ alignSelf: "flex-start", color: "#404944", fontSize: 14, marginBottom: 20 }}>Todas as informações preenchidas serão perdidas.</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>NÃO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={deletarAlteracoes}>
                    <Text style={styles.buttonText}>SIM</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    gap: 5,
    height: 40,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  coluna: {
    width: 35,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  rowWithGap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5
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
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    width: "100%",
    elevation: 1
  },
  handle: {
    position: "absolute",
    top: 19,
    elevation: 1,
    width: "20%",
    backgroundColor: "#186B53",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#43575F"
  },
  modalSubtitle: {
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 10,
    color: "#43575F"
  },
  closeButton: {
    zIndex: 999,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#43575F',
    borderRadius: 50
  },
  fotosContainer: {
    width: "100%",
    flexDirection: "column",
    marginVertical: 10
  },
  headerFoto: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textFoto: {
    fontSize: 14,
    color: "#43575F",
    fontWeight: "600"
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: "100%",
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#186B53',
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerAddFoto: {
    gap: 7,
    height: 95,
    width: "100%",
    borderWidth: 1,
    alignSelf: "center",
    borderStyle: 'dashed',
    borderRadius: 4,
    paddingVertical: 20,
    marginBottom: 20,
    flexDirection: "column",
    alignItems: "center",
    borderColor: "#0B6780",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  addPhotoText: {
    fontSize: 16,
    color: "#0B6780",
    fontWeight: "500"
  },
  sendButton: {
    gap: 10,
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#186B53",
    justifyContent: "center",
    backgroundColor: "#186B53"
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 20
  },
  button: {
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#186B53',
    fontWeight: '500',
    fontSize: 20
  },
});