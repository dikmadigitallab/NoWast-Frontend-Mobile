import { toast } from "@backpackapp-io/react-native-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import api from "../api";

export const useCreate = (url: string, redirect: string) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any, id?: number) => {

        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            return;
        }

        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === "image") {
                        if (value instanceof File) {
                            formData.append(key, value);
                        } else if (Array.isArray(value)) {
                            value.forEach((file, index) => {
                                if (file instanceof File) {
                                    formData.append(`${key}[${index}]`, file);
                                }
                            });
                        }
                    } else if (typeof value === "object" && !(value instanceof File)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value as string | Blob);
                    }
                }
            });


            await api.post(`/${url}`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken?.split("=")[1]}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Cadastro feito com sucesso");
            setTimeout(() => router.push(redirect as never), 1000);


        } catch (error) {
            setLoading(false);
            const errorMessage = (error as any)?.response?.data?.messages?.[0] || "Erro desconhecido";
            toast.error(errorMessage);
        }
    };

    return {
        create,
        loading,
        error
    };
};
