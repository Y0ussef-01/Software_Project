import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";      

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedPayload = jwtDecode(storedToken);

        const currentTime = Date.now() / 1000;
        if (decodedPayload.exp && decodedPayload.exp < currentTime) {
          throw new Error("Token Expired");
        }

        setToken(storedToken);
        setRole(decodedPayload.role);

        setUser(
          decodedPayload.user || {
            id: decodedPayload.id,
            name: decodedPayload.name,
          },
        );
      } catch (error) {
        console.error("Invalid or expired token detected.");
        logout();
      }
    }
    setIsAuthLoading(false);
  }, []);

  const login = (userData, userToken, userRole) => {
    setUser(userData);
    setToken(userToken);
    setRole(userRole);

    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ user, role, token, login, logout, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => useContext(AuthContext);
