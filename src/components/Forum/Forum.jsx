// src/components/Forum/Forum.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../Header/Header.jsx';
import PostForm from './PostForm.jsx';
import PostItem from './PostItem.jsx';
import { useAuth } from '../../hooks/useAuth';
import { usePost } from '../../hooks/usePost';
import { useSocket } from '../../contexts/SocketContext';
import { toast } from 'react-toastify';
import './Forum.scss';
import UserModal from './UserModal.jsx';

const Forum = () => {
  const { user, isAuthenticated, getAllUser, getFriend, getPendingFriendRequests, acceptFriendRequest, rejectFriendRequest } = useAuth();
  const { socket, connected } = useSocket();
  const { 
    posts, loading, error, currentPost,
    getAllPosts, createPost, updatePost, deletePost, likePost, commentPost,
    setPostForEdit, clearCurrentPost, clearError 
  } = usePost();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [allUsers, setAllUsers] = useState([]); 
  const [friends, setFriends] = useState([]); 
  const [usersLoading, setUsersLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // --- STATE MỚI CHO THÔNG BÁO ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // --- STATE MỚI: QUẢN LÝ VIỆC MỞ RỘNG DANH SÁCH THÀNH VIÊN ---
  const [isMembersExpanded, setIsMembersExpanded] = useState(false);

  // Hiệu ứng scroll cho header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 LOAD LỜI MỜI KẾT BẠN TỪ API
  const loadPendingRequests = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setRequestsLoading(true);
      const result = await getPendingFriendRequests();
      
      if (result.success && result.data) {
        setFriendRequests(result.data);
      } else {
        setFriendRequests([]);
      }
    } catch (error) {
      console.error('Lỗi khi load friend requests:', error);
      setFriendRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, [isAuthenticated, getPendingFriendRequests]);



    const loadFriends = useCallback(async () => {
    try {
      setFriendsLoading(true);
      const result = await getFriend();
      
      if (result.success && result.data) {
        setFriends(result.data);
      } else {
        console.error('Lỗi khi load friends:', result.error);
        setFriends([]);
      }
    } catch (error) {
      console.error('Lỗi khi load friends:', error);
      toast.error('Không thể tải danh sách bạn bè');
      setFriends([]);
    } finally {
      setFriendsLoading(false);
    }
  }, [getFriend]);

  // 🔥 LẮNG NGHE SOCKET EVENTS CHO FRIEND REQUESTS
  useEffect(() => {
    if (!socket || !connected || !isAuthenticated || !user?.userId) return;

    // Khi nhận được lời mời kết bạn mới
    const handleFriendRequestReceived = (data) => {
      console.log('🔔 Nhận được lời mời kết bạn:', data);
      
      // Thêm vào danh sách requests
      setFriendRequests(prev => [data, ...prev]);
      
      // Hiển thị toast notification
      toast.info(`${data.senderName} đã gửi lời mời kết bạn`);
    };

    // Khi lời mời được chấp nhận
    const handleFriendRequestAccepted = (data) => {
      console.log('✅ Lời mời kết bạn được chấp nhận:', data);
      toast.success(`${data.name} đã chấp nhận lời mời kết bạn của bạn!`);
      
      // Reload danh sách bạn bè
      loadFriends();
    };

    // Khi lời mời bị từ chối
    const handleFriendRequestRejected = (data) => {
      console.log('❌ Lời mời kết bạn bị từ chối:', data);
      // Có thể hiển thị thông báo nếu cần
    };

    // Khi lời mời bị hủy
    const handleFriendRequestCancelled = (data) => {
      console.log('🚫 Lời mời kết bạn bị hủy:', data);
      
      // Xóa khỏi danh sách requests
      setFriendRequests(prev => prev.filter(req => req._id !== data.requestId));
    };

    // Khi bị xóa khỏi danh sách bạn bè
    const handleFriendRemoved = (data) => {
      console.log('💔 Bị xóa khỏi danh sách bạn bè:', data);
      toast.warning('Bạn đã bị xóa khỏi danh sách bạn bè');
      
      // Reload danh sách bạn bè
      loadFriends();
    };

    // Đăng ký listeners
    socket.on('friend:request:received', handleFriendRequestReceived);
    socket.on('friend:request:accepted', handleFriendRequestAccepted);
    socket.on('friend:request:rejected', handleFriendRequestRejected);
    socket.on('friend:request:cancelled', handleFriendRequestCancelled);
    socket.on('friend:removed', handleFriendRemoved);

    // Cleanup
    return () => {
      socket.off('friend:request:received', handleFriendRequestReceived);
      socket.off('friend:request:accepted', handleFriendRequestAccepted);
      socket.off('friend:request:rejected', handleFriendRequestRejected);
      socket.off('friend:request:cancelled', handleFriendRequestCancelled);
      socket.off('friend:removed', handleFriendRemoved);
    };
  }, [socket, connected, isAuthenticated, loadFriends]);

  const loadPosts = useCallback(async () => {
    const result = await getAllPosts();
    if (!result.success && result.error) console.error(result.error);
  }, [getAllPosts]);

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const result = await getAllUser();
      
      if (result.success && result.data) {
        setAllUsers(result.data);
      } else {
        console.error('Lỗi khi load users:', result.error);
      }
    } catch (error) {
      console.error('Lỗi khi load users:', error);
      toast.error('Không thể tải danh sách thành viên');
    } finally {
      setUsersLoading(false);
    }
  }, [getAllUser]);



  useEffect(() => {
    loadPosts();
    loadUsers();
    loadFriends();
    loadPendingRequests();
  }, [loadPosts, loadUsers, loadFriends, loadPendingRequests]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCreatePost = async (postData) => {
    const result = await createPost(postData);
    if (result.success) {
      toast.success('Đăng bài thành công!');
      setShowCreateForm(false);
    } else {
      toast.error(result.error || 'Đăng bài thất bại');
    }
  };

  const handleUpdatePost = async (postData) => {
    if (!currentPost) return;
    const result = await updatePost(currentPost._id, postData);
    if (result.success) {
      toast.success('Cập nhật thành công!');
      clearCurrentPost();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeletePost = async (postId) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        const result = await deletePost(postId);
        if (result.success) toast.success('Đã xóa bài viết');
        else toast.error(result.error);
    }
  };

  const handleToggleCreateForm = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để tham gia thảo luận');
      return;
    }
    if (currentPost) clearCurrentPost();
    setShowCreateForm(!showCreateForm);
  };

  // --- HÀM XỬ LÝ LỜI MỜI KẾT BẠN ---
  const handleAcceptRequest = async (requestId) => {
    try {
      const result = await acceptFriendRequest(requestId);
      
      if (result.success) {
        toast.success('Đã chấp nhận lời mời!');
        
        // Xóa khỏi danh sách requests
        setFriendRequests(prev => prev.filter(req => req._id !== requestId));
        
        // Reload danh sách bạn bè
        loadFriends();
      } else {
        toast.error(result.error || 'Không thể chấp nhận lời mời');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const result = await rejectFriendRequest(requestId);
      
      if (result.success) {
        toast.info('Đã từ chối lời mời');
        
        // Xóa khỏi danh sách requests
        setFriendRequests(prev => prev.filter(req => req._id !== requestId));
      } else {
        toast.error(result.error || 'Không thể từ chối lời mời');
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const getAvatarUrl = useCallback((avatar) => {
    if (!avatar || avatar === 'null' || avatar === 'undefined') {
      return null;
    }
    
    if (typeof avatar === 'object') {
      if (avatar.url) return avatar.url;
      if (avatar.link) return avatar.link;
      if (avatar.src) return avatar.src;
      return null;
    }
    
    if (typeof avatar === 'string') {
      avatar = avatar.trim();
      if (avatar.length === 0) return null;
      
      if (avatar.includes('gravatar.com')) {
        if (avatar.startsWith('//')) {
          avatar = 'https:' + avatar;
        } else if (!avatar.startsWith('http')) {
          avatar = 'https://' + avatar;
        }
        
        try {
          const url = new URL(avatar);
          const defaultParam = url.searchParams.get('default');
          if (defaultParam === 'mm' || !defaultParam) {
            url.searchParams.set('default', 'identicon');
          }
          return url.toString();
        } catch (e) {
          console.error('Error parsing Gravatar URL:', e);
          return avatar;
        }
      }
      
      if (avatar.startsWith('//')) return `https:${avatar}`;
      if (avatar.startsWith('http')) return avatar;
      
      if (avatar.startsWith('/')) {
        return `${window.location.origin}${avatar}`;
      }
      
      return avatar;
    }
    
    return null;
  }, []);

  const getFallbackAvatarUrl = useCallback((name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`;
  }, []);

  const renderMemberItem = (member) => {
    const displayName = member.name || member.username || 'Người dùng';
    
    return (
      <div 
        key={member._id} 
        className="member-item"
        onClick={() => setSelectedUser(member)}
        style={{ cursor: 'pointer' }}
      >
        <div className="member-avatar">
          <img 
            src={getAvatarUrl(member.avatar)}
            alt={displayName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getFallbackAvatarUrl(displayName);
            }}
          />
        </div>
        <div className="member-info">
          <span className="member-name">{displayName}</span>
          <div className="member-meta">
            <span className="member-level">Lv. {member.level || 1}</span>
            {member.role === 'admin' && (
              <span className="member-badge admin">Admin</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="forum-page-wrapper">
      <Header className={isScrolled ? 'scrolled' : ''} />
      
      <div className="forum-body">
        
        {/* === LEFT SIDEBAR === */}
        <div className="sidebar">
          <div className="sidebar-card user-welcome">
              {isAuthenticated ? (
                  <>
                      <div className="avatar-circle">
                        {user?.avatar ? (
                          <img 
                            src={getAvatarUrl(user.avatar)}
                            alt={user.username}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getFallbackAvatarUrl(user.username);
                            }}
                          />
                        ) : (
                          <div className="avatar-fallback">
                            {user?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <h3>Xin chào, {user?.name}</h3>
                      <p>Level {user?.level || 1} • {user?.xpPoints || 0} XP</p>
                      {user?.role === 'admin' && (
                        <span className="user-role-badge">Admin</span>
                      )}
                  </>
              ) : (
                  <>
                      <i className="fa-solid fa-user-astronaut icon-large"></i>
                      <h3>Tham gia cộng đồng</h3>
                      <p>Đăng nhập để tương tác và lưu bài viết hay.</p>
                      <a href="/login" className="btn-sidebar-login">Đăng nhập ngay</a>
                  </>
              )}
          </div>

          <div className="sidebar-card active-members">
              <div className="card-header">
                <h4><i className="fa-solid fa-users"></i> Thành viên tích cực</h4>
                <span className="member-count">{allUsers.length} thành viên</span>
              </div>
              
              {usersLoading ? (
                <div className="users-loading">
                  <div className="loading-spinner"></div>
                  <p>Đang tải thành viên...</p>
                </div>
              ) : allUsers.length === 0 ? (
                <div className="no-users">
                  <i className="fa-solid fa-user-slash"></i>
                  <p>Chưa có thành viên</p>
                </div>
              ) : (
                <>
                  <div className="members-list">
                    {allUsers
                      .slice(0, isMembersExpanded ? allUsers.length : 5)
                      .map((member) => renderMemberItem(member))}
                  </div>
                  
                  {allUsers.length > 5 && (
                    <div className="view-all-members">
                      <button 
                        className="btn-view-all"
                        onClick={() => setIsMembersExpanded(!isMembersExpanded)}
                      >
                          {isMembersExpanded ? (
                             <><i className="fa-solid fa-angle-up"></i> Thu gọn</>
                          ) : (
                             <><i className="fa-solid fa-angles-right"></i> Xem tất cả thành viên</>
                          )}
                      </button>
                    </div>
                  )}
                </>
              )}
          </div>

          <div className="sidebar-card trending-tags">
              <h4><i className="fa-solid fa-arrow-trend-up"></i> Chủ đề nổi bật</h4>
              <div className="tags-cloud">
                  <span className="tag">#Part5</span>
                  <span className="tag">#Listening</span>
                  <span className="tag">#NewEconomy</span>
                  <span className="tag">#Tips</span>
                  <span className="tag">#Grammar</span>
                  <span className="tag">#Reading</span>
                  <span className="tag">#Vocabulary</span>
                  <span className="tag">#TestTaking</span>
              </div>
          </div>

          <div className="sidebar-card quick-stats">
              <h4><i className="fa-solid fa-chart-line"></i> Thống kê cộng đồng</h4>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-number">{posts.length}</span>
                  <span className="stat-label">Bài viết</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{allUsers.length}</span>
                  <span className="stat-label">Thành viên</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{friends.length}</span>
                  <span className="stat-label">Bạn bè</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">99%</span>
                  <span className="stat-label">Tích cực</span>
                </div>
              </div>
          </div>
        </div>

        {/* === RIGHT CONTENT === */}
        <div className="forum-content">
          
          {/* Hero Section */}
          <div className="forum-hero" style={{ padding: '8px 0', minHeight: 'auto' }}>
            <div className="hero-overlay"></div>
            <div className="hero-content container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="text-content">
                <h1 className="">Cộng đồng TOEIC Việt Nam</h1>
                <p className="hero-subtitle">
                  Nơi chia sẻ kiến thức, kinh nghiệm và cùng nhau chinh phục mục tiêu 990+.
                </p>
              </div>
              
              <div className="hero-actions">
                {isAuthenticated && !showCreateForm && !currentPost && (
                  <button 
                    className="btn-hero-create"
                    onClick={handleToggleCreateForm}
                    style={{ marginRight: 100, whiteSpace: 'nowrap' }}
                  >
                    <i className="fa-solid fa-pen-nib"></i> Viết bài mới
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="forum-container container">
            {error && (
              <div className="alert-floating">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{error}</span>
                <button onClick={clearError}><i className="fa-solid fa-xmark"></i></button>
              </div>
            )}

            <div className="forum-layout">
              {/* Cột giữa (Main Feed) */}
              <div className="main-feed">
                <div className={`editor-collapse ${showCreateForm || currentPost ? 'open' : ''}`}>
                   {(currentPost && isAuthenticated) && (
                    <PostForm 
                      onSubmit={handleUpdatePost}
                      initialData={currentPost}
                      onCancel={() => clearCurrentPost()}
                      loading={loading}
                      mode="edit"
                    />
                  )}

                  {(showCreateForm && !currentPost && isAuthenticated) && (
                    <PostForm 
                      onSubmit={handleCreatePost}
                      onCancel={() => setShowCreateForm(false)}
                      loading={loading}
                      mode="create"
                    />
                  )}
                </div>

                <div className="posts-stream">
                  {loading && posts.length === 0 && (
                    <div className="loading-skeleton">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-card">
                          <div className="sk-header"><div className="sk-avatar"></div><div className="sk-name"></div></div>
                          <div className="sk-body"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && posts.length === 0 ? (
                    <div className="empty-state-modern">
                      <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Empty" />
                      <h3>Chưa có bài viết nào</h3>
                      <p>Hãy trở thành người đầu tiên chia sẻ kiến thức!</p>
                    </div>
                  ) : (
                    posts.map(post => (
                      <PostItem
                        key={post._id}
                        post={post}
                        onDelete={handleDeletePost}
                        onLike={async (id) => { await likePost(id); loadPosts(); }}
                        onComment={async (id, cmt) => { await commentPost(id, cmt); loadPosts(); }}
                        onEdit={(p) => { setPostForEdit(p); setShowCreateForm(false); }}
                        showActions={isAuthenticated}
                      />
                    ))
                  )}
                </div>
                
                 {posts.length > 0 && posts.length % 10 === 0 && (
                    <button className="btn-load-more-modern" onClick={loadPosts} disabled={loading}>
                      {loading ? 'Đang tải...' : 'Xem thêm bài viết cũ hơn'}
                    </button>
                 )}
              </div>

              {/* Cột phải (Sidebar 2) */}
              <div className="sidebar-right">
                <div className="sidebar-card friends-list">
                  <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4><i className="fa-solid fa-user-friends"></i> Bạn bè</h4>
                    
                    {/* --- HEADER ACTIONS CHỨA NÚT THÔNG BÁO VÀ POPUP --- */}
                    <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                      <span className="member-count" style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                        {friends.length}
                      </span>
                      
                      {/* NÚT CHUÔNG */}
                      <button 
                        className={`btn-fb-notify ${showNotifications ? 'active' : ''}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                        title="Lời mời kết bạn"
                      >
                        <i className="fa-solid fa-bell"></i>
                        {friendRequests.length > 0 && (
                          <span className="notify-badge">{friendRequests.length}</span>
                        )}
                      </button>

                      {/* POPUP HIỂN THỊ DANH SÁCH LỜI MỜI */}
                      {showNotifications && (
                        <div className="notifications-dropdown">
                          <div className="notify-header">
                            <h5>Lời mời kết bạn</h5>
                            <span className="req-count">{friendRequests.length}</span>
                          </div>
                          
                          <div className="notify-body">
                            {requestsLoading ? (
                              <div className="loading-notify">
                                <div className="loading-spinner"></div>
                                <p>Đang tải...</p>
                              </div>
                            ) : friendRequests.length > 0 ? (
                              friendRequests.map(req => (
                                <div key={req._id} className="request-item">
                                  <div className="req-avatar">
                                    <img 
                                      src={getAvatarUrl(req.avatar) || getFallbackAvatarUrl(req.name)} 
                                      alt={req.name} 
                                    />
                                  </div>
                                  <div className="req-info">
                                    <span className="req-name">{req.name}</span>
                                    <span className="req-mutual">{req.mutual} bạn chung</span>
                                    <div className="req-actions">
                                      <button 
                                        className="btn-confirm"
                                        onClick={() => handleAcceptRequest(req._id)}
                                      >
                                        Xác nhận
                                      </button>
                                      <button 
                                        className="btn-delete"
                                        onClick={() => handleDeclineRequest(req._id)}
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="empty-notify">
                                <i className="fa-regular fa-bell-slash"></i>
                                <p>Không có lời mời nào</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                    
                  {friendsLoading ? (
                    <div className="users-loading">
                      <div className="loading-spinner"></div>
                      <p>Đang tải bạn bè...</p>
                    </div>
                  ) : friends.length === 0 ? (
                    <div className="no-friends">
                      <i className="fa-solid fa-user-plus"></i>
                      <p>Chưa có bạn bè</p>
                      <small>Hãy kết bạn với các thành viên khác!</small>
                    </div>
                  ) : (
                    <>
                      <div className="members-list">
                        {friends.slice(0, 10).map((friend) => renderMemberItem(friend))}
                      </div>
                      
                      {friends.length > 10 && (
                        <div className="view-all-members">
                          <button className="btn-view-all" onClick={() => toast.info('Xem tất cả bạn bè')}>
                            <i className="fa-solid fa-angles-right"></i> Xem tất cả bạn bè
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="sidebar-card online-friends">
                    <h4><i className="fa-solid fa-circle text-success"></i> Bạn bè đang online</h4>
                    <div className="online-list">
                      {friends.length > 0 ? (
                        friends.slice(0, 3).map((friend) => (
                          <div key={friend._id} className="online-item">
                            <div className="online-avatar">
                              <img 
                                src={getAvatarUrl(friend.avatar) || getFallbackAvatarUrl(friend.name)}
                                alt={friend.name}
                              />
                              <span className="online-dot"></span>
                            </div>
                            <span className="online-name">{friend.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted small">Chưa có bạn bè online</p>
                      )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <UserModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)}
          currentUserId={user?._id}
        />
      )}
    </div>
  );
};

export default Forum;