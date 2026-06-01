import axiosInstance from '../utils/axios.config';


class PostService {

    async getAllPosts() {
    const response = await axiosInstance.get('/posts/');
    return response.data;
  }

  // Lấy bài viết theo ID
  async getPostById(id) {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  }


   // Tạo bài viết mới
  async createPost(postData) {
    const response = await axiosInstance.post('/posts/', postData);
    return response.data;
  }

    // Cập nhật bài viết
  async updatePost(id, postData) {
    const response = await axiosInstance.put(`/posts/${id}`, postData);
    return response.data;
  }


    // Xóa bài viết
  async deletePost(id) {
    const response = await axiosInstance.delete(`/posts/${id}`);
    return response.data;
  }

    // Like bài viết
  async likePost(id) {
    const response = await axiosInstance.put(`/posts/like/${id}`);
    return response.data;
  }


    // Like bài viết
  async unlikePost(id) {
    const response = await axiosInstance.post(`/posts/unlike/${id}`);
    return response.data;
  }


    // Comment bài viết
  async commentPost(id, comment) {

     const commentData = {
    content: comment, 
  };
    const response = await axiosInstance.post(`/posts/comments/${id}`,commentData);
    return response.data;
  }


    // Xóa comment
  async deleteComment(id) {
    const response = await axiosInstance.delete(`/posts/comments/${id}`);
    return response.data;
  }
}
export default new PostService();




