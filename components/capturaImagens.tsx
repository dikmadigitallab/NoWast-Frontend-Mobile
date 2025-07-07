import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function CapturaImagens({ texto, qtsImagens }: { texto: string, qtsImagens: number }) {


    const [images, setImages] = useState<string[]>([]);

    const pickImage = async () => {
        if (images.length >= 3) {
            Alert.alert("Aviso", "Você já adicionou o máximo de 3 fotos.");
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para adicionar fotos.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: qtsImagens > 1 ? true : false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedUris = result.assets.map(asset => asset.uri);

            const remainingSlots = 3 - images.length;
            const urisToAdd = selectedUris.slice(0, remainingSlots);

            setImages(prev => [...prev, ...urisToAdd]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
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
                <TouchableOpacity style={styles.containerAddFoto} onPress={pickImage}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={30} color="#0B6780" />
                    <Text style={{ fontSize: 16, color: "#0B6780", fontWeight: "500" }}>Adicionar foto</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    buttons: {
        marginVertical: 20,
        width: "100%",
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#186B53",
        justifyContent: "center",
        backgroundColor: "transparent"
    },
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
        width: "90%",
        borderWidth: 1,
        alignSelf: "center",
        borderStyle: 'dashed',
        borderRadius: 4,
        paddingVertical: 20,
        flexDirection: "column",
        alignItems: "center",
        borderColor: "#0B6780",
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
});