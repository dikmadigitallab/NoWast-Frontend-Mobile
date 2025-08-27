import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useRef, useState } from "react";
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CapturaImagens({ texto, qtsImagens, setForm }: { texto: string, qtsImagens: number, setForm?: (uri: any) => void }) {

    const [images, setImages] = useState<string[]>([]);
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraOpen, setCameraOpen] = useState(false);
    const [takenCount, setTakenCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const cameraRef = useRef<any>(null);

    const openCamera = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert("Permissão necessária", "Precisamos da câmera para tirar fotos.");
                return;
            }
        }
        if (images.length >= 3) {
            Alert.alert("Aviso", "Você já adicionou o máximo de 3 fotos.");
            return;
        }
        setTakenCount(0);
        setCameraOpen(true);
    };

    const compressImage = async (uri: string): Promise<string> => {
        try {
            // Comprime a imagem para 70% de qualidade e redimensiona se necessário
            const result = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1080 } }], // Redimensiona para largura máxima de 1080px
                {
                    compress: 0.7, // 70% de compressão
                    format: ImageManipulator.SaveFormat.JPEG,
                    base64: false
                }
            );
            return result.uri;
        } catch (error) {
            console.error('Erro ao comprimir imagem:', error);
            return uri; // Retorna a imagem original em caso de erro
        }
    };

    const takePicture = async () => {
        if (cameraRef.current && !isProcessing) {
            setIsProcessing(true);

            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8, // Qualidade inicial da captura
                    exif: false // Desativa dados EXIF para economizar espaço
                });

                // Comprime a imagem
                const compressedUri = await compressImage(photo.uri);

                const newImages = [...images, compressedUri];
                setImages(newImages);
                setForm && setForm(newImages);
                setTakenCount(prev => prev + 1);

                if (takenCount + 1 >= qtsImagens || images.length + 1 >= qtsImagens) {
                    setCameraOpen(false);
                }
            } catch (error) {
                console.error('Erro ao tirar foto:', error);
                Alert.alert("Erro", "Não foi possível processar a imagem.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    // Função para remover imagem
    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        setForm && setForm(newImages);
    };

    return (
        <View style={styles.containerFile}>
            <View style={styles.headerFoto}>
                <AntDesign name="camera" size={24} color="#43575F" />
                <Text style={styles.textFoto}>{texto}</Text>
            </View>

            <Text style={styles.fotoInfoText}>Máximo de {qtsImagens > 1 ? `${qtsImagens} Fotos` : "1 Foto"} </Text>

            <View style={styles.thumbnailsContainer}>
                {images.map((uri, index) => (
                    <View key={index} style={styles.thumbnailWrapper}>
                        <Image source={{ uri }} style={styles.thumbnail} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeImage(index)}
                        >
                            <AntDesign name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {images.length < qtsImagens && (
                <TouchableOpacity style={styles.containerAddFoto} onPress={openCamera}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={30} color="#186B53" />
                    <Text style={{ fontSize: 16, color: "#186B53", fontWeight: "500" }}>Abrir câmera</Text>
                </TouchableOpacity>
            )}

            <Modal visible={cameraOpen} animationType="slide">
                <CameraView ref={cameraRef} style={{ flex: 1 }}>
                    <View style={styles.cameraOverlay}>
                        <TouchableOpacity
                            style={[styles.snapButton, isProcessing && styles.snapButtonDisabled]}
                            onPress={takePicture}
                            disabled={isProcessing}
                        >
                            <View style={styles.innerSnapButton} />
                        </TouchableOpacity>
                        <Text style={styles.counterText}>{images.length} / {qtsImagens}</Text>
                        {isProcessing && (
                            <Text style={styles.processingText}>Processando...</Text>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setCameraOpen(false)}>
                            <AntDesign name="closecircle" size={32} color="white" />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    containerFile: {
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
    fotoInfoText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 34,
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
        flexDirection: "column",
        alignItems: "center",
        borderColor: "#186B53",
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    thumbnailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginVertical: 10,
    },
    thumbnailWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 30,
    },
    snapButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    snapButtonDisabled: {
        opacity: 0.5,
        borderColor: '#ccc',
    },
    innerSnapButton: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 25,
    },
    counterText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 18,
        fontWeight: '600'
    },
    processingText: {
        color: '#fff',
        marginTop: 5,
        fontSize: 14,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 30
    }
});