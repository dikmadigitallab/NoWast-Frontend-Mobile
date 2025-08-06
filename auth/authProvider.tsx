import api from "@/hooks/api";
import { toast } from "@backpackapp-io/react-native-toast";
import React, { createContext, useContext, useState } from "react";

interface UserData {
  userType: string;
}

interface AuthContextProps {
  loading: boolean;
  logout: () => void;
  user: UserData | null;
  isAuthenticated: boolean;
  login: (document: string, password: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (data?: string, password?: string) => {

    setLoading(true);

    try {

      const clearFormatedData = data?.replace(/[.\-]/g, '')
      const response = await api.post('/auth', { document: clearFormatedData, password });
      document.cookie = `authToken=${response.data.data.token}; Path=/; Max-Age=3600; SameSite=Lax`;

      if (response.data.data.user.role.name === "Administrador Dikma") {
        setUser({ userType: "ADM_DIKMA" });
      } else if (response.data.data.user.role.name === "Diretor Dikma") {
        setUser({ userType: "DIKMA_DIRECTOR" });
      } else if (response.data.data.user.role.name === "Administrador Cliente") {
        setUser({ userType: "ADM_CLIENTE" });
      } else if (response.data.data.user.role.name === "Gestor de Contrato") {
        setUser({ userType: "GESTAO" });
      } else {
        setUser({ userType: "OPERATIONAL" });
      }

      toast.success("Login realizado com sucesso!");

      setTimeout(() => {
        setIsAuthenticated(true);
        setLoading(false);
      }, 500);

    } catch (error) {
      toast.error("Usuário ou senha inválidos!");
    } finally {
      setLoading(false);
    }

  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
