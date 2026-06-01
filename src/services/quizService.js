import axios from '../utils/axios.config'; 

// 1. Tạo mới Quiz
const postCreateNewQuiz = async (data) => {
    return axios.post('/quizzes', data);
}

// 2. Lấy tất cả danh sách Quiz
const getAllQuiz = async () => {
    return axios.get('/quizzes');
}

// 3. Lấy chi tiết 1 bài Quiz theo ID
const getQuizById = async (id) => {
    return axios.get(`/quizzes/${id}`);
}

// 4. Cập nhật bài Quiz
const putUpdateQuiz = async (id, data) => {
    return axios.put(`/quizzes/${id}`, data);
}

// 5. Nộp bài thi
const postSubmitQuiz = async (data) => {
    return axios.post('/quizzes/submit', data);
}

// 6. Xem kết quả chi tiết 1 bài thi (theo ID kết quả)
const getQuizResultById = async (id) => {
    return axios.get(`/quizzes/submit/${id}`);
}

// 7. Xóa bài Quiz
const deleteQuiz = async (id) => {
    return axios.delete(`/quizzes/${id}`);
}

// 8. Upload file
const postUploadFile = async (fileData) => {
    return axios.post('/files/upload', fileData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

// 9. Lấy danh sách lịch sử làm bài
const getQuizHistory = async () => {
    return axios.get('/quizzes/submit'); 
}

// 10. Hàm gọi AI (Gemini)
const postAskAI = async (data) => {
    // ✅ ĐÃ SỬA: Xóa chữ /api đi, chỉ để lại /gemini/explain
    // Vì axios.config.js đã tự động thêm /api vào trước rồi
    return axios.post('/gemini/explain', data);
}

// Alias
const getAIExplanation = postAskAI;

export { 
    postCreateNewQuiz, 
    getAllQuiz, 
    getQuizById, 
    putUpdateQuiz, 
    postSubmitQuiz, 
    getQuizResultById,
    deleteQuiz,
    postUploadFile,
    getQuizHistory,
    postAskAI,
    getAIExplanation 
};