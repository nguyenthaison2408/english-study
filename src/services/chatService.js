// src/services/chat.service.js
import axiosInstance from '../utils/axios.config';

class ChatService {

  // gửi tin nhắn
  async sendChat(to, text) {
    const response = await axiosInstance.post('/chats', {to,text});
    return response.data;
  }

  // lấy danh sách chat
  async getChats() {
    const response = await axiosInstance.get('/chats');
    return response.data;
  }
}

export default new ChatService();
