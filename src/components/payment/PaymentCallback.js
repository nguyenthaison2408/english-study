import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import { usePayment } from '../../hooks/usePayment';
import './PaymentCallback.scss';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handlePaymentReturn } = usePayment();
  const [status, setStatus] = useState('processing'); // processing | success | failed

  useEffect(() => {
    const processPayment = async () => {
      // Lấy tất cả query params
      const queryParams = new URLSearchParams(location.search);
      const paramsObject = {};
      
      for (const [key, value] of queryParams.entries()) {
        paramsObject[key] = value;
      }

      console.log('Processing payment with params:', paramsObject);

      // Xử lý callback
      const result = await handlePaymentReturn(paramsObject);
      
      if (result.success) {
        setStatus('success');
        
        // Chuyển về trang bài thi sau 2 giây
        setTimeout(() => {
          const quizId = paramsObject.quizId || localStorage.getItem('pendingQuizId');
          if (quizId) {
            navigate(`/exams`); // ✅ SỬA: /exams thay vì /exam
          } else {
            navigate('/exams'); // ✅ SỬA: /exams thay vì /exam
          }
        }, 2000);
      } else {
        setStatus('failed');
        
        // Quay lại trang exam sau 3 giây
        setTimeout(() => {
          navigate('/exams'); // ✅ SỬA: /exams thay vì /exam
        }, 3000);
      }
    };

    processPayment();
  }, [location.search, handlePaymentReturn, navigate]);

  return (
    <div className="payment-callback-container">
      <div className="callback-card">
        {status === 'processing' && (
          <>
            <Loader className="animate-spin icon-large text-primary" size={64} />
            <h2 className="mt-4">Đang xử lý thanh toán...</h2>
            <p className="text-muted">Vui lòng đợi trong giây lát</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="icon-large text-success" size={64} />
            <h2 className="mt-4 text-success">Thanh toán thành công!</h2>
            <p className="text-muted">Đang chuyển về trang bài thi...</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <XCircle className="icon-large text-danger" size={64} />
            <h2 className="mt-4 text-danger">Thanh toán thất bại</h2>
            <p className="text-muted">Vui lòng thử lại sau</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;