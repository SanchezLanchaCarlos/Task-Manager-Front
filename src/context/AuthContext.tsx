import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (e) {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
          localStorage.removeItem('authUser');
        }
      }
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    setAuthReady(true);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  if (!authReady) return null;

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      logout,
      isAuthenticated: !!token && !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
