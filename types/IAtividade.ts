

export interface ChecklistItem {
    id: number;
    name: string;
}

export interface Local {
    latitude: number;
    longitude: number;
}

export interface UserActivity {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    activityId: number;
}

export interface ActivityData {
    id: number;
    environment: string | null;
    dimension: number | null;
    supervisor: string | null;
    manager: string | null;
    statusEnum: string | null;
    justification: string | null;
    approvalDate: string | null;
    checklist: ChecklistItem[];
    approvalStatus: string | null;
    local: Local | null;
    ppe: any[];
    tools: any[];
    products: any[];
    transports: any[];
    activityFiles: string[];
    userActivities: UserActivity[];
    file: string | null;
    userJustification: string | null;
    dateTime: string;
}
