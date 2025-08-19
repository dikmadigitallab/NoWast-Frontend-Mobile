import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";

export const useCloseActivity = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const close = async (data: any) => {
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
                        const imagesArray = value.map((uri, index) => ({
                            uri,
                            type: "image/jpeg",
                            name: `photo_${index}.jpg`,
                        }));
                        formData.append("image", JSON.stringify(imagesArray));
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

            const response = await fetch(`http://189.50.3.3:3308/activity/${data?.id}/close`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });

            console.log("Response:", formData);

            if (!response.ok) {
                const err = await response.json().catch(() => null);
                throw new Error(err?.messages?.[0] || "Erro ao finalizar atividade");
            }

            toast.success("Atividade finalizada com sucesso");
            setTimeout(() => router.push("/main" as never), 1000);
        } catch (err: any) {
            console.log("Erro ao finalizar atividade:", err);
            setLoading(false);
            toast.error(err.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    return {
        close,
        loading,
        error,
    };
};
