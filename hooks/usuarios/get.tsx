'use client';

import { Logout } from "@/app/utils/logout";
import { useEffect, useState } from "react";
import api from "../api";

export const useGetUsuario = ({ page = 1, pageSize = null, query = null, supervisorId = null, position = null, managerId = null }: { page?: number, pageSize?: number | null, query?: string | null, supervisorId?: number | null, position?: number | null, managerId?: number | null }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [users, setUsers] = useState<any>(null);

    const getUsuario = async () => {
        setError(null);
        setLoading(true);

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));

        if (!authToken) {
            setError("Token de autenticação não encontrado");
            Logout();
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
            if (position !== null) params.append("positionId", String(position).trim());
            if (managerId !== null) params.append("managerId", String(managerId).trim());

            const url = `/users?${params.toString()}`;

            const response = await api.get<any>(url,
                {
                    headers: {
                        Authorization: `Bearer ${authToken.split("=")[1]}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const refactory = response.data.data.items?.map((item: any) => ({
                id: item.id,
                personId: item.person?.id,
                name: item.person?.name,
                supervisorId: item?.supervisorId?.person?.name,
                manager: item?.manager?.person?.name,
                email: item?.person?.emails[0]?.email,
                status: item.status,
                ModuleType: item.ModuleType,
                role: item.role?.name,
                position: item.position?.name,
                endDate: item.contract?.endDate,
                startDate: item.contract?.startDate,
                epis: item.ppes,
                transports: item.transports,
                products: item.products,
                img: item.userFiles[0]?.file.url,
            })) || [];

            setUsers(response.data.data.items);
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
        const delayDebounce = setTimeout(() => {
            getUsuario();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [query, supervisorId, position, managerId, page, pageSize]);

    return {
        getUsuario,
        loading,
        error,
        users,
        data
    };
};
