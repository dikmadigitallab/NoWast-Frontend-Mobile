// store/useItemsStore.ts
import { IAtividade } from "@/types/IOcorrencias";
import { create } from "zustand";

interface ItemsState {
  items: IAtividade | null;
  setitems: (items: IAtividade | null) => void;
}

export const useItemsStore = create<ItemsState>((set) => ({
  items: null,

  setitems: (items) =>
    set({ items: items }),

}));
