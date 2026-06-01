import axios from '../utils/axios.config'; // Đảm bảo đường dẫn này đúng với file cấu hình axios của bạn

// 1. Hàm tạo mới (Bạn đã có)
const postCreateNewQuiz = (data) => {
    return axios.post('/api/quizzes', data);
}

// 2. Hàm lấy tất cả danh sách (CẦN THÊM CÁI NÀY)
// Để trang QuizListByPart có thể gọi dữ liệu về hiển thị
const getAllQuiz = () => {
    return axios.get('/api/quizzes'); 
}

// 3. Export cả 2 hàm ra
export { postCreateNewQuiz, getAllQuiz };