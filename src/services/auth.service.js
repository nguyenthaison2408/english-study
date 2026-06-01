// src/services/auth.service.js
import axiosInstance from '../utils/axios.config';

class AuthService {
  // ================= AUTH =================
  async register(data) {
    const response = await axiosInstance.post('/users/', data);
    return response.data;
  }

  async login(data) {
    const response = await axiosInstance.post('/auth/', data);
    return response.data; // { token }
  }

  async getCurrentUserFromAPI() {
    const response = await axiosInstance.get('/auth/');
    return response.data;
  }

  logout() {
    localStorage.removeItem('x-auth-token');
    localStorage.removeItem('user');
  }

  getCurrentUserFromStorage() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('x-auth-token');
  }

  saveToken(token) {
    localStorage.setItem('x-auth-token', token);
  }

  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // ================= USER =================
  async getAllUser() {
    const response = await axiosInstance.get('/users/');
    return response.data;
  }

  async updateUser(data, userId) {
    const response = await axiosInstance.put(`/users/${userId}`, data);
    return response.data;
  }

  async addXp(userId, xp) {
    const response = await axiosInstance.post(
      `/users/${userId}/xp`,
      { xp }
    );
    return response.data;
  }

  // ================= FRIEND =================
  async addFriends(receiverId) {
    const response = await axiosInstance.post(
      '/users/friend-request',
      { receiverId }
    );
    return response.data;
  }

  async getFriend() {
    const response = await axiosInstance.get('/users/my-friends');
    return response.data;
  }

  // ================= NOTIFICATION / FRIEND REQUEST =================
  async getPendingFriendRequests() {
    const response = await axiosInstance.get(
      '/users/friend-requests/pending'
    );
    return response.data;
  }

  async acceptFriendRequest(requestId) {
    const response = await axiosInstance.post(
      `/users/friend-request/${requestId}/accept`
    );
    return response.data;
  }

  async rejectFriendRequest(requestId) {
    const response = await axiosInstance.post(
      `/users/friend-request/${requestId}/reject`
    );
    return response.data;
  }

  async cancelFriendRequest(requestId) {
    const response = await axiosInstance.delete(
      `/users/friend-request/${requestId}`
    );
    return response.data;
  }

  async removeFriend(friendId) {
    const response = await axiosInstance.delete(
      `/users/friends/${friendId}`
    );
    return response.data;
  }
}

export default new AuthService();
