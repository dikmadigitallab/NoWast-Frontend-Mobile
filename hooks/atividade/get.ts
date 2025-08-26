import { useAuth } from "@/contexts/authProvider";
import { IAtividade } from "@/types/IAtividade";
import { filterStatusActivity } from "@/utils/statusActivity";
import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import api from "../api";

export interface UseGetParams {
    page?: number;
    pageSize?: number | null;
    query?: string | null;
    supervisorId?: number | null;
    positionId?: number | null;
    managerId?: number | null;
    responsibleManagerId?: number | null;
    buildingId?: number | null;
    environmentId?: number | null;
    dateTimeFrom?: string | null;
}

export const useGetActivity = ({ page = 1, pageSize = null, query = null, supervisorId = null, positionId = null, managerId = null, responsibleManagerId = null, buildingId = null, environmentId = null, dateTimeFrom = null }: UseGetParams) => {

    const { logout } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IAtividade[] | null>(null);

    const get = useCallback(async () => {
        setError(null);

        const authToken = await AsyncStorage.getItem("authToken");

        if (!authToken) {
            toast.error("Token de autenticação expirado!", { duration: 3000 });
            setError("Token de autenticação não encontrado");
            logout();
            setLoading(false);
            return;
        }

        setLoading(true);
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
        if (dateTimeFrom !== null) params.append("dateTimeFrom", String(dateTimeFrom).trim());

        const paramUrl = `/activity?${params.toString()}`;

        const bearerToken = authToken.includes("=") ? authToken.split("=")[1] : authToken;

        const response = await api.get(paramUrl, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",
            },
        }).catch((error) => {
            if (error.response?.status === 401) {
                toast.error("Token de autenticação expirado!", { duration: 3000 });
                setError("Unauthorized - Sessão expirada");
                setTimeout(() => {
                    logout();
                }, 1000);
            } else {
                setError(error.response?.data?.messages?.[0] || "Erro ao carregar dados");
            }
            setData(null);
            return null;
        });

        if (!response) {
            setLoading(false);
            return;
        }

        const refactory: IAtividade[] = response.data.data.items?.map((item: any) => {

            const data = item.userActivities.map((userActivity: any) => userActivity);
            const data2 = data.map((userActivity: any) => userActivity.user);
            const data3 = data2.map((userActivity: any) => userActivity.justifications);

            return {
                id: item.id,
                environment: item.environment?.name || null,
                dimension: item.environment?.areaM2 || null,
                supervisor: item?.supervisor?.person?.name || null,
                manager: item?.manager?.person?.name || null,
                statusEnum: item?.statusEnum || null,
                justification: item?.justification || null,
                approvalDate: item?.approvalDate || null,
                checklist: item?.checklists?.map((checklist: any) => ({
                    id: checklist.serviceItem.id,
                    name: checklist.serviceItem.name
                })) || [],
                approvalStatus: filterStatusActivity(item?.approvalStatus),
                local: item?.environment?.sector ? {
                    latitude: item.environment.sector.latitude,
                    longitude: item.environment.sector.longitude
                } : null,
                ppes: item?.ppes || [],
                tools: item?.tools || [],
                products: item?.products || [],
                transports: item?.transports || [],
                activityFiles: item?.activityFiles[0],
                userActivities: item?.userActivities || [],
                file: item?.justification?.justificationFiles?.[0]?.file.url || null,
                userJustification: data3[1]?.[0]?.description || null,
                dateTime: new Date(item.dateTime).toLocaleString('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })
            };
        }) || [];

        setData(refactory);
        setLoading(false);
    }, [logout, page, pageSize, query, supervisorId, positionId, managerId, responsibleManagerId, buildingId, environmentId, dateTimeFrom]);

    const refetch = useCallback(() => {
        get();
    }, [get]);

    return {
        loading,
        error,
        data,
        refetch
    };
};