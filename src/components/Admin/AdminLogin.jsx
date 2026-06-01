import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../utils/axios.config'; // <-- KHÔNG DÙNG CÁI NÀY NỮA
import { useAuth } from '../../hooks/useAuth'; // Dùng hook useAuth để đồng bộ State
import './AuthForm.scss'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Lấy hàm login từ AuthContext
  const { login, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // 1. Gọi hàm login của Context (Nó sẽ tự gọi API + Tự cập nhật State isAuthenticated = true)
        const res = await login({ email, password });

        if (res.success) {
            // res.data chứa { token, user } do AuthContext trả về
            const user = res.data.user;

            // 2. CHECK QUYỀN ADMIN
            if (user && user.role === 'admin') {
                console.log("Login Success: Admin");
                // Chuyển hướng
                navigate('/admin');
            } else {
                alert("Truy cập bị từ chối! Tài khoản này không phải là Admin.");
                // Đăng xuất ngay để xóa token rác
                logout();
            }
        } else {
            // Nếu login thất bại (do sai pass hoặc lỗi server)
            alert("Đăng nhập thất bại: " + res.error);
        }

    } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra khi đăng nhập");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo-admin.png" alt="Admin Logo" />
        </div>
        <h2>Đăng nhập Admin</h2>
        <p className="auth-subtitle">Chào mừng quay lại! Vui lòng nhập thông tin của bạn.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input type="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input type="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label>Mật khẩu</label>
          </div>

          <div className="auth-options">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/admin/forgot-password" className="forgot-link">Quên mật khẩu?</Link>
          </div>

          <button type="submit" className="auth-btn">Đăng nhập</button>
        </form>

        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/adminregister">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;