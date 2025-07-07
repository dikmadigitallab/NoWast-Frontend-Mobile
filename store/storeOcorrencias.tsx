// store/useOcorrenciasStore.ts
import { create } from "zustand";
import { IOcorrencias } from "../types/IOcorrencias";

interface OcorrenciasState {
  ocorrenciaSelecionada: IOcorrencias | null;
  setOcorrenciaSelecionada: (ocorrencia: IOcorrencias | null) => void;
}

export const useOcorrenciasStore = create<OcorrenciasState>((set) => ({
  ocorrenciaSelecionada: null,

  setOcorrenciaSelecionada: (ocorrencia) =>
    set({ ocorrenciaSelecionada: ocorrencia }),

}));
