'use client';

import { useAuth } from "@/contexts/authProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import api from "../../api";



export interface UseGetParams {
    url: string,
    page?: number,
    pageSize?: number | null,
    query?: string | null,
    supervisorId?: number | null,
    positionId?: number | null,
    managerId?: number | null,
    responsibleManagerId?: number | null
    buildingId?: number | null,
    environmentId?: number | null
}

export const useGet = ({ url, page = 1, pageSize = null, query = null, supervisorId = null, positionId = null, managerId = null, responsibleManagerId = null, buildingId = null, environmentId = null }: UseGetParams) => {

    // const { userInfo } = useAuthStore();
    // const { setIdService } = useGetIDStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuth();

    const get = async () => {

        setError(null);
        setLoading(true);

        const authToken = await AsyncStorage.getItem("authToken");

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            logout();
            setLoading(false);
            return;
        }
        try {
            const params = new URLSearchParams();

            params.append("disablePagination", "true");
            params.append("page", String(page));

            if (query !== null) params.append("query", query.trim());
            if (pageSize !== null) params.append("pageSize", String(pageSize).trim());
            if (supervisorId !== null) params.append("supervisorId", String(supervisorId).trim());
            if (positionId !== null) params.append("positionId", String(positionId).trim());
            if (managerId !== null) params.append("managerId", String(managerId).trim());
            if (responsibleManagerId !== null) params.append("responsibleManagerId", String(responsibleManagerId).trim());
            if (buildingId !== null) params.append("buildingId", String(buildingId).trim());
            if (environmentId !== null) params.append("environmentId", String(environmentId).trim());

            const paramUrl = `/${url}?${params.toString()}`;

            const response = await api.get<any>(paramUrl, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });


            if (url === "service") {
                const refactorData = response.data.data.items.map((item: any) => item.serviceItems);
                setData(refactorData[0]);
            } else if (url === "environment") {

                const refactorData = response.data.data.items.map((item: any) => {
                    return {
                        id: item?.id,
                        name: item?.name,
                        description: item?.description,
                        areaM2: item?.areaM2,
                        setor: {
                            id: item?.sector?.id,
                            name: item?.sector?.name,
                            description: item?.sector?.description,
                            areaM2: item?.sector?.radius
                        },
                        predio: {
                            id: item?.sector?.building?.id,
                            name: item?.sector?.building?.name,
                            description: item?.sector?.building?.description,
                            areaM2: item?.sector?.building?.radius

                        }
                    };
                });

                setData(refactorData);
            }

            else {
                setData(response.data.data.items);
            }

        } catch (error) {
            setError("Erro ao buscar setores empresariais");
            if (error instanceof Error) {
                console.error("Error fetching business sectors:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setLoading(true);

        const delayDebounce = setTimeout(() => {
            get();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [query, supervisorId, positionId, managerId, page, pageSize, responsibleManagerId, buildingId, environmentId]);


    return {
        loading,
        error,
        data
    };
};