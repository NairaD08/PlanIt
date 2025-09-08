// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// tiny helper hook so you can do: const { user, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // 1) user state lives here (null = logged out)
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("planit-user");
    return raw ? JSON.parse(raw) : null;
  });

  // 2) keep localStorage in sync whenever user changes
  useEffect(() => {
    if (user) localStorage.setItem("planit-user", JSON.stringify(user));
    else localStorage.removeItem("planit-user");
  }, [user]);

  // 3) mock login / logout / register
  const login = ({ email, name }) => setUser({ email, name });
  const register = ({ email, name, password }) => {
    // in real life, you’d call an API and hash passwords.
    setUser({ email, name });
  };
  const logout = () => setUser(null);

  const value = { user, login, logout, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
