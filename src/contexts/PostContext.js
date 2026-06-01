// src/contexts/PostContext.js
import React, { createContext, useState, useCallback } from 'react';
import postService from '../services/post.service';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);

  // Lấy all posts
  const getAllPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const postsData = await postService.getAllPosts();
      setPosts(postsData);
      return { success: true, data: postsData };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải bài viết';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get post by ID
  const getPostById = useCallback(async (id) => {
    try {
      setLoading(true);
      const post = await postService.getPostById(id);
      return { success: true, data: post };
    } catch (error) {
      const message = error.response?.data?.message || 'Không tìm thấy bài viết';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create post
  const createPost = useCallback(async (postData) => {
    if (!isAuthenticated) {
      const message = 'Vui lòng đăng nhập để đăng bài';
      return { success: false, error: message };
    }

    try {
      setLoading(true);
      setError(null);
      const newPost = await postService.createPost(postData);
      
      // Thêm bài viết mới vào đầu danh sách
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      return { success: true, data: newPost };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi đăng bài';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update post
  const updatePost = useCallback(async (id, postData) => {
    if (!isAuthenticated) {
      const message = 'Vui lòng đăng nhập';
      return { success: false, error: message };
    }

    try {
      setLoading(true);
      setError(null);
      const updatedPost = await postService.updatePost(id, postData);
      
      // Cập nhật bài viết trong danh sách
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === id ? updatedPost : post)
      );
      
      // Clear current post sau khi update
      if (currentPost?._id === id) {
        setCurrentPost(null);
      }
      
      return { success: true, data: updatedPost };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi cập nhật bài viết';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentPost]);

  // Delete post
  const deletePost = useCallback(async (id) => {
    if (!isAuthenticated) {
      const message = 'Vui lòng đăng nhập';
      return { success: false, error: message };
    }

    try {
      setLoading(true);
      setError(null);
      await postService.deletePost(id);
      
      // Xóa bài viết khỏi danh sách
      setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
      
      // Clear current post nếu đang edit bài viết bị xóa
      if (currentPost?._id === id) {
        setCurrentPost(null);
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi xóa bài viết';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentPost]);

  // Like post
  const likePost = useCallback(async (id) => {
    if (!isAuthenticated) {
      const message = 'Vui lòng đăng nhập để thích bài viết';
      return { success: false, error: message };
    }

    try {
      const updatedPost = await postService.likePost(id);
      
      // Cập nhật bài viết trong danh sách
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === id ? updatedPost : post)
      );
      
      return { success: true, data: updatedPost };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi thích bài viết';
      return { success: false, error: message };
    }
  }, [isAuthenticated]);

  // Comment post
  const commentPost = useCallback(async (id, commentText) => {
    if (!isAuthenticated) {
      const message = 'Vui lòng đăng nhập để bình luận';
      return { success: false, error: message };
    }

    if (!commentText || !commentText.trim()) {
      const message = 'Nội dung bình luận không được để trống';
      return { success: false, error: message };
    }

    try {
      const updatedPost = await postService.commentPost(id, commentText);
      
      // Cập nhật bài viết với comment mới
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === id ? updatedPost : post)
      );
      
      return { success: true, data: updatedPost };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi gửi bình luận';
      return { success: false, error: message };
    }
  }, [isAuthenticated]);

  // Helper: Kiểm tra user có phải tác giả bài viết không
  const isPostAuthor = useCallback((postId) => {
    if (!user || !postId) return false;
    const post = posts.find(p => p._id === postId);
    return post?.author?._id === user._id;
  }, [user, posts]);

  // Set bài viết để edit
  const setPostForEdit = useCallback((post) => {
    setCurrentPost(post);
  }, []);

  // Clear current post
  const clearCurrentPost = useCallback(() => {
    setCurrentPost(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    // State
    posts,
    loading,
    error,
    currentPost,
    
    // CRUD Operations
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    commentPost, 
    
    // Helper functions
    isPostAuthor,
    setPostForEdit,
    clearCurrentPost,
    clearError,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};