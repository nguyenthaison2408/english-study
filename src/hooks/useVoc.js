// src/hooks/usePost.js
import { useContext } from 'react';

import { VocalContext } from '../contexts/VocalContext';

export const useVoc = () => {
  const context = useContext(VocalContext);
  
  if (!context) {
    throw new Error('useVoc phải được sử dụng trong PostProvider');
  }
  
  return context;
};