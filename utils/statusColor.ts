export function getStatusColor(status?: string): string {
    switch (status?.toUpperCase()) {
        case "SEVERE":
            return "#DE494C";
        case "PENDING":
            return "#FFA44D";
        case "COMPLETED":
            return "#00A614";
        case "OPEN":
            return "#2E97FC";
        case "MILD":
            return "#FFD400";
        case "APPROVED":
            return "#00A614";
        case "REJECTED":
            return "#FF0000";
        case "JUSTIFIED":
            return "#00A614";
        default:
            return "#81A8B8";
    }
}

