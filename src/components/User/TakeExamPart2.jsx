import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaClock, FaArrowLeft, FaCheckCircle, FaVolumeUp, 
    FaHeadphones, FaSpinner, FaExclamationCircle 
} from 'react-icons/fa';
import { getQuizById, postSubmitQuiz } from '../../services/quizService'; 
import './TakeExamPart2.scss';

const TakeExamPart2 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [quizData, setQuizData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuizById(id);
                let data = response?.data || response;
                if (data?.DT) data = data.DT;

                setQuizData(data);
                setTimeLeft((data.timeLimit || 30) * 60);
                
                // Lấy trực tiếp URL từ Cloudinary
                setAudioUrl(data.audio || "");

                const rawQuestions = data.questions || [];
                const processedQuestions = rawQuestions.map((q, idx) => ({
                    _id: q._id,
                    questionNum: idx + 1,
                    questionText: Array.isArray(q.questionText) ? q.questionText.join(" ") : (q.questionText || ""),
                    options: q.options || [],
                    correctAnswer: q.correctAnswer || ""
                }));

                setQuestions(processedQuestions);
            } catch (err) {
                setError(err.message || "Lỗi tải đề thi");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    // --- SUBMIT LOGIC ---
    const handleSubmit = useCallback(async () => {
        if (submitting) return;

        const answeredCount = Object.keys(userAnswers).length;
        if (timeLeft > 0 && answeredCount < questions.length) {
            if (!window.confirm(`Bạn mới trả lời ${answeredCount}/${questions.length} câu. Bạn có chắc chắn muốn nộp bài?`)) return;
        }

        setSubmitting(true);
        try {
            const answers = Object.entries(userAnswers).map(([questionId, selectedOption]) => ({
                questionId, 
                selectedOption // GIỮ NGUYÊN: "A", "B", "C"
            }));
            
            const totalTime = (quizData?.timeLimit || 30) * 60;
            const timeSpent = totalTime - timeLeft;

            const submitData = {
                quizId: id,
                answers: answers,
                timeSpent: timeSpent > 0 ? timeSpent : 0
            };

            const response = await postSubmitQuiz(submitData);
            const resultData = response.data || response;
            
            // Tìm ID kết quả để redirect
            const resultId = resultData.DT?._id || resultData._id || resultData.data?._id;

            if (resultId) {
                navigate(`/quiz-result/${resultId}`);
            } else {
                navigate('/exams');
            }
        } catch (err) {
            console.error("Lỗi nộp bài:", err);
            alert("Có lỗi xảy ra khi nộp bài!");
            setSubmitting(false);
        }
    }, [questions, userAnswers, id, quizData, timeLeft, navigate, submitting]);

    // --- TIMER ---
    useEffect(() => {
        if (timeLeft === 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const handleSelectAnswer = (questionId, option) => {
        if (submitting) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    // --- RENDERING ---
    if (loading) return (
        <div className="loading-screen">
            <FaSpinner className="spinner-icon" />
            <p>Đang tải dữ liệu bài thi...</p>
        </div>
    );

    if (error) return (
        <div className="error-screen">
            <FaExclamationCircle size={40} className="text-danger mb-3" />
            <h3>Đã có lỗi xảy ra</h3>
            <p>{error}</p>
            <button className="btn-back" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
    );
    
    return (
        <div className="take-exam-white-theme">
            {/* HEADER */}
            <header className="exam-header">
                <div className="header-container">
                    {/* Cột 1: Bên trái */}
                    <div className="left-section">
                        <button className="btn-nav-back" onClick={() => navigate(-1)}>
                            <FaArrowLeft/> <span>Thoát</span>
                        </button>
                    </div>

                    {/* Cột 2: Ở giữa */}
                    <div className="exam-title-box">
                        <h1>{quizData?.title || "Listening Part 2"}</h1>
                        <span className="subtitle">Question-Response</span>
                    </div>

                    {/* Cột 3: Bên phải */}
                    <div className="exam-controls">
                        <div className={`timer-badge ${timeLeft < 300 ? 'urgent' : ''}`}>
                            <FaClock /> {formatTime(timeLeft)}
                        </div>
                        <button 
                            className="btn-primary-submit" 
                            onClick={handleSubmit} 
                            disabled={submitting}
                        >
                            {submitting ? <FaSpinner className="spinner-icon" /> : 'NỘP BÀI'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="exam-content">
                {/* AUDIO PLAYER */}
                {audioUrl && (
                    <div className="audio-sticky-wrapper">
                        <div className="audio-player-glass">
                            <div className="icon-wrap">
                                <FaVolumeUp />
                            </div>
                            <div className="player-wrap">
                                <span className="label">🎧 AUDIO TRACK</span>
                                <audio 
                                    controls 
                                    className="native-audio"
                                    preload="metadata"
                                    controlsList="nodownload"
                                >
                                    <source src={audioUrl} type="audio/mpeg" />
                                    <source src={audioUrl} type="audio/mp3" />
                                    Trình duyệt của bạn không hỗ trợ audio player.
                                </audio>
                            </div>
                        </div>
                    </div>
                )}

                {/* QUESTIONS GRID */}
                <div className="questions-grid">
                    {questions.map((q) => {
                        const isAnswered = !!userAnswers[q._id];
                        return (
                            <div key={q._id} className={`question-card-minimal ${isAnswered ? 'done' : ''}`}>
                                <div className="card-header-minimal">
                                    <span className="q-tag">Question {q.questionNum}</span>
                                    {isAnswered ? 
                                        <FaCheckCircle className="status-icon success" /> : 
                                        <FaHeadphones className="status-icon pending" />
                                    }
                                </div>
                                
                                <div className="options-wrapper">
                                    {['A', 'B', 'C'].map((label) => {
                                        const isSelected = userAnswers[q._id] === label;
                                        return (
                                            <button 
                                                key={label}
                                                className={`option-circle ${isSelected ? 'active' : ''}`}
                                                onClick={() => handleSelectAnswer(q._id, label)}
                                                disabled={submitting}
                                            >
                                                {label}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="card-footer-hint">Select one answer</div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default TakeExamPart2;