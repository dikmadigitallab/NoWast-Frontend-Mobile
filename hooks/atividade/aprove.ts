import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import api from "../api";

export const useUpdateActivityStatus = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (aprov: string, data: { id: string; approvalStatus: string; approvalUpdatedByUserId: string; }) => {
        setError(null);
        setLoading(true);

        try {
            const authToken = await AsyncStorage.getItem("authToken");

            if (!authToken) {
                setError("Token de autenticação não encontrado");
                setLoading(false);
                return;
            }

            const params = new URLSearchParams();
            params.append("approvalStatus", data.approvalStatus);
            params.append("approvalDate", new Date().toISOString());
            params.append("approvalUpdatedByUserId", data.approvalUpdatedByUserId);

            const response = await api.patch(`/activity/${data.id}`,
                params.toString(),
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const successMessage = aprov === "APPROVED"
                ? "Atividade aprovada com sucesso"
                : "Atividade reprovada com sucesso";

            toast.success(successMessage, { duration: 3000 });
            setTimeout(() => router.push("/listagem"), 1000);

        } catch (err: any) {
            console.error('Erro na requisição:', err);

            const errorMessage = err.response?.data?.messages?.[0] ||
                err.response?.data?.message ||
                err.message ||
                "Erro desconhecido ao conectar com o servidor";

            setError(errorMessage);
            toast.error(errorMessage, { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return {
        updateStatus,
        loading,
        error,
    };
};