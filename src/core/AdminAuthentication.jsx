import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Đảm bảo đúng đường dẫn tới hook useAuth

const AdminAuthentication = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Chờ tải thông tin user xong đã (tránh redirect nhầm khi F5)
  if (loading) {
    return <div>Loading...</div>; 
  }

  // 2. LOGIC QUAN TRỌNG NHẤT: Chưa đăng nhập -> Chuyển ngay sang /adminlogin
  if (!isAuthenticated) {
    return <Navigate to="/adminlogin" state={{ from: location.pathname }} replace />;
  }

  // 3. Đã đăng nhập nhưng không phải admin -> Đuổi về trang chủ
  if (user && user.role !== 'admin') {
    alert("Bạn không có quyền truy cập Admin!");
    return <Navigate to="/" replace />;
  }

  // 4. Nếu ổn hết -> Cho phép hiển thị trang Admin
  return children;
};

export default AdminAuthentication;