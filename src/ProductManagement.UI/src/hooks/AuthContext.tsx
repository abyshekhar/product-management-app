import { createContext, useContext, type ReactNode, useState } from "react";
import { loginApi, type LoginResponse } from "../api/authApi";

// 1. Define interfaces
interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: LoginResponse | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// 2. Create context (note: no namespace here!)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    const response = await loginApi({ username, password });
    setUser(response);
    setToken(response.token);
    localStorage.setItem("token", response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
