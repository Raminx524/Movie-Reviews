import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../Types/DataTypes";

interface AuthContext {
  userInfo: IUser | null | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  autoLogin: () => Promise<void>;
}
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContext | null>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const BASE_URL = "http://localhost:3000/api";
  const [userInfo, setUserInfo] = useState<IUser | null | undefined>(undefined);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      setUserInfo(res.data);
      localStorage.setItem("RAM-token", res.data.token);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("RAM-token");
  };

  const autoLogin = async (): Promise<void> => {
    const token = localStorage.getItem("RAM-token");
    if (!token) {
      setUserInfo(null);
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo({ ...res.data, token });
    } catch (error) {
      console.log("Auto-login failed:", error);
      logout();
    }
  };
  useEffect(() => {
    console.log("AuthContext initialized");

    autoLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, autoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export { AuthProvider, AuthContext };
