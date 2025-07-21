import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Default guest user state
const defaultGuest = {
  username: "Guest User",
  email: null,
  walletAddress: "0x0000000000000000000000000000000000000000",
  isGuest: true
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultGuest);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:5050/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.user) {
        setUser({ ...response.data.user, isGuest: false });
      } else {
        // If no user data, revert to guest
        localStorage.removeItem('token');
        setUser(defaultGuest);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setUser(defaultGuest);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(defaultGuest);
  };

  const fetchWalletProfile = async (walletAddress) => {
    try {
      const response = await axios.get(`http://localhost:5050/api/auth/wallet/${walletAddress}`);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching wallet profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    fetchUserProfile,
    logout,
    fetchWalletProfile,
    isGuest: user.isGuest
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 