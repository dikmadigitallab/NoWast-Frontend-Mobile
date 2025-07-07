import { create } from 'zustand';

type UserType = 'quedazero' | 'coleta' | 'residuos' | null;

interface AuthStore {
    userType: UserType;
    setUserType: (type: UserType) => void;
    clearUserType: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    userType: null,
    setUserType: (type) => set({ userType: type }),
    clearUserType: () => set({ userType: null }),
}));

