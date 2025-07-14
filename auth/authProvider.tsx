import React, { createContext, useContext, useState } from "react";

interface TipoColaborador {
  id: number;
  nome: string;
  tipoApp: number;
}

interface UserData {
  id: number;
  email: string;
  nome: string;
  localizacao: number;
  createdAt: Date;
  updatedAt: Date;
  tipoColaborador: TipoColaborador;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  user: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const login = () => {
    setLoading(true);
    setTimeout(() => {

      const data = {
        id: 1,
        email: 'dikma@di.com.br',
        nome: 'Dikma',
        localizacao: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        tipoColaborador: {
          id: 1,
          tipoApp: 1,
          nome: 'Colaborador',
        },
      }

      setUser(data);
      setIsAuthenticated(true);
      setLoading(false);
    }, 500);
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
