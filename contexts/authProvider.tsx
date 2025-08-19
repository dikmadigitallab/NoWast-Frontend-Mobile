import api from "@/hooks/api";
import UserData from "@/types/user";
import { toast } from "@backpackapp-io/react-native-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  loading: boolean;
  logout: () => void;
  user: UserData | null;
  isAuthenticated: boolean;
  login: (document: string, password: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [loading, setLoading] = useState(true); // começa carregando
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const storedUser = await AsyncStorage.getItem("user");

        if (token && storedUser) {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Erro ao carregar dados salvos", err);
      } finally {
        setLoading(false); ''
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (document?: string, password?: string) => {
    try {
      setLoading(true);

      const clearFormatedData = document?.replace(/[.\-]/g, "").trim();
      const response = await api.post("/auth", { document: clearFormatedData, password });
      const token = response.data.data.token;
      await AsyncStorage.setItem("authToken", token);

      const userInfo: UserData = {
        name: response.data.data.user.person.name,
        email: response.data.data.user.email,
        document: response.data.data.user.person.document,
        position: response.data.data.user.role.name,
        contractId: response.data.data.user.contractId,
        id: response.data.data.user.id
      };

      const roleName = response.data.data.user.role.name;
      if (roleName === "Administrador Dikma") {
        userInfo.userType = "ADM_DIKMA";
      } else if (roleName === "Diretor Dikma") {
        userInfo.userType = "DIKMA_DIRECTOR";
      } else if (roleName === "Administrador Cliente") {
        userInfo.userType = "ADM_CLIENTE";
      } else if (roleName === "Gestor de Contrato") {
        userInfo.userType = "GESTAO";
      } else {
        userInfo.userType = "OPERATIONAL";
      }

      setUser(userInfo);
      setIsAuthenticated(true);

      await AsyncStorage.setItem("user", JSON.stringify(userInfo));

      toast.success("Login realizado com sucesso!", { duration: 3000 });
    } catch (error) {
      toast.error("Documento ou senha inválidos!", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
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
