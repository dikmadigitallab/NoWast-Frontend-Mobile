import api from "@/hooks/api";
import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform } from 'react-native';
import ImageResizer from 'react-native-image-resizer';

export const useCreate = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Função para comprimir uma imagem
    const compressImage = async (imageUri: string): Promise<string> => {
        try {
            const compressedImage = await ImageResizer.createResizedImage(imageUri, 1024, 1024, 'JPEG', 70, 0,);
            return compressedImage.uri;
        } catch (error) {
            console.warn('Falha ao comprimir imagem, usando original:', error);
            return imageUri;
        }
    };

    const create = async (data: any, message: string) => {
        setError(null);
        setLoading(true);

        try {
            const authToken = await AsyncStorage.getItem("authToken");

            if (!authToken) {
                setError("Token de autenticação não encontrado");
                setLoading(false);
                return;
            }

            const formData = new FormData();

            // Processa e comprime as imagens
            if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                const compressedImages = await Promise.all(
                    data.images.map(async (imageUri: any, index: any) => {
                        if (imageUri && typeof imageUri === 'string') {
                            try {
                                const compressedUri = await compressImage(imageUri);
                                return {
                                    uri: Platform.OS === 'android' ? compressedUri : compressedUri.replace('file://', ''),
                                    type: "image/jpeg",
                                    name: `photo_${index}.jpg`,
                                };
                            } catch (error) {
                                console.warn(`Erro ao comprimir imagem ${index}:`, error);
                                return {
                                    uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
                                    type: "image/jpeg",
                                    name: `photo_${index}.jpg`,
                                };
                            }
                        }
                        return null;
                    })
                );

                // Adiciona apenas as imagens válidas
                compressedImages.forEach((image) => {
                    if (image) {
                        formData.append("images", image as any);
                    }
                });
            }

            // Processa os outros campos
            Object.entries(data).forEach(([key, value]) => {
                if (key === "images") return;

                if (value !== undefined && value !== null && value !== "") {
                    if (key === "audio" && typeof value === "string" && value) {
                        formData.append("audio", {
                            uri: Platform.OS === 'android' ? value : value.replace('file://', ''),
                            type: "audio/mpeg",
                            name: "audio.mp3",
                        } as any);
                    }
                    else if (typeof value === "object" && !Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));
                    }
                    else if (typeof value !== "object") {
                        formData.append(key, String(value));
                    }
                }
            });

            const response = await api.post(`/occurrence`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 60000,
                }
            );

            toast.success(message);
            setTimeout(() => router.push("/listagem"), 1000);

        } catch (err: any) {
            console.error('Erro ao finalizar atividade:', err);

            const errorMessage = err.response?.data?.messages?.[0] ||
                err.response?.data?.message ||
                err.message ||
                "Erro ao finalizar atividade";

            setError(errorMessage);
            console.log(errorMessage)
            toast.error(errorMessage);

            if (err.response?.status === 413) {
                toast.error("Tamanho total dos dados muito grande. Tente reduzir o tamanho das imagens ou do áudio.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        create,
        loading,
        error
    };
};