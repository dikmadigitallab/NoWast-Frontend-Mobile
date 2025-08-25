import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import api from '../api';

export const useUserJustification = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const justification = async (data: any) => {
        setError(null);
        setLoading(true);

        const authToken = await AsyncStorage.getItem("authToken");

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    if (key === "images" && Array.isArray(value)) {
                        value.forEach((uri, index) => {
                            formData.append("images", {
                                uri,
                                type: "image/jpeg",
                                name: `photo_${index}.jpg`,
                            } as any);
                        });
                    }
                    else if (key === "audio" && typeof value === "string" && value) {
                        formData.append("audio", {
                            uri: value,
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

            const response = await api.post(`/activity/${data?.activityId}/users/${data?.userId}/justify-absence`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status >= 200 && response.status < 300) {
                toast.success("Ausência justificada com sucesso");
                setTimeout(() => router.push("/main" as never), 1000);
            } else {
                throw new Error(response.data?.messages?.[0] || "Erro ao justificar atividade");
            }

        } catch (err: any) {
            setLoading(false);
            const errorMessage = err.response?.data?.messages?.[0] ||
                err.response?.data?.message ||
                err.message ||
                "Erro desconhecido";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        justification,
        loading,
        error,
    };
};