import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Logtastic from '@ofrepose/logtastic';

const AuthContext = createContext();

const API = 'http://localhost:5001/api/users/';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [darkmode, setDarkmode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) || false);
  const navigate = useNavigate();

  // Load user data from localStorage when the component mounts
  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      if (window.location.pathname !== '/auth/sign-up' && !localStorage.getItem('token')) {
        navigateToLogin();
      }
    }
    setLoading(false);
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
  }, [user]);


  const navigateToLogin = () => {
    navigate('/auth/sign-in');
  };

  const validateUser = () => {
    if (!isLoading && user) {
      return true
    } else if (isLoading) {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        return false;
      }
      return true;
    }
  }

  const getUser = async () => {
    let data;
    try {
      setLoading(true);

      const response = await fetch(API + '', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        }
      });

      const data = await response.json();
      if (data?.msg === 'Token is not valid' || data?.msg === 'User not found') {
        signOut();
      }
      setUser(() => data);
      Logtastic.log(`✅ API - Getting User 🐧`, { color: 'green', style: 'dim' })
    } catch (error) {
      Logtastic.err(`❌ API - Users: Error signing in: ${error.message}`, { escape: false })
      signOut();
      navigateToLogin();
    } finally {
      setLoading(false);
      return data;
    }
  }

  const getImages = async (filename) => {
    let data;
    try {
      setLoading(true);

      const response = await fetch(API + `screenshots/${filename}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        }
      });

      const data = await response.json();
      Logtastic.log(`✅ API - Images`, { color: 'green', style: 'italic' })
    } catch (error) {
      Logtastic.err(`❌ API - Users: Error getting image: ${error.message}`, { escape: false })
    } finally {
      setLoading(false);
      return data;
    }
  }

  const signUp = async (userData) => {
    let data;
    try {
      setLoading(true);

      const response = await fetch(API + 'register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      data = await response.json();
      setUser(data);
      Logtastic.log(`✅ API - Users - Register`, { color: 'green', style: 'italic' })
      if (data.firstname && data.email) {
        localStorage.setItem('token', data.token)
        navigate('/admin/default');
      }
    } catch (error) {
      Logtastic.err(`❌ API - Users - Register: ${error.message}`, { escape: false })
    } finally {
      setLoading(false);

    }
    return data;
  };

  const signIn = async (userData) => {

    let data;
    try {
      setLoading(true);

      const response = await fetch(API + '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      setUser(data);
      if (data.email && data.firstname) {
        localStorage.setItem('token', data.token)
        navigate('/admin/default');
      }
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
    return data;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigateToLogin();
  };


  const setMode = (darkMode) => {
    setDarkmode(() => darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        signUp,
        validateUser,
        getUser,
        getImages,
        setMode,
        darkmode
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
