import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);

  const login = (tokenRecibido, datosUsuario) => {
    setToken(tokenRecibido);
    setUsuario(datosUsuario.nombre);
    setRol(datosUsuario.rol);
    localStorage.setItem("token", tokenRecibido);
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    setRol(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, usuario, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}