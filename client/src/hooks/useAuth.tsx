import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
const authContext = createContext<any | null>(null);

export function ProvideAuth({ children }: { children: JSX.Element }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = (): any => {
  return useContext(authContext);
};

function decodeJWT(token: string): { [key: string]: any } | null {
  if (typeof token === 'string') {
    let decodedToken = jwt.decode(token, { json: true });
    if (decodedToken !== null) {
      return decodedToken;
    }
    return null;
  }
  return null;
}

interface IUserState {
  user: {
    userEmail: string;
    roles: string[];
  };
  login: (form: object) => Promise<boolean>;
  logout: () => void;
}

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState<any>(null);

  const login = (form: object): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      axios({ method: 'POST', url: '/auth', data: form })
        .then(response => {
          if (response.status === 200) {
            localStorage.setItem('token', response.data);
            const decodedToken = decodeJWT(response.data);
            if (decodedToken !== null) {
              setUser(decodedToken);
              resolve(true);
            }
          } else {
            setUser(null);
            reject(false);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    return true;
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      const decodedToken = jwt.decode(token, { json: true });
      if (decodedToken !== null) {
        setUser(decodedToken);
      }
    }
    return () => {
      setUser(null);
      localStorage.removeItem('token');
    };
  }, []);

  // Return the user object and auth methods
  return {
    user,
    login,
    logout
  };
}
