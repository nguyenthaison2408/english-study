// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ================= LOAD USER =================
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUserFromStorage();

      if (storedToken) {
        setToken(storedToken);

        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }

        try {
          const userData = await authService.getCurrentUserFromAPI();
          setUser(userData);
          authService.saveUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          if (error.response?.status === 401) {
            authService.logout();
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // ================= AUTH =================
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.token) {
        authService.saveToken(response.token);
        setToken(response.token);

        const userData = await authService.getCurrentUserFromAPI();
        authService.saveUser(userData);
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true };
      }

      return { success: false, error: 'Đăng ký thất bại' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Đăng ký thất bại'
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);

      if (!response.token) {
        return { success: false, error: 'Không nhận được token' };
      }

      authService.saveToken(response.token);
      setToken(response.token);

      const userData = await authService.getCurrentUserFromAPI();
      authService.saveUser(userData);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Đăng nhập thất bại'
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // ================= USER =================
  const updateProfile = async (data) => {
    try {
      if (!user?._id) {
        return { success: false, error: 'Không tìm thấy user' };
      }

      const updatedUser = await authService.updateUser(data, user._id);
      authService.saveUser(updatedUser);
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Cập nhật thất bại'
      };
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUserFromAPI();
      authService.saveUser(userData);
      setUser(userData);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const addXp = async (userId, xp) => {
    try {
      await authService.addXp(userId, xp);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const getAllUser = async () => {
    try {
      const data = await authService.getAllUser();
      return { success: true, data };
    } catch {
      return { success: false };
    }
  };

  // ================= FRIEND =================
  const addFriends = async (id) => {
    try {
      const data = await authService.addFriends(id);
      return { success: true, data };
    } catch {
      return { success: false };
    }
  };

  const getFriend = async () => {
    try {
      const data = await authService.getFriend();
      return { success: true, data };
    } catch {
      return { success: false };
    }
  };

  // ================= NOTIFICATION =================
  const getPendingFriendRequests = async () => {
    try {
      const data = await authService.getPendingFriendRequests();
      return { success: true, data };
    } catch {
      return { success: false };
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await authService.acceptFriendRequest(requestId);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await authService.rejectFriendRequest(requestId);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const cancelFriendRequest = async (requestId) => {
    try {
      await authService.cancelFriendRequest(requestId);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await authService.removeFriend(friendId);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,

    register,
    login,
    logout,

    refreshUser,
    updateProfile,
    addXp,

    getAllUser,
    addFriends,
    getFriend,

    //  notification
    getPendingFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    removeFriend
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
