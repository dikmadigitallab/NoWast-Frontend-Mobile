import { create } from 'zustand';

type ModuleType = 'quedazero' | 'coleta' | 'residuos' | null;

interface ModuleStore {
    moduleType: ModuleType;
    setModuleType: (type: ModuleType) => void;
    clearModuleType: () => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
    moduleType: null,
    setModuleType: (type) => set({ moduleType: type }),
    clearModuleType: () => set({ moduleType: null }),
}));

