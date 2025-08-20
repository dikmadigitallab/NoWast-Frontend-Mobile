// Produto, Ferramenta, Transporte têm a mesma estrutura
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
  dimension: number;
  environment: string;
  manager: string;
  supervisor: string;
  ppe?: string;
  products: IItem[];
  tools: IItem[];
  transports: IItem[];
  activityFiles: string[];
  approvalDate?: string;
  statusEnum?: string;
  justifications?: any;
  justification?: any;

}
