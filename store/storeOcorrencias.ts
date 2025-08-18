// store/useOcorrenciasStore.ts
import { IAtividade } from "@/types/IOcorrencias";
import { create } from "zustand";

interface OcorrenciasState {
  ocorrenciaSelecionada: IAtividade | null;
  setOcorrenciaSelecionada: (ocorrencia: IAtividade | null) => void;
}

export const useOcorrenciasStore = create<OcorrenciasState>((set) => ({
  ocorrenciaSelecionada: null,

  setOcorrenciaSelecionada: (ocorrencia) =>
    set({ ocorrenciaSelecionada: ocorrencia }),

}));
