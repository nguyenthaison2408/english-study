import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { FaArrowLeft } from "react-icons/fa";
import "./ChatApp.scss";

import { useAuth } from "../../../hooks/useAuth";
import { useSocket } from "../../../contexts/SocketContext"; 
import chatService from "../../../services/chatService";

const ChatApp = () => {
  const { user, isAuthenticated, getFriend } = useAuth();
  const { connected, onlineUsers } = useSocket(); // Lấy thông tin socket
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  
  const pollingIntervalRef = useRef(null);

  const loadFriends = useCallback(async () => {
    try {
      setFriendsLoading(true);
      const result = await getFriend();

      if (result.success && Array.isArray(result.data)) {
        //  Gắn trạng thái online cho từng friend
        const friendsWithStatus = result.data.map(friend => ({
          ...friend,
          isOnline: onlineUsers.includes(friend.userId)
        }));
        setFriends(friendsWithStatus);
      } else {
        setFriends([]);
      }
    } catch (err) {
      console.error("Load friends error:", err);
      setFriends([]);
    } finally {
      setFriendsLoading(false);
    }
  }, [getFriend, onlineUsers]);

  //  Reload friends khi danh sách online thay đổi
  useEffect(() => {
    if (friends.length > 0) {
      const updatedFriends = friends.map(friend => ({
        ...friend,
        isOnline: onlineUsers.includes(friend.userId)
      }));
      setFriends(updatedFriends);
    }
  }, [onlineUsers]);

  const loadChats = useCallback(async () => {
    try {
      const data = await chatService.getChats();
      setChats(Array.isArray(data) ? data : []);
      
      if (selectedFriend) {
        const updatedChat = (Array.isArray(data) ? data : []).find(
          (c) =>
            (c.user1 === user.userId && c.user2 === selectedFriend.userId) ||
            (c.user2 === user.userId && c.user1 === selectedFriend.userId)
        );
        setSelectedChat(updatedChat || null);
      }
    } catch (err) {
      console.error("Load chats error:", err);
      setChats([]);
    }
  }, [selectedFriend, user?.userId]);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);

    const chat = chats.find(
      (c) =>
        (c.user1 === user.userId && c.user2 === friend.userId) ||
        (c.user2 === user.userId && c.user1 === friend.userId)
    );

    setSelectedChat(chat || null);
  };

  const handleMessageSent = useCallback(async () => {
    await loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFriends();
      loadChats();

      pollingIntervalRef.current = setInterval(() => {
        loadChats();
      }, 3000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [isAuthenticated, loadFriends, loadChats]);

  const handleGoBack = () => {
    navigate("/userprofile");
  };

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#18191a' }}>
        <div className="nav-header">
          <button className="btn-back" onClick={handleGoBack}>
            <FaArrowLeft className="icon" /> Quay lại hồ sơ
          </button>
        </div>
        <div className="chat-empty" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          Vui lòng đăng nhập để chat 💬
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page-wrapper" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="nav-header">
        <button className="btn-back" onClick={handleGoBack}>
          <FaArrowLeft className="icon" /> Quay lại hồ sơ
        </button>
        {/* ✅ Hiển thị trạng thái kết nối */}
        {/* {connected && (
          <span style={{ color: '#10b981', fontSize: '14px', marginLeft: '10px' }}>
            ● Connected
          </span>
        )} */}
      </div>

      <div className="chat-app" style={{ flex: 1, overflow: 'hidden' }}>
        <ChatList
          users={friends}
          loading={friendsLoading}
          selectedUser={selectedFriend}
          onSelect={handleSelectFriend}
        />

        <ChatWindow
          friend={selectedFriend}
          chat={selectedChat}
          currentUserId={user.userId}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  );
};

export default ChatApp;