import React, { createContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import ChatService from '../services/chatService';
import { useAuth } from '../hooks/useAuth';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [chats, setChats] = useState([]);     // danh sách chat
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//lấy chat
  const getChats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const data = await ChatService.getChats();
      setChats(data);

      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Lỗi khi tải chat';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

//snnd 
  const sendMessage = async (to, text) => {
    try {
      const chat = await ChatService.sendChat(to, text);

      // cập nhật realtime local
      setChats((prev) => {
        const index = prev.findIndex(c => c._id === chat._id);
        if (index !== -1) {
          const clone = [...prev];
          clone[index] = chat;
          return clone;
        }
        return [chat, ...prev];
      });

      return { success: true, data: chat };
    } catch (err) {
      const message = err.response?.data?.message || 'Gửi tin nhắn thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        loading,
        error,
        getChats,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
