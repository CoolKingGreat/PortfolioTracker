import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { getMe, login as loginService } from "../services/authService";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initAuth = async () => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                const response = await getMe(storedToken);
                const userData = response.data;

                setUser(userData);
                setToken(storedToken);
            } catch (error) {
                console.error("Error fetching session", error);
                localStorage.removeItem("token");
            }
        }
        setIsLoading(false);
    }
    useEffect(() => {
        initAuth();
    }, [])

    const login = async (username: string, password: string) => {
        const response = await loginService(username, password);
        const { token: newToken } = response.data;

        localStorage.setItem('token', newToken);

        const userResponse = await getMe(newToken);
        const userData = userResponse.data;

        setUser(userData);
        setToken(newToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };
    const value = { user, token, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};