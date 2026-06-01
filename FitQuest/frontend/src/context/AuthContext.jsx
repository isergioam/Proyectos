import { createContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest, profileRequest } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      profileRequest()
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginRequest({ email, password });
    localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
    setUser(res.data.data.user);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await registerRequest({ username, email, password });
    localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
