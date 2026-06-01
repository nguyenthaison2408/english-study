import React, { useState, useEffect } from 'react';
import './Footer.scss';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__section">
            <div className="footer__logo">
              <img src="/logo192.png" alt="Logo" className="footer__logo-image" />
            </div>
            <p className="footer__description">
              Chúng tôi cung cấp các dịch vụ chất lượng cao với
              phương châm khách hàng là trọng tâm.
            </p>
          </div>

          <div className="footer__section">
            <h3 className="footer__section-title">Liên kết</h3>
            <ul className="footer__links">
              <li className="footer__link-item">
                <a href="#home" className="footer__link">Trang chủ</a>
              </li>
              <li className="footer__link-item">
                <a href="#services" className="footer__link">Dịch vụ</a>
              </li>
              <li className="footer__link-item">
                <a href="#about" className="footer__link">Giới thiệu</a>
              </li>
              <li className="footer__link-item">
                <a href="#contact" className="footer__link">Liên hệ</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h3 className="footer__section-title">Dịch vụ</h3>
            <ul className="footer__links">
              <li className="footer__link-item">
                <a href="#" className="footer__link">Dịch vụ 1</a>
              </li>
              <li className="footer__link-item">
                <a href="#" className="footer__link">Dịch vụ 2</a>
              </li>
              <li className="footer__link-item">
                <a href="#" className="footer__link">Dịch vụ 3</a>
              </li>
              <li className="footer__link-item">
                <a href="#" className="footer__link">Dịch vụ 4</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h3 className="footer__section-title">Liên hệ</h3>
            <div className="footer__contact-info">
              <div className="footer__contact-item">
                <span className="footer__contact-icon">📞</span>
                <span className="footer__contact-text">+84 123 456 789</span>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">📧</span>
                <span className="footer__contact-text">info@example.com</span>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">📍</span>
                <span className="footer__contact-text">123 Đường ABC, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Facebook">
              <span className="footer__social-icon">📘</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <span className="footer__social-icon">🐦</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <span className="footer__social-icon">📷</span>
            </a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn">
              <span className="footer__social-icon">💼</span>
            </a>
          </div>
          <div className="footer__copyright">
            <p>&copy; 2024 Công ty TNHH ABC. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;