'use client';

import { useAuth } from "@/contexts/authProvider";
import { filterStatusActivity } from "@/utils/statusActivity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import api from "../api";

export interface UseGetParams {
    page?: number,
    pageSize?: number | null,
    query?: string | null,
    supervisorId?: number | null,
    positionId?: number | null,
    managerId?: number | null,
    responsibleManagerId?: number | null,
    buildingId?: number | null,
    environmentId?: number | null
}

export const useGetActivity = ({
    page = 1,
    pageSize = null,
    query = null,
    supervisorId = null,
    positionId = null,
    managerId = null,
    responsibleManagerId = null,
    buildingId = null,
    environmentId = null
}: UseGetParams) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
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

            const paramUrl = `/activity?${params.toString()}`;

            const bearerToken = authToken.includes("=") ? authToken.split("=")[1] : authToken;

            const response = await api.get<any>(paramUrl, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    "Content-Type": "application/json",
                },
            });

            const refactory = response.data.data.items?.map((item: any) => ({
                id: item.id,
                environment: item.environment?.name,
                dimension: item.environment?.areaM2,
                supervisor: item?.supervisor?.person?.name,
                manager: item?.manager?.person?.name,
                approvalStatus: filterStatusActivity(item?.approvalStatus),
                ppe: item?.ppe,
                tools: item?.tools,
                products: item?.products,
                transports: item?.transports,
                activityFiles: item?.activityFiles.map((fileObj: any) => fileObj.file.url),
                dateTime: new Date(item.dateTime).toLocaleString('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })
            })) || [];

            setData(refactory);
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
