// src/hooks/usePost.js
import { useContext } from 'react';
import { PostContext } from '../contexts/PostContext';

export const usePost = () => {
  const context = useContext(PostContext);
  
  if (!context) {
    throw new Error('usePost phải được sử dụng trong PostProvider');
  }
  
  return context;
};