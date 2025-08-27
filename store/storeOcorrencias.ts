// store/useItemsStore.ts
import { create } from "zustand";

interface ItemsState {
  items: any | null;
  setitems: (items: any | null) => void;
}

export const useItemsStore = create<ItemsState>((set) => ({
  items: null,

  setitems: (items) =>
    set({ items: items }),

}));
