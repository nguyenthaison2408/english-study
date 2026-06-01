// src/hooks/usePost.js
import { useContext } from 'react';

import { ChatContext } from '../contexts/ChatContext';

export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChat phải được sử dụng trong PostProvider');
  }
  
  return context;
};