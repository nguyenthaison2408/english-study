import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import './PaymentCallback.scss';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-callback-container">
      <div className="callback-card">
        <XCircle className="icon-large text-danger" size={72} />
        <h2 className="mt-4 text-danger font-weight-bold">Thanh Toán Không Thành Công</h2>
        <p className="text-muted mt-2">
          Giao dịch qua VNPay đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý. Tài khoản của bạn chưa bị trừ tiền.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center gap-2 px-4 py-2"
            onClick={() => navigate('/exams')}
          >
            <RefreshCw size={18} /> Thử lại
          </button>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
            onClick={() => navigate('/homepage')}
          >
            <Home size={18} /> Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;

