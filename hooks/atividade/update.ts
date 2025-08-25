import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform } from 'react-native';
import api from "../api";

export const useCloseActivity = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const close = async (data: any, message: string) => {
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

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    if (key === "images" && Array.isArray(value)) {
                        const imageArray = value.map((uri, index) => ({
                            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                            type: "image/jpeg",
                            name: `photo_${index}.jpg`,
                        }));

                        formData.append("images", JSON.stringify(imageArray));
                    }
                    else if (key === "audio" && typeof value === "string" && value) {
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

            const response = await api.put(`/activity/${data?.id}/close`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000,
                }
            );

            toast.success(message);
            setTimeout(() => router.push("/main"), 1000);

        } catch (err: any) {
            console.error('Erro ao finalizar atividade:', err);

            const errorMessage = err.response?.data?.messages?.[0] ||
                err.response?.data?.message ||
                err.message ||
                "Erro ao finalizar atividade";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        close,
        loading,
        error
    };
};