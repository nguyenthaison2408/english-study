// src/contexts/PostContext.js
import React, { createContext, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import selectVocalService from '../services/select.vocal.service';

export const VocalContext = createContext();

export const VocProvider = ({ children }) => {

  const [voc, setVoc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
const { user, isAuthenticated } = useAuth();

  // Lấy all posts
  const getAllVoc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const vocData = await selectVocalService.getAllVoc();
      setVoc(vocData);
      return { success: true, data: vocData };
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi tải từ vựng';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get post by ID
  const getVocById = useCallback(async (id) => {
    try {
      setLoading(true);
      const post = await selectVocalService.getVocById(id);
      return { success: true, data: post };
    } catch (error) {
      const message = error.response?.data?.message || 'Không tìm thấy từ vựng';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);



  // // Update post
  // const updateVoc = useCallback(async (id, vocData) => {
  //   if (!isAuthenticated) {
  //     const message = 'Vui lòng đăng nhập';
  //     return { success: false, error: message };
  //   }

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const updatedPost = await selectVocalService.updateVoc(id, vocData);
      
     
  //     return { success: true, data: updatedPost };
  //   } catch (error) {
  //     const message = error.response?.data?.message || 'Lỗi khi cập nhật voc';
  //     setError(message);
  //     return { success: false, error: message };
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [isAuthenticated, currentPost]);


  const updateVoc = useCallback(async (id, vocData) => {
  if (!isAuthenticated) {
    const message = 'Vui lòng đăng nhập';
    return { success: false, error: message };
  }

  try {
    setLoading(true);
    setError(null);
    
    // LOG để debug
    console.log("Updating vocab ID:", id);
    console.log("Data to send:", vocData);
    
    // Gửi dữ liệu theo đúng format backend yêu cầu
    const updateData = {
      user_learned: vocData.user_learned // Nếu chỉ cần thêm user
      // Hoặc giữ nguyên vocData nếu đã có $addToSet
    };
    
    const response = await selectVocalService.updatePost(id, updateData);
    
    console.log("Update response:", response);
    
    // Cập nhật local state
    setVoc(prev => 
      prev.map(item => {
        if (item._id === id) {
          const updatedUserLearned = [...(item.user_learned || [])];
          const username = vocData.user_learned || vocData.$addToSet?.user_learned;
          
          if (username && !updatedUserLearned.includes(username)) {
            updatedUserLearned.push(username);
          }
          
          return { 
            ...item, 
            user_learned: updatedUserLearned,
            ...response.data 
          };
        }
        return item;
      })
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Update error details:", error);
    
    const message = error.response?.data?.message 
      || error.response?.data?.error 
      || error.message 
      || 'Lỗi khi cập nhật voc';
    
    setError(message);
    return { success: false, error: message };
  } finally {
    setLoading(false);
  }
}, [isAuthenticated]);





  // // Create post
  // const createPost = useCallback(async (postData) => {
  //   if (!isAuthenticated) {
  //     const message = 'Vui lòng đăng nhập để đăng bài';
  //     return { success: false, error: message };
  //   }

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const newPost = await postService.createPost(postData);
      
  //     // Thêm bài viết mới vào đầu danh sách
  //     setPosts(prevPosts => [newPost, ...prevPosts]);
      
  //     return { success: true, data: newPost };
  //   } catch (error) {
  //     const message = error.response?.data?.message || 'Lỗi khi đăng bài';
  //     setError(message);
  //     return { success: false, error: message };
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [isAuthenticated]);

  

  // // Delete post
  // const deletePost = useCallback(async (id) => {
  //   if (!isAuthenticated) {
  //     const message = 'Vui lòng đăng nhập';
  //     return { success: false, error: message };
  //   }

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     await postService.deletePost(id);
      
  //     // Xóa bài viết khỏi danh sách
  //     setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
      
  //     // Clear current post nếu đang edit bài viết bị xóa
  //     if (currentPost?._id === id) {
  //       setCurrentPost(null);
  //     }
      
  //     return { success: true };
  //   } catch (error) {
  //     const message = error.response?.data?.message || 'Lỗi khi xóa bài viết';
  //     setError(message);
  //     return { success: false, error: message };
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [isAuthenticated, currentPost]);

  // // Like post
  // const likePost = useCallback(async (id) => {
  //   if (!isAuthenticated) {
  //     const message = 'Vui lòng đăng nhập để thích bài viết';
  //     return { success: false, error: message };
  //   }

  //   try {
  //     const updatedPost = await postService.likePost(id);
      
  //     // Cập nhật bài viết trong danh sách
  //     setPosts(prevPosts => 
  //       prevPosts.map(post => post._id === id ? updatedPost : post)
  //     );
      
  //     return { success: true, data: updatedPost };
  //   } catch (error) {
  //     const message = error.response?.data?.message || 'Lỗi khi thích bài viết';
  //     return { success: false, error: message };
  //   }
  // }, [isAuthenticated]);

  // // Comment post
  // const commentPost = useCallback(async (id, commentText) => {
  //   if (!isAuthenticated) {
  //     const message = 'Vui lòng đăng nhập để bình luận';
  //     return { success: false, error: message };
  //   }

  //   if (!commentText || !commentText.trim()) {
  //     const message = 'Nội dung bình luận không được để trống';
  //     return { success: false, error: message };
  //   }

  //   try {
  //     const updatedPost = await postService.commentPost(id, commentText);
      
  //     // Cập nhật bài viết với comment mới
  //     setPosts(prevPosts => 
  //       prevPosts.map(post => post._id === id ? updatedPost : post)
  //     );
      
  //     return { success: true, data: updatedPost };
  //   } catch (error) {
  //     const message = error.response?.data?.message || 'Lỗi khi gửi bình luận';
  //     return { success: false, error: message };
  //   }
  // }, [isAuthenticated]);

  // // Helper: Kiểm tra user có phải tác giả bài viết không
  // const isPostAuthor = useCallback((postId) => {
  //   if (!user || !postId) return false;
  //   const post = posts.find(p => p._id === postId);
  //   return post?.author?._id === user._id;
  // }, [user, posts]);

  // // Set bài viết để edit
  // const setPostForEdit = useCallback((post) => {
  //   setCurrentPost(post);
  // }, []);

  // // Clear current post
  // const clearCurrentPost = useCallback(() => {
  //   setCurrentPost(null);
  // }, []);

  // // Clear error
  // const clearError = useCallback(() => {
  //   setError(null);
  // }, []);

  const value = {
    // State
    voc,
    loading,
    error,
    currentPost,
    
    // CRUD Operations
    getAllVoc,
    getVocById,
    updateVoc,
    // createPost,
    // updatePost,
    // deletePost,
    // likePost,
    // commentPost, 
    
    // Helper functions
    // isPostAuthor,
    // setPostForEdit,
    // clearCurrentPost,
    // clearError,
  };

  return (
    <VocalContext.Provider value={value}>
      {children}
    </VocalContext.Provider>
  );
};