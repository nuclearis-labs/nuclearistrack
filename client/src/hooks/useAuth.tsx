import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  createContext
} from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(jwt.decode(localStorage.getItem('token')));

  const login = form => {
    return new Promise((resolve, reject) => {
      axios({ method: 'POST', url: '/auth', data: form })
        .then(response => {
          if (response.status === 200) {
            localStorage.setItem('token', response.data);
            setUser(jwt.decode(response.data));
            resolve(true);
          } else {
            setUser(false);
            reject();
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  };

  const logout = () => {
    setUser(false);
    return localStorage.removeItem('token');
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    getCurrentUser(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
  }, []);

  function getCurrentUser(cb) {
    let user = jwt.decode(localStorage.getItem('token'));
    cb(user);
  }

  // Return the user object and auth methods
  return {
    user,
    login,
    logout
  };
}
