import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({ isAuth: false, login: () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  // Inicializa desde localStorage de forma sincrónica (evita el "parpadeo" a /login)
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem("auth.isAuth") === "true";
  });

  // Sync entre pestañas: si en otra pestaña hacen login/logout, se refleja acá
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth.isAuth") {
        setIsAuth(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (username = "") => {
    localStorage.setItem("auth.isAuth", "true");
    localStorage.setItem("auth.user", username);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("auth.isAuth");
    localStorage.removeItem("auth.user");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
