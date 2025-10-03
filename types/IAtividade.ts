

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


export interface IItem {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    responsibleManagerId: number;
}


export interface IAtividade {
    id: number;
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "PENDING_JUSTIFIED" | "JUSTIFIED";
    dateTime: string;
    dateTimeOriginal?: string;
    dimension: number;
    environment: string;
    manager: string;
    supervisor: string;
    ppes?: string;
    products: IItem[];
    tools: IItem[];
    transports: IItem[];
    activityFiles: string[];
    userActivities: string[];
    approvalDate?: string;
    statusEnum?: string;
    justifications?: any;
    justification?: any;
    supervisorId?: number;
    positionId?: number;
    managerId?: number;
    responsibleManagerId?: number;
    buildingId?: number;
    environmentId?: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    activityId: number;
    userJustification?: string;

}
