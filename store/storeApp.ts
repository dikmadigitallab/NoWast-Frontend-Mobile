"use client";
import { create } from 'zustand';

interface AuthStore {
    id: number | null;
    email: string | null;
    documento: string | undefined | null;
    userType: 'DEFAULT' | 'ADM_DIKMA' | 'OPERATIONAL' | 'GESTAO' | 'ADM_CLIENTE' | 'DIKMA_DIRECTOR' | null;
    setId: (id: number | null) => void;
    setEmail: (email: string | null) => void;
    setDocumento: (documento: string | null) => void;
    setUserType: (userType: 'DEFAULT' | 'OPERATIONAL' | 'ADM_DIKMA' | 'GESTAO' | 'ADM_CLIENTE' | 'DIKMA_DIRECTOR' | null) => void;
}

const encrypt = (data: string): string => {
    return btoa(data);
};

const decrypt = (data: string): string => {
    try {
        return atob(data);
    } catch (err) {
        return '';
    }
};

export const useAuthStore = create<AuthStore>((set, get) => {

    let storedId: number | null = null;
    let storedEmail: string | null = null;
    let storedDocumento: string | null = null;
    let storedTipoUsuario: 'DEFAULT' | 'OPERATIONAL' | 'ADM_DIKMA' | 'GESTAO' | 'ADM_CLIENTE' | 'DIKMA_DIRECTOR' | null = null;

    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
            const decoded = decrypt(stored);
            try {
                const userData = JSON.parse(decoded);
                storedId = userData?.id || null;
                storedEmail = userData?.email || null;
                storedDocumento = userData?.documento || null;
                storedTipoUsuario = userData?.userType || null;
            } catch (err) {
                console.warn("Dados de usuário inválidos:", decoded);
            }
        }
    }

    return {
        id: storedId,
        email: storedEmail,
        documento: storedDocumento,
        userType: storedTipoUsuario,
        setId: (id) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', encrypt(JSON.stringify({ id, email: get().email, documento: get().documento, userType: get().userType })));
            }
            set({ id });
        },
        setEmail: (email) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', encrypt(JSON.stringify({ id: get().id, email, documento: get().documento, userType: get().userType })));
            }
            set({ email });
        },
        setDocumento: (documento) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', encrypt(JSON.stringify({ id: get().id, email: get().email, documento, userType: get().userType })));
            }
            set({ documento });
        },
        setUserType: (userType) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', encrypt(JSON.stringify({ id: get().id, email: get().email, documento: get().documento, userType })));
            }
            set({ userType });
        },
    };
});

