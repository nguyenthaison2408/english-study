import axiosInstance from '../utils/axios.config';

const paymentService = {
  // Tạo URL thanh toán
  createPaymentUrl: async (quizId, orderInfo, amount = 50000) => {
    try {
      const response = await axiosInstance.post('/vnpay', {quizId,orderInfo,amount});
      return response.data;
    } catch (error) {
      console.error('Error creating payment URL:', error);
      throw error;
    }
  },

  // Xử lý callback thanh toán
  handlePaymentCallback: async (queryParams) => {
    try {
      const response = await axiosInstance.get('/vnpay/callback', {params: queryParams});
      return response.data;
    } catch (error) {
      console.error('Error handling payment callback:', error);
      throw error;
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (quizId) => {
    try {
      const response = await axiosInstance.get(`/vnpay/check/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }
};

export default paymentService;