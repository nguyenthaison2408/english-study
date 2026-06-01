import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { FaClock, FaArrowLeft, FaCheckCircle, FaVolumeUp, FaLayerGroup } from 'react-icons/fa';
import { getQuizById, postSubmitQuiz } from '../../services/quizService';
import './TakeExamPart4.scss';

const TakeExamPart4 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [quizData, setQuizData] = useState(null);
    const [questions, setQuestions] = useState([]); // Mảng phẳng để tính toán
    const [groupedQuestions, setGroupedQuestions] = useState([]); // Mảng đã chia nhóm để hiển thị
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");

    // Hàm chia mảng thành các nhóm nhỏ (size = 3)
    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuizById(id);
                let data = response?.data || response;
                if (data?.DT) data = data.DT;

                setQuizData(data);
                setTimeLeft((data.timeLimit || 45) * 60);
                
                // Lấy trực tiếp URL từ Cloudinary
                setAudioUrl(data.audio || "");

                const rawQuestions = data.questions || [];
                const processedQuestions = rawQuestions.map((q, idx) => ({
                    _id: q._id,
                    questionNum: idx + 1,
                    questionText: Array.isArray(q.questionText) ? q.questionText.join(" ") : (q.questionText || ""),
                    options: q.options || [],
                    questionImage: q.questionImage || "" 
                }));

                setQuestions(processedQuestions);
                
                // --- Part 4: Short Talks cũng chia nhóm 3 câu ---
                setGroupedQuestions(chunkArray(processedQuestions, 3));

            } catch (err) {
                setError(err.message || "Lỗi tải đề thi");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

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
                selectedOption // GIỮ NGUYÊN: "A", "B", "C", "D"
            }));
            
            const totalTime = (quizData?.timeLimit || 45) * 60;
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

    // --- TIMER FIX ---
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

    const handleSelectAnswer = (questionId, optionLabel) => {
        if (submitting) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: optionLabel }));
    };

    if (loading) return <div className="text-center pt-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Container className="pt-5"><Alert variant="danger">{error}</Alert></Container>;
    
    return (
        <div className="take-exam-part4">
            <div className="exam-header sticky-top bg-white shadow-sm">
                <Container fluid="lg">
                    <div className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center gap-3">
                            <Button variant="light" className="btn-icon-text border" onClick={() => navigate(-1)}>
                                <FaArrowLeft/> <span className="d-none d-sm-inline">Thoát</span>
                            </Button>
                            <h5 className="m-0 fw-bold text-dark d-none d-md-block">
                                {quizData?.title || "Part 4: Short Talks"}
                            </h5>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <div className={`timer-box ${timeLeft < 300 ? 'danger' : ''}`}>
                                <FaClock className="me-2"/> {formatTime(timeLeft)}
                            </div>
                            <Button 
                                variant="success" 
                                className="btn-submit fw-bold px-4" 
                                onClick={handleSubmit} 
                                disabled={submitting}
                            >
                                {submitting ? <Spinner size="sm"/> : 'NỘP BÀI'}
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="py-4 main-container">
                {audioUrl && (
                    <Card className="audio-card mb-4 border-0 shadow-sm sticky-audio">
                        <Card.Body className="d-flex align-items-center gap-3 p-3">
                            <div className="audio-icon-box bg-success text-white rounded-circle p-3">
                                <FaVolumeUp size={24} />
                            </div>
                            <div className="w-100">
                                <h6 className="fw-bold mb-1 text-success">🎧 Audio Part 4</h6>
                                <audio 
                                    controls 
                                    className="w-100 custom-audio"
                                    preload="metadata"
                                    controlsList="nodownload"
                                >
                                    <source src={audioUrl} type="audio/mpeg" />
                                    <source src={audioUrl} type="audio/mp3" />
                                    Trình duyệt của bạn không hỗ trợ audio player.
                                </audio>
                            </div>
                        </Card.Body>
                    </Card>
                )}

                <Row>
                    <Col xs={12}>
                        {groupedQuestions.map((group, groupIndex) => {
                            const startNum = group[0]?.questionNum;
                            const endNum = group[group.length - 1]?.questionNum;
                            // Kiểm tra ảnh dùng chung cho cả Talk (biểu đồ)
                            const groupImage = group.find(q => q.questionImage)?.questionImage;

                            return (
                                <Card key={groupIndex} className="talk-group mb-5 shadow-sm border-0">
                                    <Card.Header className="bg-white border-bottom py-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <FaLayerGroup className="text-primary"/>
                                            {/* Thay đổi text thành TALK */}
                                            <h6 className="m-0 fw-bold text-primary text-uppercase">
                                                Talk {groupIndex + 1} 
                                                <span className="text-muted ms-2 normal-case">(Questions {startNum} - {endNum})</span>
                                            </h6>
                                        </div>
                                    </Card.Header>
                                    
                                    <Card.Body className="p-4">
                                        {groupImage && (
                                            <div className="text-center mb-4">
                                                <img 
                                                    src={groupImage} 
                                                    alt={`Talk ${groupIndex + 1} Graphic`} 
                                                    className="img-fluid rounded border" 
                                                    style={{maxHeight:'300px', objectFit: 'contain'}} 
                                                />
                                                <p className="text-muted small mt-1 fst-italic">Look at the graphic</p>
                                            </div>
                                        )}

                                        <div className="questions-list">
                                            {group.map((q) => {
                                                const isAnswered = !!userAnswers[q._id];
                                                return (
                                                    <div key={q._id} className={`individual-question mb-4 ${isAnswered ? 'is-answered' : ''}`}>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="fw-bold text-dark d-flex gap-2">
                                                                <span className="question-number-badge">{q.questionNum}.</span>
                                                                <span>{q.questionText}</span>
                                                            </div>
                                                            {isAnswered && <FaCheckCircle className="text-success flex-shrink-0 ms-2" />}
                                                        </div>

                                                        <div className="options-grid ms-md-4">
                                                            {q.options.map((opt, idx) => {
                                                                const label = ['A', 'B', 'C', 'D'][idx];
                                                                const isSelected = userAnswers[q._id] === label;
                                                                
                                                                return (
                                                                    <div 
                                                                        key={idx} 
                                                                        className={`option-item d-flex align-items-center py-2 px-3 rounded mb-2 ${isSelected ? 'selected' : ''}`}
                                                                        onClick={() => handleSelectAnswer(q._id, label)}
                                                                        style={{ cursor: submitting ? 'not-allowed' : 'pointer' }}
                                                                    >
                                                                        <div className={`option-radio me-2 ${isSelected ? 'checked' : ''}`}>
                                                                            {label}
                                                                        </div>
                                                                        <div className="option-text">
                                                                            {opt.text}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        {group.indexOf(q) < group.length - 1 && <hr className="divider-dashed"/>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default TakeExamPart4;