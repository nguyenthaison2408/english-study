// src/components/Forum/PostItem.jsx
import React, { useState, useMemo, useEffect  } from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { useAuth } from '../../hooks/useAuth';
import './postItem.scss';

const PostItem = ({ 
  post, 
  onDelete, 
  onLike, 
  onComment,
  onEdit,
  showActions = true 
}) => {
  const { user: currentUser,isAuthenticated } = useAuth(); 
  
  // States
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // Computed values
  const isAuthor = useMemo(() => {
    return currentUser && currentUser.userId === post.user;
  }, [currentUser, post.user]);

  const hasLiked = useMemo(() => {
    if (!currentUser || !post.like) return false;
    return post.like.some(like => {
      const likeUserId = typeof like === 'object' ? like.user : like;
      return likeUserId === currentUser.userId;
    });
  }, [currentUser, post.like]);

  const likesCount = post.like?.length || 0;
  const commentsCount = post.comments?.length || 0;
  
  const displayedComments = useMemo(() => {
    if (!post.comments || post.comments.length === 0) return [];
    return showAllComments ? post.comments : post.comments.slice(0, 3);
  }, [post.comments, showAllComments]);

  const hasMoreComments = post.comments && post.comments.length > 3;

  // Handlers
  const handleLike = async () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(post._id);
    } catch (error) {
      console.error('Lỗi khi thích bài viết:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa bài viết này?\nHành động này không thể hoàn tác.'
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      await onDelete(post._id);
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (!currentUser) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }
    
    setIsSubmittingComment(true);
    try {

    await onComment(post._id, trimmedComment);
      setCommentText('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const toggleCommentForm = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }
    setShowCommentForm(!showCommentForm);
  };

  const toggleShowAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  // Render helpers
  const renderPostAuthor = () => (
    <div className="post-author">
      <img 
        src={post.avatar || 'https://via.placeholder.com/60'} 
        alt={post.name || 'User'}
        className="post-avatar"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/60';
        }}
      />
      <div className="post-author-info">
        <div className="post-author-name">
          {post.name || 'Người dùng'}
        </div>
        <div className="post-date">
          {formatDate(post.createdAt)}
        </div>
      </div>
    </div>
  );

  const renderPostActions = () => {
    if (!isAuthor || !showActions) return null;

    return (
      <div className="post-action-buttons">
        <button 
          className="btn-edit"
          onClick={handleEdit}
          disabled={isDeleting}
          title="Chỉnh sửa bài viết"
        >
          <i className="fa-solid fa-pen"></i>
          <span>Sửa</span>
        </button>
        <button 
          className="btn-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Xóa bài viết"
        >
          {isDeleting ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            <i className="fa-solid fa-trash"></i>
          )}
          <span>{isDeleting ? 'Đang xóa...' : 'Xóa'}</span>
        </button>
      </div>
    );
  };

  const renderPostContent = () => (
    <div className="post-content">
      {post.title && (
        <h5 className="post-title">{post.title}</h5>
      )}
      <p className="post-text">{post.content}</p>
      
      {post.image && (
        <div className="post-image-wrapper">
          <img 
            src={post.image} 
            alt={post.title || 'Post image'} 
            className="post-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );

  const renderPostStats = () => (
    <div className="post-stats">
      <span className="post-stat-item">
        <i className="fa-solid fa-thumbs-up"></i>
        {likesCount}
      </span>
      <span className="post-stat-item">
        <i className="fa-solid fa-comment"></i>
        {commentsCount}
      </span>
    </div>
  );

  const renderInteractionBar = () => {
    if (!showActions) return null;

    return (
      <div className="post-interaction-bar">
        <button 
          className={`btn-interaction ${hasLiked ? 'active' : ''}`}
          onClick={handleLike}
          disabled={isLiking || !currentUser}
        >
          {isLiking ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            <i className={`fa-${hasLiked ? 'solid' : 'regular'} fa-thumbs-up`}></i>
          )}
          <span>{hasLiked ? 'Đã thích' : 'Thích'}</span>
        </button>
        
        <button 
          className="btn-interaction"
          onClick={toggleCommentForm}
          disabled={!currentUser}
        >
          <i className="fa-regular fa-comment"></i>
          <span>Bình luận</span>
        </button>
      </div>
    );
  };

  const renderCommentForm = () => {
    if (!showCommentForm || !currentUser) return null;

    return (
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <img 
          src={currentUser.avatar || 'https://via.placeholder.com/40'} 
          alt={currentUser.name}
          className="comment-form-avatar"
        />
        <div className="comment-form-input-wrapper">
          <input
            type="text"
            className="comment-form-input"
            placeholder="Viết bình luận..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={500}
            disabled={isSubmittingComment}
            autoFocus
          />
          <div className="comment-form-actions">
            <button 
              type="button"
              className="btn-cancel"
              onClick={() => {
                setShowCommentForm(false);
                setCommentText('');
              }}
              disabled={isSubmittingComment}
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="btn-submit"
              disabled={isSubmittingComment || !commentText.trim()}
            >
              {isSubmittingComment ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Gửi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    );
  };

  const renderComment = (comment, index) => {
    // Handle both object and string comment formats
    const commentData = typeof comment === 'object' ? comment : { text: comment };
     const commentAuthor = {
    name: commentData.name || post.name,
    avatar: commentData.avatar || post.avatar 
  };
    const commentText = commentData.text || commentData.content || comment;
    const commentDate = commentData.createdAt || post.createdAt;

    const commentKey = commentData._id || `${post._id}-comment-${index}`;

    return (
      <div key={commentKey} className="comment-item">
        <img 
          src={commentAuthor?.avatar || 'https://via.placeholder.com/40'} 
          alt={commentAuthor?.name || 'User'}
          className="comment-avatar"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/40';
          }}
        />
        <div className="comment-content">
          <div className="comment-header">
            <span className="comment-author-name">
              {commentAuthor?.name || 'Người dùng'}
            </span>
            <span className="comment-date">
              {formatDate(commentDate)}
            </span>
          </div>
          <div className="comment-text">{commentText}</div>
        </div>
      </div>
    );
  };

  const renderComments = () => {
    if (!post.comments || post.comments.length === 0) return null;

    return (
      <div className="post-comments-section">
        <div className="comments-list">
          {displayedComments.map((comment, index) => 
            renderComment(comment, index)
          )}
        </div>

        {hasMoreComments && (
          <button 
            className="btn-toggle-comments"
            onClick={toggleShowAllComments}
          >
            {showAllComments ? (
              <>
                <i className="fa-solid fa-chevron-up"></i>
                <span>Ẩn bớt</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-chevron-down"></i>
                <span>Xem thêm {post.comments.length - 3} bình luận</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <article className="post-item">
      <header className="post-header">
        {renderPostAuthor()}
        {renderPostActions()}
      </header>

      {renderPostContent()}
      {renderPostStats()}

      {showActions && <div className="post-divider" />}

      {renderInteractionBar()}
      {renderCommentForm()}
      {renderComments()}
    </article>
  );
};

export default PostItem;