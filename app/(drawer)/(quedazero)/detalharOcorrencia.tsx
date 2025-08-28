import LoadingScreen from "@/components/carregamento";
import { AudioPlayer } from "@/components/reprodutorAudio";
import { useUpdateActivityStatus } from "@/hooks/atividade/aprove";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../contexts/authProvider";
import { useItemsStore } from "../../../store/storeOcorrencias";
import { StyledMainContainer } from "../../../styles/StyledComponents";

export default function DetalharOcorrência() {
  const { user } = useAuth();
  const { items } = useItemsStore();
  const { updateStatus } = useUpdateActivityStatus();

  if (!items) {
    return (
      <StyledMainContainer>
        <Text style={styles.title}>Detalhar Ocorrência</Text>
        <Text style={styles.text}>Nenhuma ocorrência selecionada.</Text>
      </StyledMainContainer>
    );
  }


  const handleFinalizeActivity = (status: string) => {
    updateStatus(status, {
      id: String(items.id),
      approvalStatus: status,
      approvalUpdatedByUserId: String(user?.id),
    });
  };

  if (!items) {
    return (<LoadingScreen />)
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} >
        <StyledMainContainer>
          <View style={{ padding: 10, marginBottom: 10, }}>
            <Text style={{ fontSize: 15 }}>Descrição da ocorrência.</Text>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.container}>

              <View style={styles.linha}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                  <Entypo name="calendar" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <Text style={styles.text}>{formatDate(items?.createdAt)}</Text>
              </View>

              <View style={styles.linha}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                  <FontAwesome6 name="user-tie" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <Text style={styles.textBold}>ID do Usuário:</Text>
                <Text style={styles.text}>{items?.userId}</Text>
              </View>

              <View style={styles.linha}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                  <Entypo name="flag" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <Text style={styles.textBold}>Status:</Text>
                <Text style={styles.text}>{items?.status}</Text>
              </View>

              <View style={styles.linha}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                  <Entypo name="text" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <Text style={styles.textBold}>Transcrição:</Text>
                <Text style={styles.text}>{items?.transcription}</Text>
              </View>

              <View style={styles.linha}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                  <MaterialCommunityIcons name="anvil" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <Text style={styles.textBold}>Peso:</Text>
                <Text style={styles.text}>{items?.weight} kg</Text>
              </View>
              <View style={[styles.linha, { height: 150, alignItems: "flex-start" }]}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                  <AntDesign name="camera" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                {
                  items?.imageUrls?.length > 0 ?
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 50 }}
                    >
                      {items?.imageUrls?.map((url: any, index: number) => (
                        <View key={index} style={{ width: 200, height: "100%", marginRight: 10 }}>
                          <Image
                            source={{ uri: url }}
                            style={styles.image}
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </ScrollView>
                    :
                    <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
                      <MaterialCommunityIcons name="image-off-outline" size={104} color="#43575F" />
                    </View>
                }
              </View>
              <View style={[styles.linha, { height: 70, alignItems: "flex-start" }]}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                  <MaterialIcons name="keyboard-voice" size={20} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <View style={{ marginTop: 5, width: "80%" }}>
                  <AudioPlayer source={items?.audioUrl} />
                </View>
              </View>
            </View>
          </View>
        </StyledMainContainer>
      </ScrollView>

      {/* <View style={styles.fixedButtonsContainer}>
        {
          (user?.userType === "ADM_DIKMA" || user?.userType === "ADM_CLIENTE") && items.approvalStatus === "PENDING" && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => handleFinalizeActivity("REJECTED")}
                style={styles.justifyButton}>
                <Text style={{ color: "#404944", fontSize: 16 }}>REPROVAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFinalizeActivity("APPROVED")}
                style={styles.doneButton}>
                <Text style={styles.doneButtonText}>APROVAR</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View> */}


    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f7f9fb"
  },
  scrollContent: {
    flexGrow: 1,
  },
  fixedButtonsContainer: {
    padding: 16,
    elevation: 4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
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
    gap: 2,
    paddingBottom: 20,
    flexDirection: "column",
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  buttonsContainer: {
    gap: 10,
    width: "100%",
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
});