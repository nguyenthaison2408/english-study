import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaCheckCircle, FaTimesCircle, FaArrowLeft, FaClock, FaTrophy, 
    FaList, FaSpinner, FaExclamationTriangle, FaRobot, FaLightbulb 
} from 'react-icons/fa';
import { getQuizResultById, postAskAI } from '../../services/quizService'; 
import './QuizResult.scss';

const QuizResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State cho AI
    const [explainingId, setExplainingId] = useState(null); // ID câu đang loading
    const [explanations, setExplanations] = useState({});   // Lưu kết quả AI trả về

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await getQuizResultById(id);
                // Xử lý linh hoạt: nếu res có data thì lấy res.data, nếu không thì lấy chính res
                const data = res.data || res;
                setResult(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    const formatTime = (seconds) => {
        if (!seconds) return "0s";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}p ${s}s`;
    };

    // --- HÀM XỬ LÝ GỌI AI (ĐÃ FIX LỖI) ---
// --- HÀM XỬ LÝ GỌI AI (ĐÃ NÂNG CẤP LÀM SẠCH TEXT) ---
    const handleAskAI = async (answerData, questionInfo) => {
        const qId = answerData.questionId;
        
        if (explanations[qId]) return;

        setExplainingId(qId);

        try {
            const payload = {
                questionText: questionInfo.questionText?.[0] || "Câu hỏi hình ảnh/âm thanh",
                options: questionInfo.options || [],
                userAnswer: answerData.selectedOption,
                correctAnswer: questionInfo.correctAnswer
            };

            const res = await postAskAI(payload);
            const dataFromServer = res.data || res;
            let textExplanation = dataFromServer.explanation;

            // 🧹 LÀM SẠCH TEXT: Xóa ###, **, và các khoảng trắng thừa
            if (textExplanation) {
                textExplanation = textExplanation
                    .replace(/###/g, '')   // Xóa dấu Heading
                    .replace(/\*\*/g, '')  // Xóa dấu in đậm
                    .replace(/\*/g, '•')   // Thay dấu * thành dấu chấm tròn cho đẹp
                    .trim();               // Cắt khoảng trắng đầu đuôi
                
                setExplanations(prev => ({
                    ...prev,
                    [qId]: textExplanation
                }));
            } else {
                alert("AI không trả về nội dung. Thử lại sau!");
            }
        } catch (error) {
            console.error("Lỗi AI:", error);
            if (error.response && error.response.status === 429) {
                alert("AI đang bận (429). Đợi 1 phút nhé.");
            } else {
                alert("Lỗi kết nối AI.");
            }
        } finally {
            setExplainingId(null);
        }
    };

    if (loading) return (
        <div className="result-loading">
            <FaSpinner className="spinner-icon" />
            <p>Đang tổng hợp kết quả...</p>
        </div>
    );

    if (!result) return (
        <div className="result-error">
            <FaExclamationTriangle size={48} />
            <h2>Không tìm thấy kết quả!</h2>
            <button onClick={() => navigate('/exams')}>Quay lại</button>
        </div>
    );

    const { quizId: quizInfo, score, answers, timeSpent } = result;
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100) || 0;

    const getScoreColor = () => {
        if (percentage >= 80) return "high";
        if (percentage >= 50) return "medium";
        return "low";
    };

    return (
        <div className="quiz-result-page">
            <div className="result-container">
                <button className="btn-back" onClick={() => navigate('/exams')}>
                    <FaArrowLeft /> Quay lại danh sách
                </button>

                <header className="result-header">
                    <h1>{quizInfo?.title || "KẾT QUẢ BÀI THI"}</h1>
                    <div className="result-date">Hoàn thành lúc: {new Date().toLocaleTimeString()}</div>
                </header>

                <section className="stats-grid">
                    <div className={`stat-card score-card ${getScoreColor()}`}>
                        <div className="icon-wrapper"><FaTrophy /></div>
                        <div className="stat-info">
                            <span className="label">Điểm số</span>
                            <span className="value">{score}</span>
                        </div>
                    </div>
                    <div className="stat-card correct-card">
                        <div className="icon-wrapper"><FaCheckCircle /></div>
                        <div className="stat-info">
                            <span className="label">Chính xác</span>
                            <span className="value">{correctCount}/{totalQuestions}</span>
                        </div>
                    </div>
                    <div className="stat-card time-card">
                        <div className="icon-wrapper"><FaClock /></div>
                        <div className="stat-info">
                            <span className="label">Thời gian</span>
                            <span className="value">{formatTime(timeSpent)}</span>
                        </div>
                    </div>
                </section>

                <section className="details-section">
                    <h3 className="section-title"><FaList /> Chi tiết bài làm</h3>
                    
                    <div className="answers-grid">
                        {answers.map((ans, index) => {
                            // Lấy thông tin câu hỏi gốc
                            const originalQuestion = quizInfo?.questions?.find(q => q._id === ans.questionId) || {};

                            return (
                                <div key={index} className={`answer-card ${ans.isCorrect ? 'correct' : 'wrong'}`}>
                                    <div className="card-header">
                                        <span className="question-num">Câu {index + 1}</span>
                                        <span className={`status-badge ${ans.isCorrect ? 'success' : 'danger'}`}>
                                            {ans.isCorrect ? <><FaCheckCircle /> Đúng</> : <><FaTimesCircle /> Sai</>}
                                        </span>
                                    </div>
                                    
                                    <div className="card-body">
                                        {/* Preview đề bài */}
                                        <p className="question-preview" style={{fontStyle: 'italic', color: '#666', marginBottom: '15px'}}>
                                            {originalQuestion.questionText?.[0]?.substring(0, 120)}...
                                        </p>

                                        <p className="selection-label">Bạn đã chọn:</p>
                                        <div className="selected-option">
                                            {ans.selectedOption || <span className="empty-answer">(Bỏ trống)</span>}
                                        </div>

                                        {/* Khu vực xử lý khi SAI */}
                                        {!ans.isCorrect && (
                                            <div className="correction-area">
                                                <div className="correct-answer-box">
                                                    Đáp án đúng: <strong>{originalQuestion.correctAnswer}</strong>
                                                </div>
                                                
                                                {/* Nút bấm gọi AI (Chỉ hiện khi chưa có lời giải) */}
                                                {!explanations[ans.questionId] && (
                                                    <button 
                                                        className="btn-ask-ai"
                                                        onClick={() => handleAskAI(ans, originalQuestion)}
                                                        disabled={explainingId === ans.questionId}
                                                    >
                                                        {explainingId === ans.questionId ? (
                                                            <><FaSpinner className="spinner-icon"/> Đang hỏi AI...</>
                                                        ) : (
                                                            <><FaRobot /> Tại sao tôi sai?</>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Khu vực hiển thị kết quả AI trả về */}
                                        {explanations[ans.questionId] && (
                                            <div className="ai-explanation-box">
                                                <div className="ai-header">
                                                    <FaLightbulb color="#FFD700" /> Giải thích từ AI:
                                                </div>
                                                {/* Thêm style để hiển thị xuống dòng đúng format */}
                                                <div className="ai-content" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                                    {explanations[ans.questionId]}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default QuizResult;