import React, { useState } from "react";
import "./ChatApp.scss";

const ChatList = ({ users = [], loading, selectedUser, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Logic lọc user theo tên (không phân biệt hoa thường)
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm lấy avatar an toàn (fallback nếu ảnh lỗi)
  const getAvatar = (user) => {
    return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
  };

  return (
    <div className="chat-list">
      {/* 1. Header (Cố định) */}
      <h2>
        Đoạn chat <i className="fa-solid fa-pen-to-square"></i>
      </h2>

      {/* 2. Ô tìm kiếm (Cố định - Không bị cuộn mất) */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Tìm kiếm trên Messenger..."
          className="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. Danh sách users (Có thanh cuộn riêng - flex: 1) */}
      <div className="list-container">
        {loading && (
          <div className="loading-state" style={{padding: "20px", textAlign: "center", color: "#94a3b8"}}>
            <i className="fa-solid fa-circle-notch fa-spin"></i>
            <p>Đang tải...</p>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="empty-state" style={{padding: "20px", textAlign: "center", color: "#94a3b8"}}>
            <p>Chưa có bạn bè nào</p>
          </div>
        )}

        {!loading && users.length > 0 && filteredUsers.length === 0 && (
          <div className="empty-state" style={{padding: "20px", textAlign: "center", color: "#94a3b8"}}>
            <p>Không tìm thấy kết quả</p>
          </div>
        )}

        {!loading &&
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`chat-item ${
                selectedUser?._id === user._id ? "active" : ""
              }`}
              onClick={() => onSelect(user)}
            >
              <div className={`avatar-wrapper ${user.isOnline ? 'online' : ''}`}>
                <img
                  src={getAvatar(user)}
                  alt={user.name}
                  className="avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                  }}
                />
              </div>
              
              <div className="chat-info">
                <h4>{user.name}</h4>
                <p>Nhấn để bắt đầu trò chuyện</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatList;