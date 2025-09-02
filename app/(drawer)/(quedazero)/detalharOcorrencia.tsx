import LoadingScreen from "@/components/carregamento";
import { AudioPlayer } from "@/components/reprodutorAudio";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useState } from "react"; // Adicione o useState
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"; // Adicione TouchableOpacity, Modal e TouchableWithoutFeedback
import { useItemsStore } from "../../../store/storeOcorrencias";
import { StyledMainContainer } from "../../../styles/StyledComponents";

export default function DetalharOcorrência() {

  const { items } = useItemsStore();

  // Estados para o visualizador de imagem
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  // Função para abrir o visualizador de imagem
  const openImageViewer = (imageUrl: string, images: string[], index: number) => {
    setSelectedImage(imageUrl);
    setAllImages(images);
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  // Funções para navegar entre imagens
  const goToNextImage = () => {
    if (selectedImageIndex < allImages.length - 1) {
      const nextIndex = selectedImageIndex + 1;
      setSelectedImageIndex(nextIndex);
      setSelectedImage(allImages[nextIndex]);
    }
  };

  const goToPrevImage = () => {
    if (selectedImageIndex > 0) {
      const prevIndex = selectedImageIndex - 1;
      setSelectedImageIndex(prevIndex);
      setSelectedImage(allImages[prevIndex]);
    }
  };

  // Check if items is undefined or null first
  if (!items) {
    return <LoadingScreen />;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Data não disponível";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
    } catch (error) {
      return "Data inválida";
    }
  };

  // Safe check for imageUrls
  const hasImages = items.imageUrls && Array.isArray(items.imageUrls) && items.imageUrls.length > 0;

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <StyledMainContainer>
          <View style={{ padding: 10, marginBottom: 10 }}>
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
                <Text style={styles.text}>{items?.userId || "Não disponível"}</Text>
              </View>

              <View style={styles.linha}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                  <Entypo name="flag" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <Text style={styles.textBold}>Status:</Text>
                <Text style={styles.text}>{items?.status || "Não disponível"}</Text>
              </View>

              <View style={styles.linha}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                  <Entypo name="text" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <Text style={styles.textBold}>Transcrição:</Text>
                <Text style={styles.text}>{items?.transcription || "Nenhuma transcrição disponível"}</Text>
              </View>

              <View style={styles.linha}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                  <MaterialCommunityIcons name="anvil" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                <Text style={styles.textBold}>Peso:</Text>
                <Text style={styles.text}>{items?.weight ? `${items.weight} kg` : "Não disponível"}</Text>
              </View>

              <View style={[styles.linha, { height: 150, alignItems: "flex-start" }]}>
                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                  <AntDesign name="camera" size={15} color="#43575F" />
                  <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                </View>
                {hasImages ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 50 }}
                  >
                    {items.imageUrls.map((url: string, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={{ width: 200, height: "100%", marginRight: 10 }}
                        onPress={() => openImageViewer(url, items.imageUrls, index)}
                      >
                        <Image
                          source={{ uri: url }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <MaterialCommunityIcons name="image-off-outline" size={104} color="#43575F" />
                    <Text style={styles.text}>Nenhuma imagem disponível</Text>
                  </View>
                )}
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

      {/* Modal do Visualizador de Imagem */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        onRequestClose={() => setImageViewerVisible(false)}
        animationType="fade"
      >
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity
            style={styles.closeImageViewerButton}
            onPress={() => setImageViewerVisible(false)}
          >
            <AntDesign name="close" size={30} color="#fff" />
          </TouchableOpacity>

          {allImages.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton]}
                onPress={goToPrevImage}
                disabled={selectedImageIndex === 0}
              >
                <AntDesign name="left" size={30} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={goToNextImage}
                disabled={selectedImageIndex === allImages.length - 1}
              >
                <AntDesign name="right" size={30} color="#fff" />
              </TouchableOpacity>
            </>
          )}

          <TouchableWithoutFeedback onPress={() => setImageViewerVisible(false)}>
            <View style={styles.imageViewerContent}>
              <Image
                source={{ uri: selectedImage || '' }}
                style={styles.fullSizeImage}
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>

          {allImages.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {allImages.length}
              </Text>
            </View>
          )}
        </View>
      </Modal>
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
  // Estilos do visualizador de imagem
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
  },
  closeImageViewerButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 10,
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});