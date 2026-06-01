import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('x-auth-token'); 
      
      if (!token) {
        console.error(' No token found');
        return;
      }

      console.log(' Connecting socket for user:', user.userId);

      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setConnected(true);
        
        // Gửi thông tin xác thực
        newSocket.emit('user:connect', {
          userId: user.userId,
          token: token
        });
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error(' Socket connection error:', error);
        setConnected(false);
      });

      // Lắng nghe danh sách users online
      newSocket.on('users:online', (users) => {
        console.log(' Online users updated:', users);
        setOnlineUsers(users);
      });

      // Lắng nghe tin nhắn đến
      newSocket.on('message:receive', (data) => {
        console.log(' New message received:', data);
        // Có thể emit event cho component khác handle
        window.dispatchEvent(new CustomEvent('new-message', { detail: data }));
      });

      // Lắng nghe typing status
      newSocket.on('typing:receive', (data) => {
        console.log('⌨️ Typing status:', data);
        window.dispatchEvent(new CustomEvent('typing-status', { detail: data }));
      });

      newSocket.on('auth:error', (error) => {
        console.error(' Authentication error:', error);
        newSocket.disconnect();
      });

      setSocket(newSocket);

      // Cleanup khi unmount
      return () => {
        console.log(' Disconnecting socket...');
        newSocket.disconnect();
      };
    } else {
      // Nếu user logout, disconnect socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
        setOnlineUsers([]);
      }
    }
  }, [isAuthenticated, user]);

  // Helper functions
  const sendMessage = (to, message, chatId) => {
    if (socket && connected) {
      socket.emit('message:send', {
        to,
        from: user.userId,
        message,
        chatId
      });
    }
  };

  const startTyping = (to) => {
    if (socket && connected) {
      socket.emit('typing:start', {
        to,
        from: user.userId
      });
    }
  };

  const stopTyping = (to) => {
    if (socket && connected) {
      socket.emit('typing:stop', {
        to,
        from: user.userId
      });
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      connected, 
      onlineUsers,
      sendMessage,
      startTyping,
      stopTyping
    }}>
      {children}
    </SocketContext.Provider>
  );
};