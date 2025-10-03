import { useAuth } from "@/contexts/authProvider";
import { IAtividade } from "@/types/IAtividade";
import { filterStatusActivity } from "@/utils/statusActivity";
import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
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
    // Mantido por compatibilidade: se fornecido, será mapeado para startDate e endDate
    dateTimeFrom?: string | null;
    // Novos parâmetros suportados pela API de activity
    startDate?: string | null;
    endDate?: string | null;
    type: string;
    pagination?: boolean | null
    statusEnum?: string | null
    approvalStatus?: string | null
}

export const useGetActivity = ({ pagination = null, type, page = 1, pageSize = 1, query = null, supervisorId = null, positionId = null, managerId = null, responsibleManagerId = null, buildingId = null, environmentId = null, dateTimeFrom = null, startDate = null, endDate = null, statusEnum = null, approvalStatus = null }: UseGetParams) => {

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

        if (pagination !== null) {
            params.append("disablePagination", String(pagination));
        }

        params.append("page", String(page));

        if (query !== null) params.append("query", query.trim());
        if (pageSize !== null) params.append("pageSize", String(pageSize).trim());
        if (supervisorId !== null) params.append("supervisorId", String(supervisorId).trim());
        if (positionId !== null) params.append("positionId", String(positionId).trim());
        if (managerId !== null) params.append("managerId", String(managerId).trim());
        if (responsibleManagerId !== null) params.append("responsibleManagerId", String(responsibleManagerId).trim());
        if (buildingId !== null) params.append("buildingId", String(buildingId).trim());
        if (environmentId !== null) params.append("environmentId", String(environmentId).trim());
        // Compatibilidade: se dateTimeFrom vier e start/end não vierem, usar o mesmo dia para ambos
        const effectiveStartDate = startDate ?? (dateTimeFrom ? String(dateTimeFrom).trim() : null);
        const effectiveEndDate = endDate ?? (dateTimeFrom ? String(dateTimeFrom).trim() : null);
        if (effectiveStartDate !== null) params.append("startDate", effectiveStartDate);
        if (effectiveEndDate !== null) params.append("endDate", effectiveEndDate);
        if (statusEnum !== null) params.append("statusEnum", String(statusEnum).trim());
        if (approvalStatus !== null) params.append("approvalStatus", String(approvalStatus).trim());

        // Função para fazer uma requisição específica
        const makeRequest = async (endpoint: string) => {
            return await api.get(`${endpoint}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
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
                return null;
            });
        };

        // Função para processar dados de atividade
        const processActivityData = (items: any[]) => {
            return items?.map((item: any) => {
                const userJustification = item?.userActivities.map((userActivity: any) => ({
                    name: userActivity?.user?.person?.name || null,
                    justification: userActivity?.justification?.reason || null,
                    id: userActivity?.user?.id
                }));

                return {
                    id: item.id,
                    environmentId: item.environment?.id || null,
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
                    approvalStatus: filterStatusActivity(item?.approvalStatus) as "PENDING" | "APPROVED" | "REJECTED" | "PENDING_JUSTIFIED" | "JUSTIFIED",
                    local: item?.environment?.sector ? {
                        building: item.environment.sector.building.name,
                        description: item.environment.sector.description,
                        sector: item.environment.sector.name, // Adicionar nome do setor
                        latitude: item.environment.sector.latitude,
                        longitude: item.environment.sector.longitude
                    } : null,
                    ppes: item?.ppes || [],
                    tools: item?.tools || [],
                    products: item?.products || [],
                    transports: item?.transports || [],
                    activityFiles: item?.activityFiles.map((file: any) => file) || [],
                    userActivities: item?.userActivities || [],
                    file: item?.justification?.justificationFiles?.[0]?.file.url || null,
                    userJustification: userJustification || [],
                    // Manter o dateTime original para ordenação e formatação de exibição
                    dateTimeOriginal: item.dateTime || null,
                    dateTime: new Date(item.dateTime).toLocaleString('pt-BR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    }),
                    // Propriedades obrigatórias da interface IAtividade
                    createdAt: item.createdAt || new Date().toISOString(),
                    updatedAt: item.updatedAt || new Date().toISOString(),
                    deletedAt: item.deletedAt || null,
                    activityId: item.id || 0
                };
            }) || [];
        };

        // Função para processar dados de ocorrência
        const processOccurrenceData = (items: any[]) => {
            return items?.map((item: any) => {
                const occurrenceFiles = item.occurrenceFiles || [];

                return {
                    ...item,
                    imageUrls: occurrenceFiles
                        .filter((f: any) => f.fileType === 'IMAGE' && f.file?.url)
                        .map((f: any) => f.file.url),
                    audioUrl: occurrenceFiles
                        .find((f: any) => f.fileType === 'AUDIO' && f.file?.url)?.file.url || null
                };
            }) || [];
        };

        try {
            let allData: IAtividade[] = [];

            if (type === "Atividade") {
                const response = await makeRequest('/activity');
                if (response) {
                    allData = processActivityData(response.data.data.items);
                }
            } else if (type === "Ocorrencia") {
                const response = await makeRequest('/occurrence');
                if (response) {
                    allData = processOccurrenceData(response.data.data.items);
                }
            } else if (type === "" || type === "Todos") {
                // Fazer duas requisições quando for "Todos"
                const [activityResponse, occurrenceResponse] = await Promise.all([
                    makeRequest('/activity'),
                    makeRequest('/occurrence')
                ]);

                let activityData: IAtividade[] = [];
                let occurrenceData: IAtividade[] = [];

                if (activityResponse) {
                    activityData = processActivityData(activityResponse.data.data.items);
                }

                if (occurrenceResponse) {
                    occurrenceData = processOccurrenceData(occurrenceResponse.data.data.items);
                }

                // Combinar os dados
                allData = [...activityData, ...occurrenceData];
            }

            setData(allData);
            setLoading(false);
        } catch (error) {
            setError("Erro ao carregar dados");
            setData(null);
            setLoading(false);
        }
    }, [type, logout, page, pageSize, query, supervisorId, positionId, managerId, responsibleManagerId, buildingId, environmentId, dateTimeFrom, startDate, endDate, statusEnum, approvalStatus]);

    const refetch = useCallback(() => {
        get();
    }, [get]);

    // Executar automaticamente quando o hook é montado ou quando os parâmetros mudam
    useEffect(() => {
        get();
    }, [get]);

    return {
        loading,
        error,
        data,
        refetch
    };
};