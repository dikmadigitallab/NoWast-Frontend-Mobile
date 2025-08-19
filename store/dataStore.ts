import { create } from 'zustand';


interface DataStore {
    data: null | Array<any>;
    setData: (data: Array<any>) => void;
}

export const useDataStore = create<DataStore>((set) => ({
    data: null,
    setData: (data) => set({ data })
}));

