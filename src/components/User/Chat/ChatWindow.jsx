
import React, { useEffect, useState, useRef } from "react";
import "./ChatApp.scss";
import chatService from "../../../services/chatService";

const ChatWindow = ({ chat, friend, currentUserId, onMessageSent }) => {
  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null);

  // ĐƯA TẤT CẢ HOOKS LÊN TRÊN CÙNG - TRƯỚC MỌI RETURN
  const messages = chat?.messages || [];

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Auto scroll xuống khi có tin nhắn mới
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [sortedMessages]);

  // RETURN SAU KHI ĐÃ GỌI TẤT CẢ HOOKS
  if (!friend) {
    return <div className="no-chat">Chọn bạn để chat 💬</div>;
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await chatService.sendChat(friend.userId, input);
      setInput("");
      
      if (onMessageSent) {
        await onMessageSent();
      }
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  return (
    <div className="chat-window">
    <div className="chat-header">
  <div className={`header-avatar-wrapper ${friend.isOnline ? "online" : ""}`}>
    <img
      src={friend.avatar}
      alt={friend.name}
      className="header-avatar"
    />
  </div>

  <h3>{friend.name}</h3>
</div>


      <div className="chat-body" ref={chatBodyRef}>
        {sortedMessages.map((m) => (
          <div
            key={m._id}
            className={`message ${
              m.from === currentUserId ? "sent" : "received"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="chat-input"
        />
        <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
          {/* Icon máy bay giấy SVG */}
          <svg 
            viewBox="0 0 24 24" 
            width="24" 
            height="24" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
