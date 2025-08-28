import { useItemsStore } from "@/store/storeOcorrencias";
import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import api from '../api';

export const useUserJustification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { items, setitems } = useItemsStore();

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

            const response = await api.post(
                `/activity/${data?.activityId}/users/${data?.userId}/justify-absence`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const updatedResponse = response.data.data;

            // Transformar a response na estrutura do userJustification
            const transformedUserJustification = {
                id: updatedResponse.userId,
                justification: updatedResponse.justification?.reason,
                name: "" // Precisamos obter o nome de outra forma, pois não está na response
            };

            // Atualizar o userJustification no store
            if (items && items.userActivities) {
                const updatedActivities = items.userActivities.map((activity: any) => {
                    if (activity.user?.id === transformedUserJustification.id) {
                        return {
                            ...activity,
                            justification: {
                                ...activity.justification,
                                reason: transformedUserJustification.justification
                            }
                        };
                    }
                    return activity;
                });

                const newData = {
                    ...items,
                    userActivities: updatedActivities
                };

                setitems(newData);
            }


            if (response.status >= 200 && response.status < 300) {
                toast.success("Ausência justificada com sucesso");
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