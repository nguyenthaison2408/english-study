// src/components/Forum/UserModal.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Forum.scss'; // Dùng chung SCSS với Forum
import { useAuth } from '../../hooks/useAuth';

const UserModal = ({ user, onClose, currentUserId }) => {
     
  const [loading, setLoading] = useState(false);
  const [friendStatus, setFriendStatus] = useState('none'); // 'none', 'pending', 'friends', 'sent'
  const { addFriends } = useAuth();
  if (!user) return null;

  // Hàm xử lý gửi lời mời kết bạn
  const handleSendFriendRequest = async () => {
    if (currentUserId === user._id) {
      toast.info("Đây là tài khoản của bạn!");
      return;
    }

    setLoading(true);
    try {
      
      // Giả lập API call
      const result = await addFriends(user.userId);
      
      toast.success(`Đã gửi lời mời kết bạn đến ${user.name}`);
      setFriendStatus('sent');
    } catch (error) {
      console.error('Lỗi khi gửi lời mời kết bạn:', error);
      toast.error('Không thể gửi lời mời kết bạn');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý hủy lời mời kết bạn
  const handleCancelFriendRequest = async () => {
    setLoading(true);
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.info(`Đã hủy lời mời kết bạn với ${user.name}`);
      setFriendStatus('none');
    } catch (error) {
      console.error('Lỗi khi hủy lời mời:', error);
      toast.error('Không thể hủy lời mời');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý chấp nhận lời mời kết bạn
  const handleAcceptFriendRequest = async () => {
    setLoading(true);
    try {
      // TODO: Gọi API chấp nhận lời mời
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Đã chấp nhận lời mời kết bạn từ ${user.name}`);
      setFriendStatus('friends');
    } catch (error) {
      console.error('Lỗi khi chấp nhận lời mời:', error);
      toast.error('Không thể chấp nhận lời mời');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa bạn bè
  const handleRemoveFriend = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${user.name} khỏi danh sách bạn bè?`)) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Gọi API xóa bạn bè
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.info(`Đã xóa ${user.name} khỏi danh sách bạn bè`);
      setFriendStatus('none');
    } catch (error) {
      console.error('Lỗi khi xóa bạn bè:', error);
      toast.error('Không thể xóa bạn bè');
    } finally {
      setLoading(false);
    }
  };

  // Format avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('//')) return `https:${avatar}`;
    if (avatar.startsWith('http')) return avatar;
    return avatar;
  };

  const avatarUrl = getAvatarUrl(user.avatar) || 
    `https://ui-avatars.com/api/?name=${user.name || user.username}&background=random&color=fff&size=200`;
  
  const isCurrentUser = currentUserId === user._id;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="user-modal-header">
          <h3>Thông tin thành viên</h3>
          <button className="user-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Avatar */}
        <div className="user-modal-avatar">
          <img 
            src={avatarUrl}
            alt={user.name || user.username}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${user.name || user.username}&background=random`;
            }}
          />
        </div>

        {/* Thông tin cơ bản */}
        <div className="user-modal-info">
          <h2 className="user-modal-name">{user.name || user.username}</h2>
          
          <div className="user-modal-stats">
            <div className="stat-item">
              <span className="stat-label">Level</span>
              <span className="stat-value">{user.level || 1}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">XP</span>
              <span className="stat-value">{user.xpPoints || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Bài viết</span>
              <span className="stat-value">{user.postCount || 0}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="user-modal-badges">
            {user.role === 'admin' && (
              <span className="badge admin">
                <i className="fa-solid fa-crown"></i> Admin
              </span>
            )}
            {user.isPremium && (
              <span className="badge premium">
                <i className="fa-solid fa-gem"></i> Premium
              </span>
            )}
            <span className="badge level">
              <i className="fa-solid fa-trophy"></i> Cấp {user.level || 1}
            </span>
          </div>

          {/* Thông tin thêm */}
          <div className="user-modal-details">
            {user.email && (
              <div className="detail-item">
                <i className="fa-solid fa-envelope"></i>
                <span>{user.email}</span>
              </div>
            )}
            
            <div className="detail-item">
              <i className="fa-solid fa-calendar"></i>
              <span>Tham gia: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
            </div>

            {user.bio && (
              <div className="detail-item bio">
                <i className="fa-solid fa-quote-left"></i>
                <span>{user.bio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Các nút hành động */}
        <div className="user-modal-actions">
          {isCurrentUser ? (
            <button className="btn-action edit-profile" onClick={() => toast.info('Chuyển đến trang chỉnh sửa hồ sơ')}>
              <i className="fa-solid fa-user-edit"></i> Chỉnh sửa hồ sơ
            </button>
          ) : (
            <>
              {friendStatus === 'none' && (
                <button 
                  className="btn-action add-friend"
                  onClick={handleSendFriendRequest}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-user-plus"></i> Gửi lời mời kết bạn
                    </>
                  )}
                </button>
              )}

              {friendStatus === 'sent' && (
                <button 
                  className="btn-action cancel-request"
                  onClick={handleCancelFriendRequest}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-user-clock"></i> Đã gửi lời mời
                    </>
                  )}
                </button>
              )}

              {friendStatus === 'pending' && (
                <div className="friend-request-buttons">
                  <button 
                    className="btn-action accept"
                    onClick={handleAcceptFriendRequest}
                    disabled={loading}
                  >
                    <i className="fa-solid fa-check"></i> Chấp nhận
                  </button>
                  <button 
                    className="btn-action decline"
                    onClick={handleCancelFriendRequest}
                    disabled={loading}
                  >
                    <i className="fa-solid fa-times"></i> Từ chối
                  </button>
                </div>
              )}

              {friendStatus === 'friends' && (
                <div className="friend-actions">
                  <button 
                    className="btn-action message"
                    onClick={() => toast.info('Mở chat với ' + user.name)}
                  >
                    <i className="fa-solid fa-comment"></i> Nhắn tin
                  </button>
                  <button 
                    className="btn-action remove"
                    onClick={handleRemoveFriend}
                    disabled={loading}
                  >
                    {loading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-user-minus"></i>
                    )}
                  </button>
                </div>
              )}

              <button 
                className="btn-action view-posts"
                onClick={() => toast.info(`Xem bài viết của ${user.name}`)}
              >
                <i className="fa-solid fa-file-lines"></i> Xem bài viết
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="user-modal-footer">
          <button className="btn-close" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;