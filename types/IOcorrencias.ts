export interface IJustificativa {
  imagem: number[];
  descricao: string;
  motivo: string;
}

export interface ILocalizacao {
  latitude: number;
  longitude: number;
  local: string;
  origem: string;
  origem_detalhado: string;
  destino_final: string;
}

export interface IOcorrencias {
  id: string;
  tipo: number;
  nome: string;
  data: string;
  status: string;
  aprovacao: string;
  dataAprovacao: string;
  hora: string;
  peso: string;
  material: string;
  causa_queda: string;
  equipamento: string;
  descricao_audio: string;
  localizacao: ILocalizacao;
  foto: number[];
  dataConclusao: string;
  horaConclusao: string;
  data_fotos_registradas: string;
  hora_fotos_registradas: string;
  justificativa: IJustificativa;
}

