export function getStatusColor(status?: string): string {
    switch (status) {
        case "Grave":
            return "#DE494C";
        case "Pendente":
            return "#FFA44D";
        case "Concluído":
            return "#00A614";
        case "Aberto":
            return "#2E97FC";
        case "Leve":
            return "#FFD400";
        case "Aprovado":
            return "#00A614";
        case "Reprovado":
            return "#FF0000";
        case "Justificado":
            return "#00A614";
        default:
            return "#81A8B8";
    }
}

