import { useContext } from 'react';
import { PaymentContext } from '../contexts/PaymentContext';

export const usePayment = () => {
  const context = useContext(PaymentContext);
  
  if (!context) {
    throw new Error('usePayment phải được sử dụng trong PaymentProvider');
  }
  
  return context;
};