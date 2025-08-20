import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";

export const useUpdateActivityStatus = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (data: { id: string; approvalStatus: string; approvalUpdatedByUserId: string; }) => {
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

            formData.append("approvalStatus", data.approvalStatus);
            formData.append("approvalDate", new Date().toISOString());
            formData.append("approvalUpdatedByUserId", data.approvalUpdatedByUserId);

            const response = await fetch(`http://189.50.3.3:3308/activity/${data.id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const err = await response.json().catch(() => null);
                throw new Error(err?.messages?.[0] || "Erro ao atualizar status da atividade");
            }

            toast.success("Atividade aprovada com sucesso!", { duration: 3000 });
            setTimeout(() => router.push("/main" as never), 1000);
        } catch (err: any) {
            setError(err.message || "Erro desconhecido");
            toast.error(err.message || "Erro desconhecido", { duration: 3000 });
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