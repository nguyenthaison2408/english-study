import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios.config'; 
import './AuthForm.scss'; 

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    try {
        // GỌI API ADMIN REGISTER
        await axiosInstance.post('/users/admin/register', { 
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
        
        alert("Đăng ký Admin thành công! Hãy đăng nhập để vào trang quản trị.");
        // Chuyển về trang login
        navigate('/adminlogin');
    } catch (err) {
        console.error(err);
        alert("Lỗi: " + (err.response?.data?.message || "Đăng ký thất bại"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo-admin.png" alt="Admin Logo" />
        </div>
        <h2>Tạo tài khoản Admin</h2>
        <p className="auth-subtitle">Điền thông tin để đăng ký tài khoản quản trị</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input type="text" name="name" placeholder=" " value={formData.name} onChange={handleChange} required />
            <label>Họ và tên</label>
          </div>
          <div className="input-group">
            <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder=" " value={formData.password} onChange={handleChange} required />
            <label>Mật khẩu</label>
          </div>
          <div className="input-group">
            <input type="password" name="confirmPassword" placeholder=" " value={formData.confirmPassword} onChange={handleChange} required />
            <label>Nhập lại mật khẩu</label>
          </div>
          <button type="submit" className="auth-btn">Đăng ký</button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/adminlogin">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;