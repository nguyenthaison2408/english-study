// src/components/User/SideBar.js
import React from "react";
import "./SideBar.scss";
import { Home, MessageCircle, BookOpen, Globe, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

   const displayName = user?.name || "User";
   const avatarUrl = user?.avatar || "https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute.jpg";

  const menuItems = [
    { icon: <Home size={18} />, text: "Trang chủ", path: "/homepage" },
    { icon: <MessageCircle size={18} />, text: "Trò chuyện", path: "/chatapp" }, // Đổi thành chatapp
    { icon: <BookOpen size={18} />, text: "Từ vựng", path: "/vocab2" },
    { icon: <Globe size={18} />, text: "Thế giới thực", path: "/forum" },
    { icon: <User size={18} />, text: "Tài khoản", path: "/userprofile" },
     { icon: <User size={18} />, text: "Bài thi", path: "/exams" },
    { icon: <User size={18} />, text: "Home", path: "/" },
  ];

  return (
    <aside className="sidebar">
      <div className="user-info">
        <img
          src={avatarUrl}
          alt="avatar"
          className="avatar"
        />
        <p className="greeting">Xin chào</p>
        <h3 className="username">{displayName}</h3>
        <span className="upgrade">👑 Nâng cấp</span>
      </div>

      <nav className="menu">
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={i}
              className={`menu-btn ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.text}</span>
            </button>
          );
        })}
      </nav>

    </aside>
  );
};

export default SideBar;
