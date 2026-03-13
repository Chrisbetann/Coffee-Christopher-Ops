import { createContext, useContext, useState } from 'react';
import { adminLogin } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cc_token'));
  const [email, setEmail] = useState(() => localStorage.getItem('cc_email'));

  async function login(emailVal, password) {
    const { data } = await adminLogin(emailVal, password);
    localStorage.setItem('cc_token', data.token);
    localStorage.setItem('cc_email', data.email);
    setToken(data.token);
    setEmail(data.email);
  }

  function logout() {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_email');
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, email, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
