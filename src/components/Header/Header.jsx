// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo5.png';
import './Header.scss';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.header__user-menu')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công!');
    navigate('/');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
const avatarUrl = user?.avatar || "https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute.jpg";
  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <div className="header__logo">
          <Link to="/" className="header__logo-link">
            <img src={logo} alt="Logo" />
          </Link>
          <span className="header__logo-text">THS English</span>
        </div>

        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Trang chủ
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/vocab" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Từ vựng
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/toeic-prep" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Luyện thi Toeic
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/forum" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Diễn đàn
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          {loading ? (
            // Hiển thị loading khi đang tải thông tin user
            <div className="header__loading">
              <div className="header__loading-spinner"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="header__user-menu">
              <button className="header__user-btn" onClick={toggleDropdown}>
               
                 <img  className="header__user-avatar" src={avatarUrl} alt="avatar" onError={(e) => {
              e.target.src = "https://via.placeholder.com/120";
            }} />
               
                <span className="header__user-name">
                  Xin chào, {user?.name || 'User'}
                </span>
                <span className={`header__dropdown-icon ${showDropdown ? 'header__dropdown-icon--open' : ''}`}>
                  ▼
                </span>
              </button>

              {showDropdown && (
                <div className="header__dropdown">
                  <div className="header__dropdown-header">
                    <div className="header__dropdown-avatar">
                     <img  className="header__user-avatar" src={avatarUrl} alt="avatar" onError={(e) => {
              e.target.src = "https://via.placeholder.com/120";
            }} />
                    </div>
                    <div className="header__dropdown-info">
                      <div className="header__dropdown-name">{user?.name || 'User'}</div>
                      <div className="header__dropdown-email">{user?.email || 'email@example.com'}</div>
                    </div>
                  </div>
                  
                  <div className="header__dropdown-divider"></div>

                  <Link 
                    to="/userprofile" 
                    className="header__dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="header__dropdown-item-icon">👤</span>
                    <span>Thông tin cá nhân</span>
                  </Link>
                  
                  <Link 
                    to="/homepage" 
                    className="header__dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="header__dropdown-item-icon">📚</span>
                    <span>Khóa học của tôi</span>
                  </Link>
                  
                  <Link 
                    to="/vocab2" 
                    className="header__dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="header__dropdown-item-icon">📖</span>
                    <span>Từ vựng của tôi</span>
                  </Link>

                  <div className="header__dropdown-divider"></div>
                  
                  <button 
                    className="header__dropdown-item header__dropdown-item--logout"
                    onClick={handleLogout}
                  >
                    <span className="header__dropdown-item-icon">🚪</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header__auth-buttons">
              <Link to="/login" className="header__login-btn">
                ĐĂNG NHẬP
              </Link>
              <Link to="/register" className="header__register-btn">
                ĐĂNG KÝ
              </Link>
            </div>
          )}
        </div>

        <button
          className={`header__mobile-toggle ${isMenuOpen ? 'header__mobile-toggle--open' : ''}`}
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;