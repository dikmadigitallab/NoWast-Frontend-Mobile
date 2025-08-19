// components/StatusIndicator.tsx
import { StatusContainer } from '@/styles/StyledComponents';
import React from 'react';
import { Text } from 'react-native';

interface StatusIndicatorProps {
    status?: string;
}

const STATUS_MAPPING: Record<string, { color: string; translation: string }> = {
    "SEVERE": { color: "#DE494C", translation: "Grave" },
    "PENDING": { color: "#FFA44D", translation: "Pendente" },
    "COMPLETED": { color: "#00A614", translation: "Concluído" },
    "OPEN": { color: "#2E97FC", translation: "Aberto" },
    "MILD": { color: "#FFD400", translation: "Leve" },
    "APPROVED": { color: "#00A614", translation: "Aprovado" },
    "REJECTED": { color: "#FF0000", translation: "Rejeitado" },
    "JUSTIFIED": { color: "#00A614", translation: "Justificado" }
};

export function getStatusColor(status?: string): string {
    return STATUS_MAPPING[status?.toUpperCase() || '']?.color || "#81A8B8";
}

export function translateStatus(status?: string): string {
    return STATUS_MAPPING[status?.toUpperCase() || '']?.translation || "Desconhecido";
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
    const backgroundColor = getStatusColor(status);
    const translatedStatus = translateStatus(status);

    return (
        <StatusContainer backgroundColor={backgroundColor}>
            <Text style={{ color: "#fff", fontWeight: "500" }}>
                {translatedStatus}
            </Text>
        </StatusContainer>
    );
};

export default StatusIndicator;