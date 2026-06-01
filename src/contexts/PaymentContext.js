import React, { createContext, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import paymentService from '../services/paymentService';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Tạo URL thanh toán và chuyển hướng
  const initiatePayment = useCallback(async (quizId, quizTitle) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      return { success: false, error: 'Unauthorized' };
    }

    try {
      setLoading(true);
      setError(null);

      const result = await paymentService.createPaymentUrl(
        quizId,
        quizTitle,
        50000
      );

      if (result.success && result.paymentUrl) {
        // Lưu thông tin quiz để sử dụng sau khi thanh toán
        localStorage.setItem('pendingQuizId', quizId);
        
        // Chuyển hướng đến trang thanh toán VNPay
        window.location.href = result.paymentUrl;
        
        return { success: true };
      } else {
        throw new Error('Không thể tạo URL thanh toán');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tạo thanh toán';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Xử lý callback sau thanh toán
  const handlePaymentReturn = useCallback(async (queryParams) => {
    try {
      setLoading(true);
      setError(null);

      const result = await paymentService.handlePaymentCallback(queryParams);

      if (result.success) {
        toast.success('Thanh toán thành công!');
        // Xóa thông tin quiz đã lưu
        localStorage.removeItem('pendingQuizId');
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'Thanh toán không thành công');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi xử lý thanh toán';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatus = useCallback(async (quizId) => {
    try {
      setLoading(true);
      const result = await paymentService.checkPaymentStatus(quizId);
      return { 
        success: true, 
        hasPaid: result.data?.hasPaid || false,
        isVip: result.data?.isVip || false
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi kiểm tra thanh toán';
      return { success: false, error: message, hasPaid: false, isVip: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    loading,
    error,
    initiatePayment,
    handlePaymentReturn,
    checkPaymentStatus
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};