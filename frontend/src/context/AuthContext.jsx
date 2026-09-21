import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current logged-in user
  const getMe = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      console.error("Get user error:", error);

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  // Register
  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setUser(user);

    return response.data;
  };

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setUser(user);

    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};